import { useState, useEffect, useRef, useCallback } from 'react';

const TOTAL_FRAMES = 150;
const INITIAL_PRELOAD_COUNT = 15; // Fast initial TTI (< 1.0s)
const SLIDING_WINDOW_BUFFER = 15; // Preload 15 frames ahead of scroll position

export type FrameAsset = ImageBitmap | HTMLImageElement;

export function useImagePreloader() {
  const [images, setImages] = useState<(FrameAsset | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const loadingStatusRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
  const imagesRef = useRef<(FrameAsset | null)[]>(new Array(TOTAL_FRAMES).fill(null));

  // Helper to load single frame using off-thread createImageBitmap or HTMLImageElement
  const loadSingleFrame = useCallback(async (index: number): Promise<FrameAsset | null> => {
    if (imagesRef.current[index]) return imagesRef.current[index];
    if (loadingStatusRef.current[index]) return null;

    loadingStatusRef.current[index] = true;
    const frameNum = String(index + 1).padStart(3, '0');
    const src = `/assets/sequence/ezgif-frame-${frameNum}.jpg`;

    try {
      const response = await fetch(src);
      const blob = await response.blob();

      if ('createImageBitmap' in window) {
        const bitmap = await createImageBitmap(blob);
        imagesRef.current[index] = bitmap;
        return bitmap;
      } else {
        const img = new Image();
        img.src = src;
        if ('decode' in img) {
          await img.decode();
        }
        imagesRef.current[index] = img;
        return img;
      }
    } catch {
      // Fallback standard image load
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          imagesRef.current[index] = img;
          resolve(img);
        };
        img.onerror = () => resolve(null);
      });
    }
  }, []);

  // Initial Preload of first 15 frames
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

      // Background stream remaining frames progressively
      for (let i = INITIAL_PRELOAD_COUNT; i < TOTAL_FRAMES; i++) {
        if (!isMounted) break;
        await loadSingleFrame(i);
        setImages([...imagesRef.current]);
      }
    };

    preloadInitial();

    return () => {
      isMounted = false;
    };
  }, [loadSingleFrame]);

  // Request window streaming for smooth scrolling
  const ensureFrameLoaded = useCallback((currentIndex: number) => {
    const start = Math.max(0, currentIndex - 2);
    const end = Math.min(TOTAL_FRAMES - 1, currentIndex + SLIDING_WINDOW_BUFFER);

    for (let i = start; i <= end; i++) {
      if (!imagesRef.current[i] && !loadingStatusRef.current[i]) {
        loadSingleFrame(i).then(() => {
          setImages([...imagesRef.current]);
        });
      }
    }
  }, [loadSingleFrame]);

  const progress = Math.min(Math.round((loadedCount / INITIAL_PRELOAD_COUNT) * 100), 100);

  return {
    images: imagesRef.current,
    loadedCount,
    totalCount: TOTAL_FRAMES,
    progress,
    isLoaded,
    ensureFrameLoaded,
  };
}
