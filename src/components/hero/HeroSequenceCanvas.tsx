import React, { useRef, useEffect } from 'react';
import { FrameAsset, TOTAL_KEYFRAMES, OPTIMIZED_KEYFRAMES } from '../../hooks/useImagePreloader';

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

  // Pre-instantiate initial frame immediately on mount
  useEffect(() => {
    const initialImg = new Image();
    initialImg.src = OPTIMIZED_KEYFRAMES[0].path;
    initialImg.onload = () => {
      lastDrawnFrameRef.current = initialImg;
    };
  }, []);

  // Tab visibility listener to pause render loop when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Anti-Gravity 60 FPS Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      if (!isTabVisibleRef.current) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

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

      // 1. Dark Luxury Studio Volumetric Background (#05080E)
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.1,
        width / 2,
        height / 2,
        width * 0.75
      );
      bgGrad.addColorStop(0, '#0F172A');
      bgGrad.addColorStop(0.5, '#080E1A');
      bgGrad.addColorStop(1, '#05080E');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Optimized Keyframe Calculation across 140 selected keyframes
      const floatFrame = Math.max(0, Math.min(TOTAL_KEYFRAMES - 1, scrollProgress * (TOTAL_KEYFRAMES - 1)));
      const index1 = Math.floor(floatFrame);
      const index2 = Math.min(TOTAL_KEYFRAMES - 1, index1 + 1);
      const blendAlpha = floatFrame - index1;

      // Stream upcoming keyframes in background ahead of scroll
      if (ensureFrameLoaded) {
        ensureFrameLoaded(index1);
      }

      const img1 = (getCachedFrame ? getCachedFrame(index1) : null) || lastDrawnFrameRef.current;
      const img2 = (getCachedFrame ? getCachedFrame(index2) : null) || img1;

      if (img1) {
        lastDrawnFrameRef.current = img1;
        const naturalW = 'naturalWidth' in img1 ? img1.naturalWidth : (img1 as ImageBitmap).width;
        const naturalH = 'naturalHeight' in img1 ? img1.naturalHeight : (img1 as ImageBitmap).height;

        if (naturalW > 0) {
          const imgAspect = naturalW / naturalH;
          const screenAspect = width / height;

          let renderW = width;
          let renderH = height;

          if (screenAspect > imgAspect) {
            renderW = width;
            renderH = width / imgAspect;
          } else {
            renderH = height;
            renderW = height * imgAspect;
          }

          // Anti-Gravity Sinusoidal Floating Oscillation
          const now = Date.now();
          const floatY = Math.sin(now * 0.0018) * 10;
          const floatX = Math.cos(now * 0.0012) * 5;

          const offsetX = (width - renderW) / 2 + floatX;
          const offsetY = (height - renderH) / 2 + floatY;

          // 3. Volumetric Soft Blue Aura beneath Anti-Gravity Jaw
          const auraGrad = ctx.createRadialGradient(
            width / 2,
            offsetY + renderH * 0.55,
            renderW * 0.08,
            width / 2,
            offsetY + renderH * 0.55,
            renderW * 0.4
          );
          auraGrad.addColorStop(0, 'rgba(2, 132, 199, 0.22)');
          auraGrad.addColorStop(0.5, 'rgba(0, 163, 255, 0.08)');
          auraGrad.addColorStop(1, 'rgba(5, 8, 14, 0)');
          ctx.fillStyle = auraGrad;
          ctx.fillRect(0, 0, width, height);

          // 4. Draw Primary Levitating 3D Frame
          ctx.globalAlpha = 1.0;
          ctx.drawImage(img1 as CanvasImageSource, offsetX, offsetY, renderW, renderH);

          // 5. Crossfade Frame for 60 FPS Liquid Motion
          if (img2 && blendAlpha > 0.001) {
            ctx.globalAlpha = blendAlpha;
            ctx.drawImage(img2 as CanvasImageSource, offsetX, offsetY, renderW, renderH);
          }

          // 6. Cinematic Lighting & Specular Glints
          ctx.globalAlpha = 1.0;

          if (currentStage === 2) {
            // Scene 02: Digital 3D Holographic CBCT Scan Line
            const scanY = (scrollProgress % 0.25) * 4 * height;
            const scanGrad = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
            scanGrad.addColorStop(0, 'rgba(0, 163, 255, 0)');
            scanGrad.addColorStop(0.5, 'rgba(0, 163, 255, 0.35)');
            scanGrad.addColorStop(1, 'rgba(0, 163, 255, 0)');
            ctx.fillStyle = scanGrad;
            ctx.fillRect(0, 0, width, height);
          } else if (currentStage === 3) {
            // Scene 03: Orthodontic & Laser Glow Pulse
            const pulse = (Math.sin(now * 0.007) + 1) * 0.08;
            ctx.fillStyle = `rgba(2, 132, 199, ${pulse})`;
            ctx.fillRect(0, 0, width, height);
          } else if (currentStage >= 4) {
            // Scene 04 & 05: Diamond Enamel Specular Glint Sweep
            const sweepX = (now * 0.4) % (width * 2.2) - width * 0.2;
            const glintGrad = ctx.createLinearGradient(sweepX, 0, sweepX + 160, height);
            glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            glintGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.28)');
            glintGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = glintGrad;
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
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#05080E]">
      <canvas
        ref={canvasRef}
        style={{ imageRendering: 'auto' }}
        className="w-full h-full block select-none"
      />
    </div>
  );
};
