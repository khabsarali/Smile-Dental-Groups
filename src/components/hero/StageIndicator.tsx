import React from 'react';
import { soundFX } from '../../ui/SoundEffects';

interface StageIndicatorProps {
  currentStage: number;
  progress: number;
}

export const StageIndicator: React.FC<StageIndicatorProps> = ({ currentStage, progress }) => {
  const stages = [
    { num: 1, label: '01. Damaged Jaw' },
    { num: 2, label: '02. X-Ray Telemetry' },
    { num: 3, label: '03. Laser Surgery' },
    { num: 4, label: '04. Restored Teeth' },
    { num: 5, label: '05. 360° Smile Align' },
  ];

  const jumpToStage = (stageNum: number) => {
    soundFX.playClick();
    const heroEl = document.getElementById('hero-container');
    if (!heroEl) return;
    const heroHeight = heroEl.offsetHeight;
    const targetScroll = (stageNum - 1) * 0.2 * heroHeight;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-end gap-5 pointer-events-auto">
      {stages.map((st) => {
        const isActive = currentStage === st.num;
        return (
          <button
            key={st.num}
            onClick={() => jumpToStage(st.num)}
            onMouseEnter={() => soundFX.playHover()}
            className="group flex items-center gap-3 text-right"
          >
            {/* Label popup on hover or active */}
            <span
              className={`text-[11px] font-mono font-semibold tracking-wider transition-all duration-300 ${
                isActive
                  ? 'text-[#0284C7] opacity-100 translate-x-0'
                  : 'text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-slate-800 translate-x-2'
              }`}
            >
              {st.label}
            </span>

            {/* Glowing Dot Node */}
            <div className="relative flex items-center justify-center w-6 h-6">
              {isActive && (
                <span className="absolute inset-0 rounded-full bg-[#0284C7]/30 animate-ping" />
              )}
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-3.5 h-3.5 bg-[#0284C7] shadow-[0_0_12px_#0284C7]'
                    : 'bg-slate-300 group-hover:bg-[#0284C7]/60'
                }`}
              />
            </div>
          </button>
        );
      })}

      {/* Progress Track Line */}
      <div className="absolute right-[11px] top-3 bottom-3 -z-10 w-[2px] bg-slate-200">
        <div
          className="w-full bg-[#0284C7] transition-all duration-200 shadow-[0_0_8px_#0284C7]"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
};
