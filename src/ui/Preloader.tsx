import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Cpu } from 'lucide-react';

interface PreloaderProps {
  progress: number;
  loadedCount: number;
  totalCount: number;
  isLoaded: boolean;
}

export const Preloader: React.FC<PreloaderProps> = ({ progress, loadedCount, totalCount, isLoaded }) => {
  const [forceDone, setForceDone] = useState(false);

  // Maximum 0.45s splash timeout for instant 0.5s TTI
  useEffect(() => {
    const timer = setTimeout(() => {
      setForceDone(true);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const shouldShow = !isLoaded && !forceDone;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[9999] bg-[#05080E] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
        >
          {/* Ambient background glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0284C7]/15 rounded-full blur-[140px] pointer-events-none" />

          {/* Central Progress Ring */}
          <div className="relative flex flex-col items-center max-w-md w-full">
            <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
              {/* Spinning Ring */}
              <svg className="absolute inset-0 w-full h-full animate-[spin_8s_linear_infinite]" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="rgba(2, 132, 199, 0.25)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                />
              </svg>

              {/* Progress Ring */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(2, 132, 199, 0.15)"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#00A3FF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="263.89"
                  strokeDashoffset={263.89 - (263.89 * (progress || 100)) / 100}
                />
              </svg>

              {/* Percentage Counter inside ring */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold font-mono tracking-tight text-white">
                  {progress || 100}<span className="text-xs text-[#00A3FF]">%</span>
                </span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h2 className="text-sm font-bold tracking-widest text-white uppercase mb-1 flex items-center justify-center gap-2">
                <Activity className="w-4 h-4 text-[#00A3FF] animate-pulse" />
                HOME OF SMILES DENTAL
              </h2>
              <p className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">
                Terwillegar Modern Practice • 60 FPS Ready
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
