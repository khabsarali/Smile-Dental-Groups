import { useState, useEffect, useRef, useCallback } from 'react';

export type FrameAsset = ImageBitmap | HTMLImageElement;

export interface SceneMeta {
  id: number;
  folder: string;
  frameCount: number;
}

export const SCENES_CONFIG: SceneMeta[] = [
  { id: 1, folder: 'scene-1', frameCount: 300 },
  { id: 2, folder: 'scene-2', frameCount: 299 },
  { id: 3, folder: 'scene-3', frameCount: 300 },
  { id: 4, folder: 'scene-4', frameCount: 300 },
];

export const TOTAL_ANIMATION_FRAMES = 1199;
const INITIAL_PRELOAD_COUNT = 15;
const STREAMING_BUFFER_WINDOW = 16;

export function useImagePreloader() {
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const cacheRef = useRef<Map<string, FrameAsset>>(new Map());
  const loadingQueueRef = useRef<Set<string>>(new Set());

  // Helper to format frame path from global frame index (0 to 1198)
  const getFramePath = useCallback((globalIndex: number): { sceneId: number; path: string } => {
    let acc = 0;
    for (const scene of SCENES_CONFIG) {
      if (globalIndex < acc + scene.frameCount) {
        const localIndex = globalIndex - acc + 1;
        const frameStr = String(localIndex).padStart(3, '0');
        return {
          sceneId: scene.id,
          path: `/assets/scenes/${scene.folder}/ezgif-frame-${frameStr}.png`,
        };
      }
      acc += scene.frameCount;
    }
    return {
      sceneId: 4,
      path: `/assets/scenes/scene-4/ezgif-frame-300.png`,
    };
  }, []);

  // Asynchronous off-thread frame loader using createImageBitmap
  const loadSingleFrame = useCallback(async (globalIndex: number): Promise<FrameAsset | null> => {
    const { path } = getFramePath(globalIndex);
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
  }, [getFramePath]);

  // Initial Preload of first 15 frames for instant TTI (< 1.0s)
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

      // Background stream initial 60 frames of Scene 1
      for (let i = INITIAL_PRELOAD_COUNT; i < 60; i++) {
        if (!isMounted) break;
        await loadSingleFrame(i);
      }
    };

    preloadInitial();

    return () => {
      isMounted = false;
    };
  }, [loadSingleFrame]);

  // Request window streaming for continuous scroll playback
  const ensureFrameLoaded = useCallback((currentGlobalIndex: number) => {
    const start = Math.max(0, currentGlobalIndex - 2);
    const end = Math.min(TOTAL_ANIMATION_FRAMES - 1, currentGlobalIndex + STREAMING_BUFFER_WINDOW);

    for (let i = start; i <= end; i++) {
      const { path } = getFramePath(i);
      if (!cacheRef.current.has(path) && !loadingQueueRef.current.has(path)) {
        loadSingleFrame(i);
      }
    }
  }, [getFramePath, loadSingleFrame]);

  // Retrieve cached frame
  const getCachedFrame = useCallback((globalIndex: number): FrameAsset | null => {
    const { path } = getFramePath(globalIndex);
    return cacheRef.current.get(path) || null;
  }, [getFramePath]);

  const progress = Math.min(Math.round((loadedCount / INITIAL_PRELOAD_COUNT) * 100), 100);

  return {
    loadedCount,
    totalCount: TOTAL_ANIMATION_FRAMES,
    progress,
    isLoaded,
    ensureFrameLoaded,
    getCachedFrame,
  };
}
