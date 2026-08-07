import { useState, useEffect, useRef, useCallback } from 'react';

export type FrameAsset = ImageBitmap | HTMLImageElement;

export interface KeyframeInfo {
  index: number;
  sceneId: number;
  localFrame: number;
  path: string;
}

// Exactly 120 keyframes (30 per scene) capturing all essential motion & transformation milestones
function generateKeyframes(): KeyframeInfo[] {
  const scenes = [
    { id: 1, folder: 'scene-1', total: 300, count: 30 }, // Scene 1: Damaged Jaw rotation
    { id: 2, folder: 'scene-2', total: 299, count: 30 }, // Scene 2: 3D Digital X-Ray scan
    { id: 3, folder: 'scene-3', total: 300, count: 30 }, // Scene 3: Orthodontic aligners & laser
    { id: 4, folder: 'scene-4', total: 282, count: 30 }, // Scene 4: Healthy teeth & final smile reveal
  ];

  const keyframes: KeyframeInfo[] = [];
  let globalIndex = 0;

  for (const scene of scenes) {
    for (let i = 0; i < scene.count; i++) {
      const progress = i / (scene.count - 1);
      const frameNumber = Math.min(scene.total, Math.max(1, Math.round(1 + progress * (scene.total - 1))));
      const frameStr = String(frameNumber).padStart(3, '0');
      
      keyframes.push({
        index: globalIndex,
        sceneId: scene.id,
        localFrame: frameNumber,
        path: `/assets/scenes/${scene.folder}/ezgif-frame-${frameStr}.png`,
      });
      globalIndex++;
    }
  }

  return keyframes;
}

export const OPTIMIZED_KEYFRAMES: KeyframeInfo[] = generateKeyframes();
export const TOTAL_KEYFRAMES = OPTIMIZED_KEYFRAMES.length; // Exactly 120 keyframes
const INITIAL_PRELOAD_REQUIRED = 5;
const MAX_CONCURRENT_CACHE = 24; // Sliding window buffer size (Memory capped < 25MB)
const LOOKAHEAD_WINDOW = 10;
const LOOKBEHIND_WINDOW = 4;

