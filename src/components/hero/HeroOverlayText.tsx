import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, Sparkles, Scan, Zap, ShieldCheck, RotateCw } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

interface HeroOverlayTextProps {
  stage: number;
  progress: number;
}

export const HeroOverlayText: React.FC<HeroOverlayTextProps> = ({ stage, progress }) => {
  const scrollToSection = (id: string) => {
    soundFX.playClick();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const getStageContent = () => {
    switch (stage) {
      case 1:
        return {
          badge: 'SCENE 01 • INITIAL CLINICAL EVALUATION',
          icon: <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />,
          title: 'Transform Your Smile with Precision Dentistry',
          subtitle:
            'Floating 3D jaw reveals deep cavities, plaque buildup, cracked enamel, crooked teeth, and inflamed gums in realistic medical detail.',
          ctaPrimary: 'Book Appointment',
          ctaSecondary: 'Explore Treatments',
          hudStats: [
            { label: 'TEETH MAPPED', val: '32 / 32' },
            { label: 'CAVITY DECAY', val: 'HIGH DECAY' },
            { label: 'RESTORATION', val: 'REQUIRED' },
          ],
        };
      case 2:
        return {
          badge: 'SCENE 02 • TRANSPARENT X-RAY SCAN',
          icon: <Scan className="w-3.5 h-3.5 text-[#00A3FF] animate-pulse" />,
          title: 'Sub-Surface Roots, Nerves & Bone Telemetry',
          subtitle:
            'Glowing blue holographic scanners project transparent overlays, revealing internal root pathways, nerve channels, bone density, and hidden decay.',
          ctaPrimary: 'View Scan Telemetry',
          ctaSecondary: 'Learn AI Diagnostics',
          hudStats: [
            { label: 'ROOT MAP', val: 'ISOLATED' },
            { label: 'NERVES', val: '4 PATHWAYS' },
            { label: 'BONE DENSITY', val: '99.8%' },
          ],
        };
      case 3:
        return {
          badge: 'SCENE 03 • ROBOTIC LASER & BRACKET SURGERY',
          icon: <Zap className="w-3.5 h-3.5 text-amber-500 animate-bounce" />,
          title: 'Precision Drill Decay Removal & Tooth Alignment',
          subtitle:
            'Robotic instruments enter: precision drills remove decay, lasers sterilize tissue, composite fillings seal cavities, and archwire brackets align teeth.',
          ctaPrimary: 'Painless Laser Tech',
          ctaSecondary: 'Treatment Specs',
          hudStats: [
            { label: 'DRILL ACCURACY', val: 'SUB-MICRON' },
            { label: 'STERILIZATION', val: '100% STERILE' },
            { label: 'ALIGNMENT', val: 'IN PROGRESS' },
          ],
        };
      case 4:
        return {
          badge: 'SCENE 04 • PORCELAIN ARCHITECTURE RESTORED',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
          title: 'Flawless Alignment & Polished White Enamel',
          subtitle:
            'Cavities eliminated, teeth perfectly aligned, healthy pink gums restored, and diamond light sweeps polishing white porcelain enamel.',
          ctaPrimary: 'Porcelain Veneers',
          ctaSecondary: 'Clinical Proof',
          hudStats: [
            { label: 'ENAMEL SHADE', val: 'VITA BL1 EXTRA' },
            { label: 'ALIGNMENT', val: '100% PERFECT' },
            { label: 'SURFACE POLISH', val: 'DIAMOND GRADE' },
          ],
        };
      case 5:
      default:
        return {
          badge: 'SCENE 05 • 360° ROTATION & SMILE INTEGRATION',
          icon: <RotateCw className="w-3.5 h-3.5 text-[#0284C7] animate-spin" />,
          title: 'Confidence Restored. Life Transformed.',
          subtitle:
            'The restored jaw performs a slow 360° rotation and naturally aligns into a realistic woman’s mouth as she closes her lips and smiles with radiant confidence.',
          ctaPrimary: 'Claim Your Consultation',
          ctaSecondary: 'View Patient Stories',
          hudStats: [
            { label: '360° ROTATION', val: 'COMPLETED' },
            { label: 'SMILE INTEGRATION', val: 'NATURAL' },
            { label: 'PATIENT RATING', val: '★ ★ ★ ★ ★' },
          ],
        };
    }
  };

  const content = getStageContent();

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 sm:p-6 md:p-10 lg:p-12">
      {/* Top HUD Header Status Bar */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto pt-16 sm:pt-20 md:pt-24">
        <motion.div
          key={`badge-${stage}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-panel px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono tracking-wider text-[#0284C7] border border-[#0284C7]/25 shadow-sm"
        >
          {content.icon}
          <span className="font-bold">{content.badge}</span>
        </motion.div>

        {/* Frame Progress Indicator */}
        <div className="hidden sm:flex items-center gap-3 glass-panel px-4 py-2 rounded-full text-xs font-mono text-slate-700 border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-[#00A3FF] animate-pulse" />
          <span>SCENARIO PROGRESS: {Math.round(progress * 100)}%</span>
        </div>
      </div>

      {/* Main Headline & CTAs Card (Bottom Overlay) */}
      <div className="w-full max-w-3xl mx-auto mb-4 sm:mb-8 md:mb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${stage}`}
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel-glow p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-[#0284C7]/20 backdrop-blur-2xl shadow-[0_20px_50px_rgba(15,23,42,0.08)] pointer-events-auto"
          >
            {/* Title */}
            <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-2 sm:mb-4 leading-[1.15]">
              {content.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal leading-relaxed mb-4 sm:mb-6 max-w-2xl">
              {content.subtitle}
            </p>

            {/* HUD Diagnostic Data Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6 pt-3 sm:pt-4 border-t border-slate-200/80">
              {content.hudStats.map((stat, idx) => (
                <div key={idx} className="glass-panel p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-200/60">
                  <span className="block text-[8px] sm:text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-0.5 sm:mb-1 truncate">
                    {stat.label}
                  </span>
                  <span className="block text-[10px] sm:text-xs md:text-sm font-mono font-bold text-[#0284C7] truncate">
                    {stat.val}
                  </span>
                </div>
              ))}
            </div>

            {/* Interactive Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => scrollToSection('booking-section')}
                onMouseEnter={() => soundFX.playHover()}
                className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-[#0284C7] to-[#00A3FF] text-white font-bold text-[11px] sm:text-xs md:text-sm tracking-wider uppercase flex items-center gap-1.5 sm:gap-2 shadow-[0_4px_20px_rgba(2,132,199,0.35)] hover:shadow-[0_6px_25px_rgba(2,132,199,0.5)] hover:scale-105 transition-all duration-300"
              >
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{content.ctaPrimary}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={() => scrollToSection('treatments-section')}
                onMouseEnter={() => soundFX.playHover()}
                className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-full glass-panel text-slate-700 font-semibold text-[11px] sm:text-xs md:text-sm tracking-wider uppercase border border-slate-300 hover:border-[#0284C7]/50 hover:text-[#0284C7] hover:bg-slate-50 transition-all duration-300"
              >
                {content.ctaSecondary}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scroll Down Prompt Indicator */}
      <div className="flex flex-col items-center justify-center mb-2 sm:mb-4 text-slate-500 font-mono text-[9px] sm:text-[10px] tracking-widest uppercase">
        <span className="mb-1 sm:mb-2 animate-bounce flex items-center gap-1 text-[#0284C7] font-semibold">
          SCROLL TO ADVANCE ANIMATION <ArrowRight className="w-3 h-3 rotate-90" />
        </span>
      </div>
    </div>
  );
};
