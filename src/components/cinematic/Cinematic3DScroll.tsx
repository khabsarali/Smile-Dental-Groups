import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Scan, Zap, ShieldCheck, Smile, ChevronDown, Calendar, ArrowRight, Activity, Sliders } from 'lucide-react';
import { TOTAL_FRAMES, SCENES } from '../../engine/FrameManifest';
import { FrameAsset, globalFrameLoader } from '../../engine/FrameLoader';
import { soundFX } from '../../ui/SoundEffects';

export const Cinematic3DScroll: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isTabVisibleRef = useRef<boolean>(true);
  const lastDrawnFrameRef = useRef<FrameAsset | null>(null);

  // Mutable animation references (Zero React re-renders on scroll movement)
  const targetScrollRef = useRef<number>(0);
  const currentInterpolatedScrollRef = useRef<number>(0);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // UI state for telemetry and milestones
  const [activeSceneId, setActiveSceneId] = useState<number>(1);
  const [displayFrameIndex, setDisplayFrameIndex] = useState<number>(1);
  const [scrollPercent, setScrollPercent] = useState<number>(0);
  const [isFinalFrameReached, setIsFinalFrameReached] = useState<boolean>(false);

  // Scroll listener updating mutable ref (Decoupled 60 FPS)
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDist = containerRef.current.scrollHeight - window.innerHeight;

      if (scrollableDist <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / scrollableDist));
      targetScrollRef.current = progress;

      // Update UI metrics on frame changes
      const currentFrameNum = Math.min(150, Math.max(1, Math.round(progress * 149) + 1));
      setDisplayFrameIndex(currentFrameNum);
      setScrollPercent(Math.round(progress * 100));

      let scId = 1;
      for (const scene of SCENES) {
        if (currentFrameNum - 1 >= scene.startFrame && currentFrameNum - 1 <= scene.endFrame) {
          scId = scene.id;
          break;
        }
      }
      setActiveSceneId(scId);
      setIsFinalFrameReached(progress >= 0.95);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Jump to specific scene milestone
  const jumpToScene = useCallback((sceneIndex: number) => {
    if (!containerRef.current) return;
    soundFX.playClick();

    const scene = SCENES[sceneIndex];
    const targetProgress = scene.startFrame / (TOTAL_FRAMES - 1);
    const scrollableDist = containerRef.current.scrollHeight - window.innerHeight;
    const targetScrollY = containerRef.current.offsetTop + targetProgress * scrollableDist;

    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
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
      currentInterpolatedScrollRef.current += (targetScrollRef.current - currentInterpolatedScrollRef.current) * 0.18;
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

      // Notify FrameLoader of current scroll progress to dynamically stream upcoming frames
      globalFrameLoader.onScrollProgress(index1);

      const img1 = globalFrameLoader.getCachedFrame(index1) || lastDrawnFrameRef.current;
      const img2 = globalFrameLoader.getCachedFrame(index2) || img1;

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
  }, [activeSceneId]);

  const activeScene = SCENES[activeSceneId - 1] || SCENES[0];

  const stageSpecs = [
    {
      specs: [
        { label: 'Erosion Depth', val: '1.8 mm' },
        { label: 'Crooked Offset', val: '+14.2°' },
        { label: 'Gums', val: 'Inflamed' },
      ],
    },
    {
      specs: [
        { label: 'CBCT Voxel', val: '75 μm' },
        { label: 'Root Canals', val: 'Mapped 3D' },
        { label: 'Bone Density', val: 'Type II' },
      ],
    },
    {
      specs: [
        { label: 'Laser Wave', val: '2,940 nm' },
        { label: 'Force Vector', val: '0.25 N Gentle' },
        { label: 'Archwire', val: 'NiTi Active' },
      ],
    },
    {
      specs: [
        { label: 'Shade', val: 'VITA BL1 White' },
        { label: 'Ceramic Matrix', val: 'LiSi2 Disilicate' },
        { label: 'Occlusion', val: '100% Symmetrical' },
      ],
    },
    {
      specs: [
        { label: 'Symmetry Ratio', val: '99.8% Golden Arc' },
        { label: 'Smile Curve', val: 'Harmonious' },
        { label: 'Patient Smile', val: 'Radiant & Natural' },
      ],
    },
  ];

  const currentSpecs = stageSpecs[activeSceneId - 1] || stageSpecs[0];

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
                3D Transformation Progress
              </span>
            </div>
          </div>

          {/* Frame & Progress Counter */}
          <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-3 border border-white/15 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-200">
              FRAME {String(displayFrameIndex).padStart(3, '0')} / 150 ({scrollPercent}%)
            </span>
          </div>
        </header>

        {/* Right Quick-Jump Interactive Stage Navigator */}
        <div className="hidden md:flex flex-col gap-2 absolute right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-auto">
          {SCENES.map((sc, i) => {
            const isCurrent = activeSceneId === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => jumpToScene(i)}
                onMouseEnter={() => soundFX.playHover()}
                className={`group flex items-center gap-3 px-3.5 py-2 rounded-2xl transition-all duration-300 cursor-pointer border ${
                  isCurrent
                    ? 'bg-slate-900/90 border-[#00A3FF] text-white shadow-[0_0_20px_rgba(0,163,255,0.4)] scale-105'
                    : 'glass-panel border-white/10 text-slate-400 hover:text-white hover:border-white/30'
                }`}
              >
                <span className={`w-2 h-2 rounded-full transition-all ${isCurrent ? 'bg-[#00A3FF] shadow-[0_0_8px_#00A3FF]' : 'bg-slate-600'}`} />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-left">
                  {sc.badge.split('//')[1]?.trim() || sc.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Floating Minimal Cinematic HUD Badges (Positioned cleanly away from the jaw) */}
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 sm:p-10 pt-24 pb-10">
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

                {/* Live Diagnostic Specs Bar */}
                <div className="grid grid-cols-3 gap-2 pt-2 max-w-md">
                  {currentSpecs.specs.map((sp, idx) => (
                    <div key={idx} className="bg-slate-950/60 rounded-xl p-2 border border-white/10 text-center backdrop-blur-md">
                      <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-tight">
                        {sp.label}
                      </span>
                      <span className="text-xs font-bold text-[#38BDF8] truncate block">
                        {sp.val}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Progress Bar & Milestone Tracker */}
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-3">
            {/* 5 Milestone Step Trackers */}
            <div className="w-full glass-panel px-5 py-3 rounded-2xl flex items-center justify-between gap-2 border border-white/15 shadow-2xl">
              {SCENES.map((sc, i) => {
                const isActive = activeSceneId === sc.id;
                const isPassed = activeSceneId > sc.id;

                return (
                  <div
                    key={sc.id}
                    onClick={() => jumpToScene(i)}
                    className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer pointer-events-auto"
                  >
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
                      Stage 0{sc.id}
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
                <span>SCROLL DOWN TO PROGRESS JAW TRANSFORMATION</span>
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
                  onClick={() => {
                    soundFX.playClick();
                    const el = document.getElementById('appointment');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="glass-button w-full py-3 px-5 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-white shadow-lg cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book VIP Consultation</span>
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
