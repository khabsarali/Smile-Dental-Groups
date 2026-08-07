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
            { label: 'LASER WERT', val: '99.9% STERILE' },
            { label: 'ALIGNMENT', val: 'IN PROGRESS' },
          ],
        };
      case 4:
        return {
          badge: 'SCENE 04 • FULLY RESTORED PERFECT JAW',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />,
          title: 'VITA BL1 Porcelain Enamel & Gum Health',
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
  const isRightAligned = stage % 2 === 0;

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

      {/* Main Headline & CTAs Card (Alternating Left/Right Desktop Alignment) */}
      <div className={`w-full max-w-xl mx-auto mb-4 sm:mb-8 md:mb-12 ${isRightAligned ? 'lg:ml-auto lg:mr-0' : 'lg:mr-auto lg:ml-0'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${stage}`}
            initial={{ opacity: 0, x: isRightAligned ? 40 : -40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: isRightAligned ? -40 : 40, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`glass-panel-glow p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl border border-[#0284C7]/20 backdrop-blur-2xl shadow-[0_20px_50px_rgba(15,23,42,0.08)] pointer-events-auto flex flex-col ${
              isRightAligned ? 'lg:items-end lg:text-right' : 'lg:items-start lg:text-left'
            }`}
          >
            {/* Title */}
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-2 sm:mb-4 leading-[1.15]">
              {content.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal leading-relaxed mb-4 sm:mb-6 max-w-lg">
              {content.subtitle}
            </p>

            {/* HUD Telemetry Stats Bar */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-200/80 mb-5 sm:mb-6 font-mono w-full">
              {content.hudStats.map((stat, idx) => (
                <div key={idx} className={`flex flex-col ${isRightAligned ? 'lg:items-end' : 'lg:items-start'}`}>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider">{stat.label}</span>
                  <span className="text-xs sm:text-sm font-bold text-[#0284C7]">{stat.val}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-wrap items-center gap-3 sm:gap-4 w-full ${isRightAligned ? 'lg:justify-end' : 'lg:justify-start'}`}>
              <button
                onClick={() => scrollToSection('booking-section')}
                onMouseEnter={() => soundFX.playHover()}
                className="bg-[#0284C7] hover:bg-[#00A3FF] text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide shadow-lg shadow-[#0284C7]/25 hover:shadow-[#00A3FF]/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
              >
                <Calendar className="w-4 h-4" />
                <span>{content.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => scrollToSection('treatments-section')}
                onMouseEnter={() => soundFX.playHover()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-medium tracking-wide hover:-translate-y-0.5 transition-all"
              >
                <span>{content.ctaSecondary}</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
