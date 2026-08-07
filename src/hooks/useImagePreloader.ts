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
    { id: 4, folder: 'scene-4', total: 282, keyframeCount: 35 },
  ];

  const keyframes: KeyframeInfo[] = [];
  let globalIndex = 0;

  for (const scene of scenes) {
    for (let i = 0; i < scene.keyframeCount; i++) {
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
const STREAMING_BUFFER_WINDOW = 12;

export function useImagePreloader() {
  const [loadedCount, setLoadedCount] = useState<number>(1);
  const [isLoaded, setIsLoaded] = useState<boolean>(true); // Immediate instant load
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
        setLoadedCount((c) => c + 1);
        return bitmap;
      } else {
        const img = new Image();
        img.src = path;
        if ('decode' in img) {
          await img.decode();
        }
        cacheRef.current.set(path, img);
        loadingQueueRef.current.delete(path);
        setLoadedCount((c) => c + 1);
        return img;
      }
    } catch {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
          cacheRef.current.set(path, img);
          loadingQueueRef.current.delete(path);
          setLoadedCount((c) => c + 1);
          resolve(img);
        };
        img.onerror = () => {
          loadingQueueRef.current.delete(path);
          resolve(null);
        };
      });
    }
  }, []);

  // Background Stream on mount without blocking the UI
  useEffect(() => {
    let isMounted = true;

    const streamInitial = async () => {
      // First load frame 0 immediately
      await loadSingleFrame(0);

      // Then stream next 20 frames in background
      for (let i = 1; i < Math.min(20, TOTAL_KEYFRAMES); i++) {
        if (!isMounted) break;
        loadSingleFrame(i);
      }
    };

    streamInitial();

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

  return {
    loadedCount,
    totalCount: TOTAL_KEYFRAMES, // 140
    progress: 100,
    isLoaded: true,
    ensureFrameLoaded,
    getCachedFrame,
  };
}