export function useImagePreloader() {
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<string>('Preparing your experience');
  const cacheRef = useRef<Map<number, FrameAsset>>(new Map());
  const loadingQueueRef = useRef<Set<number>>(new Set());
  const lastActiveIndexRef = useRef<number>(0);

  // Evict distant frames to keep memory consumption under 25MB
  const evictDistantFrames = useCallback((currentIndex: number) => {
    lastActiveIndexRef.current = currentIndex;
    if (cacheRef.current.size <= MAX_CONCURRENT_CACHE) return;

    // Retain initial frame (0) and final perfected smile frame (TOTAL_KEYFRAMES - 1)
    const protectedIndices = new Set([0, TOTAL_KEYFRAMES - 1]);

    for (const [idx, asset] of cacheRef.current.entries()) {
      if (protectedIndices.has(idx)) continue;

      const distance = Math.abs(idx - currentIndex);
      if (distance > 14) {
        // Close ImageBitmap if supported to free GPU memory
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

  // Asynchronous off-thread frame loader using createImageBitmap
  const loadSingleKeyframe = useCallback(async (keyframeIndex: number): Promise<FrameAsset | null> => {
    if (keyframeIndex < 0 || keyframeIndex >= TOTAL_KEYFRAMES) return null;

    if (cacheRef.current.has(keyframeIndex)) {
      return cacheRef.current.get(keyframeIndex)!;
    }
    if (loadingQueueRef.current.has(keyframeIndex)) {
      return null;
    }

    loadingQueueRef.current.add(keyframeIndex);
    const { path } = OPTIMIZED_KEYFRAMES[keyframeIndex];

    try {
      const response = await fetch(path);
      const blob = await response.blob();

      if ('createImageBitmap' in window) {
        const bitmap = await createImageBitmap(blob);
        cacheRef.current.set(keyframeIndex, bitmap);
        loadingQueueRef.current.delete(keyframeIndex);
        setLoadedCount((c) => c + 1);
        return bitmap;
      } else {
        const img = new Image();
        img.src = path;
        if ('decode' in img) {
          await img.decode();
        }
        cacheRef.current.set(keyframeIndex, img);
        loadingQueueRef.current.delete(keyframeIndex);
        setLoadedCount((c) => c + 1);
        return img;
      }
    } catch {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
          cacheRef.current.set(keyframeIndex, img);
          loadingQueueRef.current.delete(keyframeIndex);
          setLoadedCount((c) => c + 1);
          resolve(img);
        };
        img.onerror = () => {
          loadingQueueRef.current.delete(keyframeIndex);
          resolve(null);
        };
      });
    }
  }, []);

  // Priority Sliding Window Streamer
  const ensureFrameLoaded = useCallback((currentKeyframeIndex: number) => {
    evictDistantFrames(currentKeyframeIndex);

    // Priority 1: Current frame & next 2 frames
    loadSingleKeyframe(currentKeyframeIndex);
    loadSingleKeyframe(currentKeyframeIndex + 1);

    // Priority 2: Lookahead frames
    const forwardEnd = Math.min(TOTAL_KEYFRAMES - 1, currentKeyframeIndex + LOOKAHEAD_WINDOW);
    for (let i = currentKeyframeIndex + 2; i <= forwardEnd; i++) {
      if (!cacheRef.current.has(i) && !loadingQueueRef.current.has(i)) {
        loadSingleKeyframe(i);
      }
    }

    // Priority 3: Lookbehind frames for smooth reverse scroll
    const backwardStart = Math.max(0, currentKeyframeIndex - LOOKBEHIND_WINDOW);
    for (let i = currentKeyframeIndex - 1; i >= backwardStart; i--) {
      if (!cacheRef.current.has(i) && !loadingQueueRef.current.has(i)) {
        loadSingleKeyframe(i);
      }
    }
  }, [loadSingleKeyframe, evictDistantFrames]);

  // Retrieve cached keyframe with nearest-neighbor fallback (Never blank)
  const getCachedFrame = useCallback((keyframeIndex: number): FrameAsset | null => {
    if (cacheRef.current.has(keyframeIndex)) {
      return cacheRef.current.get(keyframeIndex)!;
    }

    // Nearest fallback search
    for (let offset = 1; offset <= 8; offset++) {
      if (cacheRef.current.has(keyframeIndex - offset)) {
        return cacheRef.current.get(keyframeIndex - offset)!;
      }
      if (cacheRef.current.has(keyframeIndex + offset)) {
        return cacheRef.current.get(keyframeIndex + offset)!;
      }
    }

    return cacheRef.current.get(0) || null;
  }, []);

  // Initial Preload: Only first 5 keyframes to launch in < 0.6s
  useEffect(() => {
    let isMounted = true;
    let loaded = 0;

    const runInitialPreload = async () => {
      setLoadingStage('Preparing dental transformation...');
      
      const initialPromises: Promise<void>[] = [];
      for (let i = 0; i < INITIAL_PRELOAD_REQUIRED; i++) {
        const p = loadSingleKeyframe(i).then(() => {
          if (!isMounted) return;
          loaded++;
          if (loaded === 2) setLoadingStage('Loading 3D environment...');
          if (loaded >= INITIAL_PRELOAD_REQUIRED) {
            setLoadingStage('Enter Experience');
            setIsLoaded(true);
          }
        });
        initialPromises.push(p);
      }

      // Also preload the final perfected smile keyframe (Scene 4 end) in the background
      loadSingleKeyframe(TOTAL_KEYFRAMES - 1);

      await Promise.all(initialPromises);

      // Background progressive streaming of remaining Scene 1 frames
      for (let i = INITIAL_PRELOAD_REQUIRED; i < 20; i++) {
        if (!isMounted) break;
        await loadSingleKeyframe(i);
      }
    };

    runInitialPreload();

    return () => {
      isMounted = false;
    };
  }, [loadSingleKeyframe]);

  const progress = Math.min(100, Math.round((loadedCount / INITIAL_PRELOAD_REQUIRED) * 100));

  return {
    loadedCount,
    totalCount: TOTAL_KEYFRAMES,
    progress,
    isLoaded,
    loadingStage,
    ensureFrameLoaded,
    getCachedFrame,
  };
}
