import { useState, useEffect, useCallback } from 'react';
import { globalFrameLoader, type FrameAsset } from '../engine/FrameLoader';
import { TOTAL_FRAMES } from '../engine/FrameManifest';

export type { FrameAsset };

export function useImagePreloader() {
  const [isReady, setIsReady] = useState<boolean>(true);

  useEffect(() => {
    globalFrameLoader.initialBootstrap();
  }, []);

  const ensureFrameLoaded = useCallback((frameIndex: number) => {
    globalFrameLoader.onScrollProgress(frameIndex);
  }, []);

  const getCachedFrame = useCallback((frameIndex: number): FrameAsset | null => {
    return globalFrameLoader.getCachedFrame(frameIndex);
  }, []);

  const isFrameLoaded = useCallback((frameIndex: number): boolean => {
    return globalFrameLoader.isFrameLoaded(frameIndex);
  }, []);

  return {
    totalCount: TOTAL_FRAMES,
    isLoaded: isReady,
    ensureFrameLoaded,
    getCachedFrame,
    isFrameLoaded,
    loader: globalFrameLoader,
  };
}
