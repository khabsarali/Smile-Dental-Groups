import React, { useState } from 'react';
import { Sparkles, MoveHorizontal } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const BeforeAfterSlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState<number>(50);

  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const offset = Math.max(0, Math.min(rect.width, clientX - rect.left));
    setSliderPos((offset / rect.width) * 100);
  };

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0284C7]/15 border border-[#0284C7]/30 text-[#38BDF8] text-xs font-mono font-bold tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>VERIFIED CLINICAL COMPARISON</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Interactive Smile Transformations
        </h2>
        <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
          Slide horizontally to compare severe pre-treatment enamel erosion and misalignment with final radiant porcelain restoration.
        </p>
      </div>

      {/* Interactive 2-Way Comparison Canvas Box */}
      <div
        onMouseMove={handleMove}
        onTouchMove={handleMove}
        onMouseEnter={() => soundFX.playHover()}
        className="relative w-full max-w-4xl mx-auto aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-slate-300 select-none cursor-ew-resize bg-[#05080E]"
      >
        {/* Underneath Layer: After Frame 150 (Smiling Woman & Perfect Enamel) */}
        <img
          src="/assets/webp/desktop/frame-150.webp"
          alt="After Dental Restoration"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Top Layer: Before Frame 001 (Crooked Teeth & Cavity Damage) clipped by sliderPos */}
        <div
          style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src="/assets/webp/desktop/frame-001.webp"
            alt="Before Dental Pathology"
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          />
        </div>

        {/* Vertical Divider Line with Glowing Handle */}
        <div
          style={{ left: `${sliderPos}%` }}
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,163,255,1)] pointer-events-none"
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-2xl flex items-center justify-center border-2 border-[#0284C7] text-[#0284C7]">
            <MoveHorizontal className="w-5 h-5" />
          </div>
        </div>

        {/* Corner Badges */}
        <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider">
          Initial Pathology (Before)
        </div>
        <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-[#0284C7]/80 backdrop-blur-md border border-white/30 text-white font-mono text-xs font-bold uppercase tracking-wider">
          Radiant Porcelain (After)
        </div>
      </div>
    </div>
  );
};
