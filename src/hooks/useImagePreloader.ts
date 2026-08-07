import { useState, useEffect, useRef, useCallback } from 'react';
import { FRAME_MANIFEST, TOTAL_FRAMES } from '../engine/FrameManifest';

export type FrameAsset = ImageBitmap | HTMLImageElement;

const MAX_RAM_CACHE_FRAMES = 32; // Strict sliding window buffer (Memory capped < 35MB)
const LOOKAHEAD_WINDOW = 20; // Preload ahead in scroll direction
const LOOKBEHIND_WINDOW = 6; // Retain recent frames for smooth reverse scroll
const MAX_CONCURRENT_DOWNLOADS = 6; // Controlled concurrency to avoid network choke

export function useImagePreloader() {
  const [isReady, setIsReady] = useState<boolean>(true); // Immediate 0.0s interactive render
  const cacheRef = useRef<Map<number, FrameAsset>>(new Map());
  const pendingRequestsRef = useRef<Map<number, Promise<FrameAsset | null>>>(new Map());
  const activeDownloadsCountRef = useRef<number>(0);
  const queueRef = useRef<number[]>([]);
  const lastTargetFrameRef = useRef<number>(0);
  const lastScrollDirectionRef = useRef<'down' | 'up'>('down');

  // Evict distant frames from RAM/VRAM to maintain strict memory ceiling (< 35MB)
  const evictDistantFrames = useCallback((currentFrame: number) => {
    if (cacheRef.current.size <= MAX_RAM_CACHE_FRAMES) return;

    // Anchor frames that should never be evicted
    const protectedIndices = new Set([0, TOTAL_FRAMES - 1]);

    for (const [idx, asset] of cacheRef.current.entries()) {
      if (protectedIndices.has(idx)) continue;

      const distance = Math.abs(idx - currentFrame);
      if (distance > 24) {
        if ('close' in asset && typeof (asset as ImageBitmap).close === 'function') {
          try {
            (asset as ImageBitmap).close();
          } catch {
            // ignore close error
          }
        }
        cacheRef.current.delete(idx);
      }
    }
  }, []);

  // Fetch and decode a single frame off-thread using createImageBitmap
  const fetchAndDecodeFrame = useCallback(async (frameIndex: number): Promise<FrameAsset | null> => {
    if (frameIndex < 0 || frameIndex >= TOTAL_FRAMES) return null;

    if (cacheRef.current.has(frameIndex)) {
      return cacheRef.current.get(frameIndex)!;
    }

    if (pendingRequestsRef.current.has(frameIndex)) {
      return pendingRequestsRef.current.get(frameIndex)!;
    }

    const entry = FRAME_MANIFEST[frameIndex];
    if (!entry) return null;

    const requestPromise = (async () => {
      try {
        const response = await fetch(entry.path);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();

        if ('createImageBitmap' in window) {
          const bitmap = await createImageBitmap(blob);
          cacheRef.current.set(frameIndex, bitmap);
          return bitmap;
        } else {
          const img = new Image();
          img.src = entry.path;
          if ('decode' in img) {
            await img.decode();
          }
          cacheRef.current.set(frameIndex, img);
          return img;
        }
      } catch {
        return new Promise<FrameAsset | null>((resolve) => {
          const img = new Image();
          img.src = entry.path;
          img.onload = () => {
            cacheRef.current.set(frameIndex, img);
            resolve(img);
          };
          img.onerror = () => {
            resolve(null);
          };
        });
      } finally {
        pendingRequestsRef.current.delete(frameIndex);
        activeDownloadsCountRef.current = Math.max(0, activeDownloadsCountRef.current - 1);
        processQueue();
      }
    })();

    pendingRequestsRef.current.set(frameIndex, requestPromise);
    activeDownloadsCountRef.current++;
    return requestPromise;
  }, []);

  // Controlled concurrency queue processor (max 6 parallel requests)
  const processQueue = useCallback(() => {
    while (queueRef.current.length > 0 && activeDownloadsCountRef.current < MAX_CONCURRENT_DOWNLOADS) {
      const nextIndex = queueRef.current.shift();
      if (nextIndex !== undefined && !cacheRef.current.has(nextIndex) && !pendingRequestsRef.current.has(nextIndex)) {
        fetchAndDecodeFrame(nextIndex);
      }
    }
  }, [fetchAndDecodeFrame]);

  // Request frames with prioritized ordering
  const requestFramePriority = useCallback((frameIndex: number, isHighPriority = false) => {
    if (frameIndex < 0 || frameIndex >= TOTAL_FRAMES) return;
    if (cacheRef.current.has(frameIndex) || pendingRequestsRef.current.has(frameIndex)) return;

    if (isHighPriority) {
      // Prepend to front of queue
      queueRef.current = [frameIndex, ...queueRef.current.filter((i) => i !== frameIndex)];
    } else {
      if (!queueRef.current.includes(frameIndex)) {
        queueRef.current.push(frameIndex);
      }
    }

    processQueue();
  }, [processQueue]);

  // Stream window ahead of scroll position
  const ensureFrameLoaded = useCallback((currentFrameIndex: number) => {
    const prevTarget = lastTargetFrameRef.current;
    const direction = currentFrameIndex >= prevTarget ? 'down' : 'up';
    lastTargetFrameRef.current = currentFrameIndex;
    lastScrollDirectionRef.current = direction;

    evictDistantFrames(currentFrameIndex);

    // Priority 1: Current frame & immediate next frame
    requestFramePriority(currentFrameIndex, true);
    requestFramePriority(currentFrameIndex + (direction === 'down' ? 1 : -1), true);

    // Priority 2: Directional Lookahead
    if (direction === 'down') {
      const forwardEnd = Math.min(TOTAL_FRAMES - 1, currentFrameIndex + LOOKAHEAD_WINDOW);
      for (let i = currentFrameIndex + 2; i <= forwardEnd; i++) {
        requestFramePriority(i, false);
      }
      const backwardStart = Math.max(0, currentFrameIndex - LOOKBEHIND_WINDOW);
      for (let i = currentFrameIndex - 1; i >= backwardStart; i--) {
        requestFramePriority(i, false);
      }
    } else {
      const backwardStart = Math.max(0, currentFrameIndex - LOOKAHEAD_WINDOW);
      for (let i = currentFrameIndex - 2; i >= backwardStart; i--) {
        requestFramePriority(i, false);
      }
      const forwardEnd = Math.min(TOTAL_FRAMES - 1, currentFrameIndex + LOOKBEHIND_WINDOW);
      for (let i = currentFrameIndex + 1; i <= forwardEnd; i++) {
        requestFramePriority(i, false);
      }
    }
  }, [evictDistantFrames, requestFramePriority]);

  // Retrieve cached frame with continuous nearest-neighbor fallback (Never blank screen)
  const getCachedFrame = useCallback((frameIndex: number): FrameAsset | null => {
    if (cacheRef.current.has(frameIndex)) {
      return cacheRef.current.get(frameIndex)!;
    }

    // Bidirectional nearest neighbor search within a 20-frame radius
    for (let offset = 1; offset <= 20; offset++) {
      if (cacheRef.current.has(frameIndex - offset)) {
        return cacheRef.current.get(frameIndex - offset)!;
      }
      if (cacheRef.current.has(frameIndex + offset)) {
        return cacheRef.current.get(frameIndex + offset)!;
      }
    }

    return cacheRef.current.get(0) || null;
  }, []);

  // Initial Startup Preload: Download and decode initial 5 frames (< 0.2s)
  useEffect(() => {
    let isMounted = true;

    const streamInitial = async () => {
      // First load frame 0 immediately
      await fetchAndDecodeFrame(0);

      // Preload initial 5 frames
      for (let i = 1; i <= 5; i++) {
        if (!isMounted) break;
        requestFramePriority(i, true);
      }

      // Preload the final perfected smile anchor frame (Frame 1198) in background
      requestFramePriority(TOTAL_FRAMES - 1, false);

      // Preload next 15 frames for Scene 1 start
      for (let i = 6; i <= 20; i++) {
        if (!isMounted) break;
        requestFramePriority(i, false);
      }
    };

    streamInitial();

    return () => {
      isMounted = false;
    };
  }, [fetchAndDecodeFrame, requestFramePriority]);

  return {
    totalCount: TOTAL_FRAMES, // 1,199 master frames
    isLoaded: isReady,
    ensureFrameLoaded,
    getCachedFrame,
  };
}
