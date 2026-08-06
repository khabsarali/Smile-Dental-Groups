import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Cpu } from 'lucide-react';

interface PreloaderProps {
  progress: number;
  loadedCount: number;
  totalCount: number;
  isLoaded: boolean;
}

export const Preloader: React.FC<PreloaderProps> = ({ progress, loadedCount, totalCount, isLoaded }) => {
  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[9999] bg-[#05070A] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
        >
          {/* Ambient background glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#4FC3F7]/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
          <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-[#00E5FF]/5 rounded-full blur-[100px] pointer-events-none" />

          {/* High-tech central ring */}
          <div className="relative flex flex-col items-center max-w-md w-full">
            <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
              {/* Outer spinning ring */}
              <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="rgba(79, 195, 247, 0.15)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                />
              </svg>

              {/* Progress SVG Ring */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(79, 195, 247, 0.1)"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#4FC3F7"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="263.89"
                  strokeDashoffset={263.89 - (263.89 * progress) / 100}
                  transition={{ duration: 0.2 }}
                />
              </svg>

              {/* Percentage Counter inside ring */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold font-mono tracking-tight text-white">
                  {progress}<span className="text-sm text-[#4FC3F7]">%</span>
                </span>
              </div>
            </div>

            {/* Title & Status */}
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold tracking-wider text-white uppercase mb-1 flex items-center justify-center gap-2">
                <Activity className="w-4 h-4 text-[#4FC3F7] animate-pulse" />
                SMILE DENTAL GROUPS
              </h2>
              <p className="text-xs font-mono text-slate-400 tracking-wide uppercase">
                Precision Architectural Dentistry
              </p>
            </div>

            {/* Diagnostic frame load bar */}
            <div className="w-full glass-panel p-4 rounded-xl space-y-3 border border-[#4FC3F7]/20">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="flex items-center gap-1.5 text-[#4FC3F7]">
                  <Cpu className="w-3.5 h-3.5" />
                  Preloading Frames
                </span>
                <span>{loadedCount} / {totalCount} FRAMES</span>
              </div>

              {/* Linear loader track */}
              <div className="w-full bg-slate-900/80 h-1.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#4FC3F7] via-[#00E5FF] to-white rounded-full shadow-[0_0_12px_#4FC3F7]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                <span>STAGE 1 - STAGE 5 PRELOAD</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3 h-3" /> 60 FPS READY
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
