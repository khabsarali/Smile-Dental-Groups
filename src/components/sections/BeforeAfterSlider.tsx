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
    <section id="before-after-section" className="relative py-28 px-6 bg-[#05070A] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="glass-panel px-4 py-1.5 rounded-full text-xs font-mono text-[#4FC3F7] tracking-widest uppercase mb-4 border border-[#4FC3F7]/30 shadow-[0_0_15px_rgba(79,195,247,0.15)]">
            CLINICAL CASE RESULTS
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl leading-tight mb-4">
            Interactive Smile Transformation
          </h2>
          <p className="text-slate-400 max-w-xl text-sm sm:text-base font-normal">
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
            className="relative h-[400px] sm:h-[500px] w-full rounded-3xl overflow-hidden glass-panel border border-[#4FC3F7]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-ew-resize select-none"
          >
            {/* AFTER Image (Full Layer underneath) */}
            <img
              src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=1400"
              alt="Restored Smile After Treatment"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-6 right-6 z-10 glass-panel-glow px-4 py-2 rounded-full text-xs font-mono font-bold text-[#00E5FF] border border-[#00E5FF]/40 shadow-lg flex items-center gap-1.5">
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
              <div className="absolute top-6 left-6 z-10 glass-panel px-4 py-2 rounded-full text-xs font-mono font-bold text-slate-300 border border-white/20 shadow-lg">
                BEFORE DIAGNOSIS
              </div>
            </div>

            {/* Split Drag Handle Bar */}
            <div
              className="absolute inset-y-0 z-20 w-1 bg-gradient-to-b from-[#4FC3F7] via-[#00E5FF] to-[#4FC3F7] shadow-[0_0_15px_#00E5FF]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#05070A] border-2 border-[#00E5FF] flex items-center justify-center shadow-[0_0_20px_#00E5FF] text-[#00E5FF]">
                <MoveHorizontal className="w-5 h-5" />
              </div>
            </div>
          </motion.div>

          {/* Case Specs Bar */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#4FC3F7] shrink-0" />
              <div>
                <span className="block text-[10px] font-mono text-slate-400 uppercase">PROCEDURE</span>
                <span className="text-xs font-bold text-white">Full Arch 3D Porcelain Restoration</span>
              </div>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#00E5FF] shrink-0" />
              <div>
                <span className="block text-[10px] font-mono text-slate-400 uppercase">TIMELINE</span>
                <span className="text-xs font-bold text-white">2 Appointments • 10 Days Total</span>
              </div>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="block text-[10px] font-mono text-slate-400 uppercase">SATISFACTION</span>
                <span className="text-xs font-bold text-white">100% Patient Delight Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
