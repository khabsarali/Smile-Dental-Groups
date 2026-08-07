import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity, ShieldCheck, ArrowRight } from 'lucide-react';
import { soundFX } from './SoundEffects';

interface PreloaderProps {
  progress: number;
  loadedCount: number;
  totalCount: number;
  isLoaded: boolean;
  loadingStage?: string;
  onEnter?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({
  progress,
  loadedCount,
  totalCount,
  isLoaded,
  loadingStage = 'Preparing your experience',
  onEnter,
}) => {
  const [canEnter, setCanEnter] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setCanEnter(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  const handleEnterClick = () => {
    soundFX.playClick();
    if (onEnter) onEnter();
  };

  return (
    <AnimatePresence>
      {!canEnter && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[9999] bg-[#05080E] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
        >
          {/* Volumetric background glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0284C7]/15 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-[#00A3FF]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative flex flex-col items-center max-w-md w-full text-center">
            {/* Holographic Central Progress Ring */}
            <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
              {/* Outer Spinning Ring */}
              <svg className="absolute inset-0 w-full h-full animate-[spin_8s_linear_infinite]" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="rgba(2, 132, 199, 0.3)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                />
              </svg>

              {/* Progress Radial Ring */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(2, 132, 199, 0.15)"
                  strokeWidth="3.5"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#00A3FF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="263.89"
                  strokeDashoffset={263.89 - (263.89 * (progress || 100)) / 100}
                  transition={{ duration: 0.2 }}
                />
              </svg>

              {/* Percentage Counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold font-mono tracking-tight text-white">
                  {progress || 100}<span className="text-sm text-[#00A3FF]">%</span>
                </span>
              </div>
            </div>

            {/* Brand Title */}
            <div className="space-y-1 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0284C7]/15 border border-[#0284C7]/30 text-[#38BDF8] text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>HOME OF SMILES DENTAL</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Terwillegar Dental Clinic
              </h2>
              <p className="text-xs font-mono text-slate-400">
                {loadingStage}
              </p>
            </div>

            {/* Diagnostic Progress Status */}
            <div className="w-full glass-panel p-4 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="flex items-center gap-1.5 text-[#00A3FF]">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  Streaming Keyframes
                </span>
                <span className="font-bold text-white">{loadedCount} / {totalCount} FRAMES</span>
              </div>

              {/* Linear Progress Bar */}
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#0284C7] via-[#00A3FF] to-[#38BDF8] rounded-full shadow-[0_0_12px_#00A3FF]"
                  style={{ width: `${progress || 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>SLIDING BUFFER: ACTIVE</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <ShieldCheck className="w-3 h-3" /> 60 FPS OPTIMIZED
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
