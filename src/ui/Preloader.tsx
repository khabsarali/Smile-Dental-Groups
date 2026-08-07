import React from 'react';

interface PreloaderProps {
  progress?: number;
  loadedCount?: number;
  totalCount?: number;
  isLoaded?: boolean;
}

export const Preloader: React.FC<PreloaderProps> = () => {
  // Non-blocking instant render: Website appears immediately with 0.0s delay
  return null;
};
