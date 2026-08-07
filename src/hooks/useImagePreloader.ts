import { useState, useEffect, useRef, useCallback } from 'react';

export type FrameAsset = ImageBitmap | HTMLImageElement;

export interface KeyframeInfo {
  index: number;
  sceneId: number;
  localFrame: number;
  path: string;
}

// Generate exactly 140 high-impact keyframes (35 per scene) across the 4 scenes
function generateKeyframes(): KeyframeInfo[] {
  const scenes = [
    { id: 1, folder: 'scene-1', total: 300, keyframeCount: 35 },
    { id: 2, folder: 'scene-2', total: 299, keyframeCount: 35 },
    { id: 3, folder: 'scene-3', total: 300, keyframeCount: 35 },
    { id: 4, folder: 'scene-4', total: 282, keyframeCount: 35 }, // up to image 282 for final smile
  ];

  const keyframes: KeyframeInfo[] = [];
  let globalIndex = 0;

  for (const scene of scenes) {
    for (let i = 0; i < scene.keyframeCount; i++) {
      // Eased sampling: ensures smooth camera movement and jaw rotation
      const progress = i / (scene.keyframeCount - 1);
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
export const TOTAL_KEYFRAMES = OPTIMIZED_KEYFRAMES.length; // Exactly 140 keyframes
const INITIAL_PRELOAD_COUNT = 5;
const STREAMING_BUFFER_WINDOW = 12;

export function useImagePreloader() {
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const cacheRef = useRef<Map<string, FrameAsset>>(new Map());
  const loadingQueueRef = useRef<Set<string>>(new Set());

  // Asynchronous off-thread frame loader using createImageBitmap
  const loadSingleFrame = useCallback(async (keyframeIndex: number): Promise<FrameAsset | null> => {
    if (keyframeIndex < 0 || keyframeIndex >= TOTAL_KEYFRAMES) return null;
    const { path } = OPTIMIZED_KEYFRAMES[keyframeIndex];

    if (cacheRef.current.has(path)) {
      return cacheRef.current.get(path)!;
    }
    if (loadingQueueRef.current.has(path)) {
      return null;
    }

    loadingQueueRef.current.add(path);

    try {
      const response = await fetch(path);
      const blob = await response.blob();

      if ('createImageBitmap' in window) {
        const bitmap = await createImageBitmap(blob);
        cacheRef.current.set(path, bitmap);
        loadingQueueRef.current.delete(path);
        return bitmap;
      } else {
        const img = new Image();
        img.src = path;
        if ('decode' in img) {
          await img.decode();
        }
        cacheRef.current.set(path, img);
        loadingQueueRef.current.delete(path);
        return img;
      }
    } catch {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
          cacheRef.current.set(path, img);
          loadingQueueRef.current.delete(path);
          resolve(img);
        };
        img.onerror = () => {
          loadingQueueRef.current.delete(path);
          resolve(null);
        };
      });
    }
  }, []);

  // Initial Preload of only first 5 keyframes for ultra-fast TTI (< 0.15s)
  useEffect(() => {
    let isMounted = true;
    let completed = 0;

    const preloadInitial = async () => {
      const promises: Promise<void>[] = [];

      for (let i = 0; i < INITIAL_PRELOAD_COUNT; i++) {
        const p = loadSingleFrame(i).then(() => {
          if (!isMounted) return;
          completed++;
          setLoadedCount(completed);
          if (completed >= INITIAL_PRELOAD_COUNT) {
            setIsLoaded(true);
          }
        });
        promises.push(p);
      }

      await Promise.all(promises);

      // Stream initial 25 keyframes in the background without blocking
      for (let i = INITIAL_PRELOAD_COUNT; i < Math.min(25, TOTAL_KEYFRAMES); i++) {
        if (!isMounted) break;
        await loadSingleFrame(i);
      }
    };

    preloadInitial();

    return () => {
      isMounted = false;
    };
  }, [loadSingleFrame]);

  // Request window streaming ahead of user's scroll position
  const ensureFrameLoaded = useCallback((currentKeyframeIndex: number) => {
    const start = Math.max(0, currentKeyframeIndex - 2);
    const end = Math.min(TOTAL_KEYFRAMES - 1, currentKeyframeIndex + STREAMING_BUFFER_WINDOW);

    for (let i = start; i <= end; i++) {
      const { path } = OPTIMIZED_KEYFRAMES[i];
      if (!cacheRef.current.has(path) && !loadingQueueRef.current.has(path)) {
        loadSingleFrame(i);
      }
    }
  }, [loadSingleFrame]);

  // Retrieve cached keyframe
  const getCachedFrame = useCallback((keyframeIndex: number): FrameAsset | null => {
    if (keyframeIndex < 0 || keyframeIndex >= TOTAL_KEYFRAMES) return null;
    const { path } = OPTIMIZED_KEYFRAMES[keyframeIndex];
    return cacheRef.current.get(path) || null;
  }, []);

  const progress = Math.min(Math.round((loadedCount / INITIAL_PRELOAD_COUNT) * 100), 100);

  return {
    loadedCount,
    totalCount: TOTAL_KEYFRAMES, // 140
    progress,
    isLoaded,
    ensureFrameLoaded,
    getCachedFrame,
  };
}
