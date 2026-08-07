import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Scan, Zap, ShieldCheck, Smile, ChevronDown, Calendar, ArrowRight, Activity } from 'lucide-react';
import { TOTAL_FRAMES, FRAME_MANIFEST, SCENES } from '../../engine/FrameManifest';
import { FrameAsset } from '../../hooks/useImagePreloader';

interface Cinematic3DScrollProps {
  ensureFrameLoaded: (index: number) => void;
  getCachedFrame: (index: number) => FrameAsset | null;
}

export const Cinematic3DScroll: React.FC<Cinematic3DScrollProps> = ({
  ensureFrameLoaded,
  getCachedFrame,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isTabVisibleRef = useRef<boolean>(true);
  const lastDrawnFrameRef = useRef<FrameAsset | null>(null);

  // Mutable animation references (Zero React re-renders on scroll)
  const targetScrollRef = useRef<number>(0);
  const currentInterpolatedScrollRef = useRef<number>(0);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Minimal UI state updated only when scene milestone changes
  const [activeSceneId, setActiveSceneId] = useState<number>(1);
  const [displayFrameIndex, setDisplayFrameIndex] = useState<number>(1);
  const [isFinalFrameReached, setIsFinalFrameReached] = useState<boolean>(false);

  // Pre-instantiate initial frame 0 (frame-001.png) immediately on mount
  useEffect(() => {
    const initialImg = new Image();
    initialImg.src = FRAME_MANIFEST[0].path;
    initialImg.onload = () => {
      lastDrawnFrameRef.current = initialImg;
    };
  }, []);

  // Window scroll listener updating mutable ref (Decoupled 60 FPS)
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDist = containerRef.current.scrollHeight - window.innerHeight;

      if (scrollableDist <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / scrollableDist));
      targetScrollRef.current = progress;

      // Update scene milestone only on integer boundaries (not on every pixel)
      const currentFrameNum = Math.min(150, Math.max(1, Math.round(progress * 149) + 1));
      setDisplayFrameIndex(currentFrameNum);

      let scId = 1;
      for (const scene of SCENES) {
        if (currentFrameNum - 1 >= scene.startFrame && currentFrameNum - 1 <= scene.endFrame) {
          scId = scene.id;
          break;
        }
      }
      setActiveSceneId(scId);
      setIsFinalFrameReached(progress >= 0.96);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Desktop mouse parallax listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      mousePosRef.current = { x: normX, y: normY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Tab visibility listener to pause canvas render loop when hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // 60 FPS Canvas Render Loop with COVER scaling, sub-frame crossfade, and floating anti-gravity
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

      // Smooth scroll interpolation (Easing towards target scroll)
      currentInterpolatedScrollRef.current += (targetScrollRef.current - currentInterpolatedScrollRef.current) * 0.16;
      const smoothProgress = currentInterpolatedScrollRef.current;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1280;
      const dpr = Math.max(window.devicePixelRatio || 1, isMobile ? 1.25 : isTablet ? 1.5 : 2.0);

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
        width * 0.8
      );
      bgGrad.addColorStop(0, '#0F172A');
      bgGrad.addColorStop(0.5, '#080E1A');
      bgGrad.addColorStop(1, '#05080E');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Exact 150 Frame Timeline Calculation with Smooth Sub-Frame Blending
      const floatFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, smoothProgress * (TOTAL_FRAMES - 1)));
      const index1 = Math.floor(floatFrame);
      const index2 = Math.min(TOTAL_FRAMES - 1, index1 + 1);
      const blendAlpha = floatFrame - index1;

      // Stream upcoming lookahead frames in background ahead of scroll
      ensureFrameLoaded(index1);

      const img1 = getCachedFrame(index1) || lastDrawnFrameRef.current;
      const img2 = getCachedFrame(index2) || img1;

      if (img1) {
        lastDrawnFrameRef.current = img1;
        const naturalW = 'naturalWidth' in img1 ? img1.naturalWidth : (img1 as ImageBitmap).width;
        const naturalH = 'naturalHeight' in img1 ? img1.naturalHeight : (img1 as ImageBitmap).height;

        if (naturalW > 0) {
          // COVER SCALING: Covers the whole canvas wall-to-wall without empty margins
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

          // Anti-Gravity Sinusoidal Floating Oscillation + Subtle Mouse Parallax
          const now = Date.now();
          const floatY = Math.sin(now * 0.0018) * 8 + mousePosRef.current.y * 6;
          const floatX = Math.cos(now * 0.0012) * 4 + mousePosRef.current.x * 6;

          const offsetX = (width - renderW) / 2 + floatX;
          const offsetY = (height - renderH) / 2 + floatY;

          // 3. Volumetric Soft Blue Aura beneath Floating Jaw
          const auraGrad = ctx.createRadialGradient(
            width / 2,
            offsetY + renderH * 0.55,
            renderW * 0.08,
            width / 2,
            offsetY + renderH * 0.55,
            renderW * 0.45
          );
          auraGrad.addColorStop(0, 'rgba(2, 132, 199, 0.28)');
          auraGrad.addColorStop(0.5, 'rgba(0, 163, 255, 0.10)');
          auraGrad.addColorStop(1, 'rgba(5, 8, 14, 0)');
          ctx.fillStyle = auraGrad;
          ctx.fillRect(0, 0, width, height);

          // 4. Draw Primary Base Frame
          ctx.globalAlpha = 1.0;
          ctx.drawImage(img1 as CanvasImageSource, offsetX, offsetY, renderW, renderH);

          // 5. Cinematic Smooth Sub-Frame Crossfade Transition to Next Frame
          if (img2 && blendAlpha > 0.001) {
            ctx.globalAlpha = blendAlpha;
            ctx.drawImage(img2 as CanvasImageSource, offsetX, offsetY, renderW, renderH);
          }

          // 6. Cinematic Stage Lighting & Specular Enamel Sweeps
          ctx.globalAlpha = 1.0;

          if (activeSceneId === 2) {
            // Scene 02: Digital 3D Holographic CBCT Scan Line
            const scanY = (smoothProgress % 0.25) * 4 * height;
            const scanGrad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
            scanGrad.addColorStop(0, 'rgba(0, 163, 255, 0)');
            scanGrad.addColorStop(0.5, 'rgba(0, 163, 255, 0.35)');
            scanGrad.addColorStop(1, 'rgba(0, 163, 255, 0)');
            ctx.fillStyle = scanGrad;
            ctx.fillRect(0, 0, width, height);
          } else if (activeSceneId === 3) {
            // Scene 03: Orthodontic & Laser Glow Pulse
            const pulse = (Math.sin(now * 0.007) + 1) * 0.06;
            ctx.fillStyle = `rgba(2, 132, 199, ${pulse})`;
            ctx.fillRect(0, 0, width, height);
          } else if (activeSceneId >= 4) {
            // Scene 04, 05: Diamond Enamel Specular Glint Sweep
            const sweepX = (now * 0.35) % (width * 2.2) - width * 0.2;
            const glintGrad = ctx.createLinearGradient(sweepX, 0, sweepX + 140, height);
            glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            glintGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.22)');
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
  }, [activeSceneId, ensureFrameLoaded, getCachedFrame]);

  const activeScene = SCENES[activeSceneId - 1] || SCENES[0];

  return (
    <div ref={containerRef} className="relative w-full h-[600vh] bg-[#05080E]">
      {/* PINNED FULLSCREEN VIEWPORT (100vh x 100vw) */}
      <div className="sticky top-0 w-full h-screen overflow-hidden select-none">
        {/* Fullscreen HTML5 60 FPS Canvas */}
        <canvas
          ref={canvasRef}
          style={{ imageRendering: 'auto' }}
          className="w-full h-full block absolute inset-0 z-0 select-none pointer-events-none"
        />

        {/* Minimal Glassmorphic Top Brand Header */}
        <header className="absolute top-0 left-0 right-0 z-20 p-6 sm:p-8 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#00A3FF] flex items-center justify-center shadow-lg shadow-[#0284C7]/30 border border-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-white block">
                Home of Smiles
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#38BDF8] uppercase block">
                Advanced 3D Dentistry
              </span>
            </div>
          </div>

          {/* Frame & Progress Counter */}
          <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-3 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-200">
              FRAME {String(displayFrameIndex).padStart(3, '0')} / 150
            </span>
          </div>
        </header>

        {/* Floating Minimal Cinematic HUD Badges (Positioned gracefully away from the jaw) */}
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 sm:p-10 pt-24 pb-12">
          {/* Top Title Overlay */}
          <div className="max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSceneId}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4 }}
                className="space-y-2"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-[11px] font-mono font-bold text-[#38BDF8] border border-[#00A3FF]/30">
                  {activeScene.badge}
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {activeScene.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-lg">
                  {activeScene.tagline}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Progress Bar & Milestone Tracker */}
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4">
            {/* 5 Milestone Step Trackers */}
            <div className="w-full glass-panel px-5 py-3 rounded-2xl flex items-center justify-between gap-2 border border-white/15 shadow-2xl">
              {SCENES.map((sc) => {
                const isActive = activeSceneId === sc.id;
                const isPassed = activeSceneId > sc.id;

                return (
                  <div key={sc.id} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full flex items-center">
                      <div
                        className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                          isActive
                            ? 'bg-[#00A3FF] shadow-[0_0_12px_#00A3FF]'
                            : isPassed
                            ? 'bg-emerald-400'
                            : 'bg-slate-700/60'
                        }`}
                      />
                    </div>
                    <span
                      className={`text-[9px] font-mono tracking-wider truncate uppercase ${
                        isActive ? 'text-[#38BDF8] font-bold' : isPassed ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {sc.name.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Scroll Down Prompt Hint */}
            {!isFinalFrameReached && (
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 tracking-wider"
              >
                <span>SCROLL DOWN TO PROGRESS TRANSFORMATION</span>
                <ChevronDown className="w-4 h-4 text-[#00A3FF]" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Final Frame 150 Smiling Woman CTA Card */}
        <AnimatePresence>
          {isFinalFrameReached && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-10 right-6 sm:right-12 z-30 pointer-events-auto max-w-sm w-full"
            >
              <div className="glass-panel p-6 rounded-3xl border border-white/25 shadow-2xl backdrop-blur-2xl bg-slate-950/80 text-white space-y-4">
                <div className="flex items-center gap-2 text-[#38BDF8] text-xs font-mono font-bold uppercase tracking-wider">
                  <Smile className="w-4 h-4" />
                  <span>TRANSFORMATION COMPLETE</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white">
                  Your smile starts here.
                </h3>
                <p className="text-xs text-slate-300 font-normal leading-relaxed">
                  Experience precision cosmetic dentistry, porcelain restorations, and painless orthodontic care.
                </p>
                <button
                  onClick={() => alert('Booking consultation demo initiated.')}
                  className="glass-button w-full py-3 px-5 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-white shadow-lg cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book an Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
