import React, { useRef, useEffect } from 'react';
import { FrameAsset, TOTAL_ANIMATION_FRAMES } from '../../hooks/useImagePreloader';

interface HeroSequenceCanvasProps {
  scrollProgress: number;
  currentStage: number;
  ensureFrameLoaded?: (index: number) => void;
  getCachedFrame?: (index: number) => FrameAsset | null;
}

export const HeroSequenceCanvas: React.FC<HeroSequenceCanvasProps> = ({
  scrollProgress,
  currentStage,
  ensureFrameLoaded,
  getCachedFrame,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isTabVisibleRef = useRef<boolean>(true);
  const lastDrawnFrameRef = useRef<FrameAsset | null>(null);

  // Handle document tab visibility change (Pause canvas rendering when hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Canvas drawing loop with sub-frame alpha crossfading & high resolution
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !getCachedFrame) return;

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      if (!isTabVisibleRef.current) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Dynamic mobile vs desktop DPR calculation (Retina 4K sharpness)
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const dpr = Math.max(window.devicePixelRatio || 1, isMobile ? 2.0 : 2.5);

      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Pure white clinical background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // Multi-scene frame calculation across all 1199 master frames
      const floatFrame = Math.max(0, Math.min(TOTAL_ANIMATION_FRAMES - 1, scrollProgress * (TOTAL_ANIMATION_FRAMES - 1)));
      const index1 = Math.floor(floatFrame);
      const index2 = Math.min(TOTAL_ANIMATION_FRAMES - 1, index1 + 1);
      const blendAlpha = floatFrame - index1;

      // Stream upcoming buffer window
      if (ensureFrameLoaded) {
        ensureFrameLoaded(index1);
      }

      const img1 = getCachedFrame(index1) || lastDrawnFrameRef.current;
      const img2 = getCachedFrame(index2) || img1;

      if (img1) {
        lastDrawnFrameRef.current = img1;
        const naturalW = 'naturalWidth' in img1 ? img1.naturalWidth : (img1 as ImageBitmap).width;
        const naturalH = 'naturalHeight' in img1 ? img1.naturalHeight : (img1 as ImageBitmap).height;

        if (naturalW > 0) {
          const imgAspect = naturalW / naturalH;
          const screenAspect = width / height;

          // Contain / Cover scaling preserving 100% natural aspect ratio
          let renderW = width;
          let renderH = height;

          if (screenAspect > imgAspect) {
            renderW = width;
            renderH = width / imgAspect;
          } else {
            renderH = height;
            renderW = height * imgAspect;
          }

          // Subtle floating suspension
          const floatY = Math.sin(Date.now() * 0.0016) * 6;
          const offsetX = (width - renderW) / 2;
          const offsetY = (height - renderH) / 2 + floatY;

          // 1. Draw Base Frame
          ctx.globalAlpha = 1.0;
          ctx.drawImage(img1 as CanvasImageSource, offsetX, offsetY, renderW, renderH);

          // 2. Crossfade Blend Frame for liquid smooth 60 FPS transitions
          if (img2 && blendAlpha > 0.001) {
            ctx.globalAlpha = blendAlpha;
            ctx.drawImage(img2 as CanvasImageSource, offsetX, offsetY, renderW, renderH);
          }

          // 3. Scene-specific Cinematic Lighting & Volumetric FX
          ctx.globalAlpha = 1.0;

          if (currentStage === 2) {
            // Scene 02 Digital X-Ray Hologram Scan Line
            const scanY = (scrollProgress % 0.25) * 4 * height;
            const scanGradient = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
            scanGradient.addColorStop(0, 'rgba(0, 163, 255, 0)');
            scanGradient.addColorStop(0.5, 'rgba(0, 163, 255, 0.25)');
            scanGradient.addColorStop(1, 'rgba(0, 163, 255, 0)');
            ctx.fillStyle = scanGradient;
            ctx.fillRect(0, 0, width, height);
          } else if (currentStage === 3) {
            // Scene 03 Orthodontic & Laser Pulse
            const laserPulse = Math.sin(Date.now() * 0.006) * 0.05 + 0.08;
            ctx.fillStyle = `rgba(2, 132, 199, ${laserPulse})`;
            ctx.fillRect(0, 0, width, height);
          } else if (currentStage === 4 || currentStage === 5) {
            // Scene 04 & 05 Diamond Enamel Specular Sweep
            const sweepX = (Date.now() * 0.35) % (width * 2) - width;
            const sweepGrad = ctx.createLinearGradient(sweepX, 0, sweepX + 180, height);
            sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            sweepGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
            sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = sweepGrad;
            ctx.fillRect(0, 0, width, height);
          }
        }
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollProgress, currentStage, ensureFrameLoaded, getCachedFrame]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-white">
      <canvas
        ref={canvasRef}
        style={{ imageRendering: 'auto' }}
        className="w-full h-full block select-none"
      />
    </div>
  );
};
