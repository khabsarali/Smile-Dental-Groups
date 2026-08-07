import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroSequenceCanvasProps {
  images: HTMLImageElement[];
  onStageChange?: (stage: number, progress: number) => void;
}

export const HeroSequenceCanvas: React.FC<HeroSequenceCanvasProps> = ({ images, onStageChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<number>(1);

  // Set up GSAP ScrollTrigger to pin container and track scroll progress
  useEffect(() => {
    if (!containerRef.current || images.length === 0) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.1, // smooth lag for buttery 60 FPS scroll
      onUpdate: (self) => {
        const prog = self.progress;
        setScrollProgress(prog);

        // Determine current scene (1 to 5)
        let stage = 1;
        if (prog < 0.2) stage = 1;
        else if (prog < 0.4) stage = 2;
        else if (prog < 0.6) stage = 3;
        else if (prog < 0.8) stage = 4;
        else stage = 5;

        setCurrentStage(stage);
        if (onStageChange) {
          onStageChange(stage, prog);
        }
      },
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      trigger.kill();
    };
  }, [images, onStageChange]);

  // Canvas drawing loop with sub-frame alpha crossfading
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Calculate responsive canvas dimensions
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Studio background color fill
      ctx.fillStyle = '#05080E';
      ctx.fillRect(0, 0, width, height);

      // Frame calculation
      const totalFrames = images.length;
      const floatFrame = scrollProgress * (totalFrames - 1);
      const index1 = Math.floor(floatFrame);
      const index2 = Math.min(totalFrames - 1, index1 + 1);
      const blendAlpha = floatFrame - index1;

      const img1 = images[index1];
      const img2 = images[index2];

      if (img1 && img1.complete && img1.naturalWidth > 0) {
        // Proportionally scale images using contain logic so the entire jaw is always visible
        const imgAspect = img1.naturalWidth / img1.naturalHeight;
        const screenAspect = width / height;

        // Dynamic scale factor for padding on smaller screens
        const scaleFactor = width < 768 ? 0.90 : width < 1024 ? 0.94 : 0.98;

        let renderW = width * scaleFactor;
        let renderH = height * scaleFactor;
        let offsetX = (width - renderW) / 2;
        let offsetY = (height - renderH) / 2;

        if (screenAspect > imgAspect) {
          renderH = height * scaleFactor;
          renderW = renderH * imgAspect;
          offsetX = (width - renderW) / 2;
          offsetY = (height - renderH) / 2;
        } else {
          renderW = width * scaleFactor;
          renderH = renderW / imgAspect;
          offsetX = (width - renderW) / 2;
          offsetY = (height - renderH) / 2;
        }

        // Base frame (img1)
        ctx.globalAlpha = 1.0;
        ctx.drawImage(img1, offsetX, offsetY, renderW, renderH);

        // Blend frame (img2) for liquid continuous transition
        if (img2 && img2.complete && img2.naturalWidth > 0 && blendAlpha > 0.001) {
          ctx.globalAlpha = blendAlpha;
          ctx.drawImage(img2, offsetX, offsetY, renderW, renderH);
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

      ctx.restore();
    };

    render();
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollProgress, currentStage, images]);

  return (
    <div id="hero-container" ref={containerRef} className="relative w-full h-[500vh]">
      {/* Sticky Fullscreen Canvas Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-[#05080E]">
        <canvas
          ref={canvasRef}
          className="w-full h-full block select-none"
        />

        {/* Ambient Dark-to-Light Gradient Overlays */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#F8FAFC]/90 via-transparent to-[#05080E]/40" />
      </div>
    </div>
  );
};
