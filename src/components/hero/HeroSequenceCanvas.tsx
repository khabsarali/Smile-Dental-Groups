import React, { useRef, useEffect } from 'react';
import { FrameAsset } from '../../hooks/useImagePreloader';

interface HeroSequenceCanvasProps {
  images: (FrameAsset | null)[];
  scrollProgress: number;
  currentStage: number;
  ensureFrameLoaded?: (index: number) => void;
}

export const HeroSequenceCanvas: React.FC<HeroSequenceCanvasProps> = ({
  images,
  scrollProgress,
  currentStage,
  ensureFrameLoaded,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isTabVisibleRef = useRef<boolean>(true);

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
    if (!canvas || images.length === 0) return;

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Pause loop if tab is hidden
      if (!isTabVisibleRef.current) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Dynamic mobile vs desktop DPR calculation
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2.0);

      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = isMobile ? 'medium' : 'high';

      // Studio background color fill
      ctx.fillStyle = '#05080E';
      ctx.fillRect(0, 0, width, height);

      // Frame calculation
      const totalFrames = images.length;
      const floatFrame = scrollProgress * (totalFrames - 1);
      const index1 = Math.floor(floatFrame);
      const index2 = Math.min(totalFrames - 1, index1 + 1);
      const blendAlpha = floatFrame - index1;

      // Ensure upcoming frame window is preloaded
      if (ensureFrameLoaded) {
        ensureFrameLoaded(index1);
      }

      const img1 = images[index1] || images[0];
      const img2 = images[index2] || img1;

      if (img1) {
        // Scale images to full-screen cover mode
        const naturalW = 'naturalWidth' in img1 ? img1.naturalWidth : (img1 as ImageBitmap).width;
        const naturalH = 'naturalHeight' in img1 ? img1.naturalHeight : (img1 as ImageBitmap).height;

        if (naturalW > 0) {
          const imgAspect = naturalW / naturalH;
          const screenAspect = width / height;

          // Full-Screen Cover Scaling Mode across the entire background
          let renderW = width;
          let renderH = height;
          let offsetX = 0;
          let offsetY = 0;

          if (screenAspect > imgAspect) {
            // Viewport is wider than image -> fit width, crop top/bottom
            renderW = width;
            renderH = width / imgAspect;
            offsetX = 0;
            offsetY = (height - renderH) / 2;
          } else {
            // Viewport is taller than image -> fit height, crop left/right
            renderH = height;
            renderW = height * imgAspect;
            offsetX = (width - renderW) / 2;
            offsetY = 0;
          }

          // Base frame (img1)
          ctx.globalAlpha = 1.0;
          ctx.drawImage(img1 as CanvasImageSource, offsetX, offsetY, renderW, renderH);

          // Blend frame (img2) for liquid continuous transition
          if (img2 && blendAlpha > 0.001) {
            ctx.globalAlpha = blendAlpha;
            ctx.drawImage(img2 as CanvasImageSource, offsetX, offsetY, renderW, renderH);
          }

          // Apply Scene-specific canvas volumetric lighting & scan FX
          ctx.globalAlpha = 1.0;

          if (currentStage === 2) {
            // Holographic X-Ray Scan line effect
            const scanY = (scrollProgress % 0.2) * 5 * height;
            const scanGradient = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
            scanGradient.addColorStop(0, 'rgba(0, 163, 255, 0)');
            scanGradient.addColorStop(0.5, 'rgba(0, 163, 255, 0.35)');
            scanGradient.addColorStop(1, 'rgba(0, 163, 255, 0)');
            ctx.fillStyle = scanGradient;
            ctx.fillRect(0, 0, width, height);

            // Grid scan lines
            ctx.strokeStyle = 'rgba(0, 163, 255, 0.06)';
            ctx.lineWidth = 1;
            for (let y = 0; y < height; y += 30) {
              ctx.beginPath();
              ctx.moveTo(0, y);
              ctx.lineTo(width, y);
              ctx.stroke();
            }
          } else if (currentStage === 3) {
            // Laser Surgery treatment pulse
            const laserPulse = Math.sin(Date.now() * 0.006) * 0.08 + 0.12;
            ctx.fillStyle = `rgba(2, 132, 199, ${laserPulse})`;
            ctx.fillRect(0, 0, width, height);
          } else if (currentStage === 4 || currentStage === 5) {
            // Scene 4 Polishing Light Sweep Effect
            const sweepX = (Date.now() * 0.3) % (width * 2) - width;
            const sweepGrad = ctx.createLinearGradient(sweepX, 0, sweepX + 200, height);
            sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            sweepGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.12)');
            sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = sweepGrad;
            ctx.fillRect(0, 0, width, height);

            // Soft Radial Studio Vignette
            const radGrad = ctx.createRadialGradient(
              width / 2,
              height / 2,
              width * 0.2,
              width / 2,
              height / 2,
              width * 0.75
            );
            radGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
            radGrad.addColorStop(1, 'rgba(5, 8, 14, 0.65)');
            ctx.fillStyle = radGrad;
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
  }, [scrollProgress, currentStage, images, ensureFrameLoaded]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#05080E]">
      <canvas
        ref={canvasRef}
        className="w-full h-full block select-none"
      />
    </div>
  );
};
