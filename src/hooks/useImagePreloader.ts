import { useState, useEffect } from 'react';

const TOTAL_FRAMES = 170;

export function useImagePreloader() {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let completed = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const frameNum = String(i).padStart(3, '0');
      const img = new Image();
      img.src = `/assets/sequence/ezgif-frame-${frameNum}.jpg`;
      
      const onSingleImageLoad = () => {
        if (!isMounted) return;
        completed++;
        setLoadedCount(completed);
        
        if (completed === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };

      img.onload = onSingleImageLoad;
      img.onerror = onSingleImageLoad; // fallback so app doesn't hang if single frame fails

      loadedImages[i - 1] = img;
    }

    setImages(loadedImages);

    return () => {
      isMounted = false;
    };
  }, []);

  const progress = Math.min(Math.round((loadedCount / TOTAL_FRAMES) * 100), 100);

  return {
    images,
    loadedCount,
    totalCount: TOTAL_FRAMES,
    progress,
    isLoaded,
  };
}
