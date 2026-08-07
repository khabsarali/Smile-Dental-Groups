import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MoveHorizontal, CheckCircle } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const BeforeAfterSlider: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <section id="before-after-section" className="relative py-28 px-6 bg-[#F8FAFC]/80 backdrop-blur-xl overflow-hidden border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="glass-panel px-4 py-1.5 rounded-full text-xs font-mono font-bold text-[#0284C7] tracking-widest uppercase mb-4 border border-[#0284C7]/30 shadow-sm">
            CLINICAL CASE RESULTS
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl leading-tight mb-4">
            Interactive Smile Transformation
          </h2>
          <p className="text-slate-600 max-w-xl text-sm sm:text-base font-normal">
            Drag the handle horizontally to compare damaged enamel vs our 3D porcelain veneer restoration.
          </p>
        </div>

        {/* Comparison Slider Box */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            ref={containerRef}
            onMouseDown={() => {
              soundFX.playClick();
              setIsDragging(true);
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onTouchMove={handleTouchMove}
            className="relative h-[400px] sm:h-[500px] w-full rounded-3xl overflow-hidden glass-panel border border-[#0284C7]/30 shadow-2xl cursor-ew-resize select-none"
          >
            {/* AFTER Image (Full Layer underneath) */}
            <img
              src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=1400"
              alt="Restored Smile After Treatment"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-6 right-6 z-10 glass-panel-glow px-4 py-2 rounded-full text-xs font-mono font-bold text-[#0284C7] border border-[#0284C7]/40 shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AFTER RESTORATION
            </div>

            {/* BEFORE Image (Clipped Layer on top) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1400"
                alt="Damaged Smile Before Treatment"
                className="absolute inset-0 h-full max-w-none object-cover grayscale brightness-90 contrast-125"
                style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%' }}
              />
              <div className="absolute top-6 left-6 z-10 glass-panel px-4 py-2 rounded-full text-xs font-mono font-bold text-slate-800 border border-slate-300 shadow-lg">
                BEFORE DIAGNOSIS
              </div>
            </div>

            {/* Split Drag Handle Bar */}
            <div
              className="absolute inset-y-0 z-20 w-1 bg-gradient-to-b from-[#0284C7] via-[#00A3FF] to-[#0284C7] shadow-[0_0_15px_#0284C7]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border-2 border-[#0284C7] flex items-center justify-center shadow-lg text-[#0284C7]">
                <MoveHorizontal className="w-5 h-5" />
              </div>
            </div>
          </motion.div>

          {/* Case Specs Bar */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-sm">
              <CheckCircle className="w-5 h-5 text-[#0284C7] shrink-0" />
              <div>
                <span className="block text-[10px] font-mono text-slate-500 uppercase font-semibold">PROCEDURE</span>
                <span className="text-xs font-bold text-slate-900">Full Arch 3D Porcelain Restoration</span>
              </div>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-sm">
              <CheckCircle className="w-5 h-5 text-[#00A3FF] shrink-0" />
              <div>
                <span className="block text-[10px] font-mono text-slate-500 uppercase font-semibold">TIMELINE</span>
                <span className="text-xs font-bold text-slate-900">2 Appointments • 10 Days Total</span>
              </div>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-sm">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="block text-[10px] font-mono text-slate-500 uppercase font-semibold">SATISFACTION</span>
                <span className="text-xs font-bold text-slate-900">100% Patient Delight Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
