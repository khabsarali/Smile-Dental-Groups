import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, Sparkles, Scan, Zap, ShieldCheck, Award } from 'lucide-react';
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
          badge: 'STAGE 01 • DIAGNOSTIC ASSESSMENT',
          icon: <Sparkles className="w-3.5 h-3.5 text-[#4FC3F7]" />,
          title: 'Transform Your Smile with Precision Dentistry',
          subtitle:
            'Comprehensive evaluation reveals cracked enamel, cavities, plaque buildup, and inflamed tissue. Discover how architectural dentistry restores natural perfection.',
          ctaPrimary: 'Book Appointment',
          ctaSecondary: 'Explore Treatments',
          hudStats: [
            { label: 'TEETH EXAMINED', val: '32 / 32' },
            { label: 'PLAQ INDEX', val: 'HIGH (STAGE 1)' },
            { label: 'RESTORATION', val: 'RECOMMENDED' },
          ],
        };
      case 2:
        return {
          badge: 'STAGE 02 • 3D HOLOGRAPHIC X-RAY SCAN',
          icon: <Scan className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />,
          title: 'Sub-Surface Telemetry & Root Telemetry',
          subtitle:
            'Futuristic blue laser scanners project transparent overlays, revealing pulp vitalities, root canal pathways, bone density, and micro-fractures in high resolution.',
          ctaPrimary: 'View Scan Telemetry',
          ctaSecondary: 'Learn AI Diagnostics',
          hudStats: [
            { label: 'SCAN ACCURACY', val: '99.98%' },
            { label: 'ROOT MAP', val: 'COMPLETED' },
            { label: 'NERVE PATHWAYS', val: 'ISOLATED' },
          ],
        };
      case 3:
        return {
          badge: 'STAGE 03 • MICROSCOPIC LASER SURGERY',
          icon: <Zap className="w-3.5 h-3.5 text-yellow-400 animate-bounce" />,
          title: 'Robotic Precision & Enamel Restoration',
          subtitle:
            'Precision robotic tools execute painless cavity elimination, laser bacterial sterilization, ultrasonic plaque removal, and ceramic tooth reconstruction.',
          ctaPrimary: 'Painless Laser Tech',
          ctaSecondary: 'Treatment Specs',
          hudStats: [
            { label: 'LASER FREQ', val: '10.6 µm' },
            { label: 'CAVITY STATUS', val: 'ELIMINATED' },
            { label: 'DISINFECTION', val: '100% STERILE' },
          ],
        };
      case 4:
        return {
          badge: 'STAGE 04 • PORCELAIN ARCHITECTURE RESTORED',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
          title: 'Flawless Enamel & Healthy Tissue',
          subtitle:
            'The jaw stands fully restored with ultra-glossy VITA BL1 porcelain enamel, perfectly symmetrical alignment, balanced bite occlusion, and vibrant pink gums.',
          ctaPrimary: 'Porcelain Veneers',
          ctaSecondary: 'Clinical Proof',
          hudStats: [
            { label: 'ENAMEL SHADE', val: 'VITA BL1 EXTRA' },
            { label: 'MARGIN GAP', val: '0.00 MICRONS' },
            { label: 'SURFACE GLOSS', val: 'DIAMOND GRADE' },
          ],
        };
      case 5:
      default:
        return {
          badge: 'STAGE 05 • PERFECT SMILE INTEGRATION',
          icon: <Award className="w-3.5 h-3.5 text-[#4FC3F7]" />,
          title: 'Confidence Restored. Masterpiece Delivered.',
          subtitle:
            'The restored jaw naturally integrates into facial anatomy as she closes her mouth and smiles with radiantly restored confidence. Experience gold-standard care.',
          ctaPrimary: 'Claim Your Smile Consultation',
          ctaSecondary: 'View Patient Stories',
          hudStats: [
            { label: 'PATIENT SATISFACTION', val: '100% PERFECT' },
            { label: 'LIFETIME GUARANTEE', val: 'VERIFIED' },
            { label: 'SMILE RATING', val: '★ ★ ★ ★ ★' },
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
          className="glass-panel px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono tracking-wider text-[#4FC3F7] border border-[#4FC3F7]/30 shadow-[0_0_15px_rgba(79,195,247,0.2)]"
        >
          {content.icon}
          <span>{content.badge}</span>
        </motion.div>

        {/* Frame Progress Indicator */}
        <div className="hidden sm:flex items-center gap-3 glass-panel px-4 py-2 rounded-full text-xs font-mono text-slate-300 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
          <span>PROGRESS: {Math.round(progress * 100)}%</span>
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
            className="glass-panel-glow p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-[#4FC3F7]/30 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] pointer-events-auto"
          >
            {/* Title */}
            <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2 sm:mb-4 leading-[1.15]">
              {content.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-slate-300 font-normal leading-relaxed mb-4 sm:mb-6 max-w-2xl">
              {content.subtitle}
            </p>

            {/* HUD Diagnostic Data Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6 pt-3 sm:pt-4 border-t border-white/10">
              {content.hudStats.map((stat, idx) => (
                <div key={idx} className="glass-panel p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-white/5">
                  <span className="block text-[8px] sm:text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-1 truncate">
                    {stat.label}
                  </span>
                  <span className="block text-[10px] sm:text-xs md:text-sm font-mono font-bold text-[#4FC3F7] truncate">
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
                className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-[#4FC3F7] to-[#00E5FF] text-slate-950 font-bold text-[11px] sm:text-xs md:text-sm tracking-wider uppercase flex items-center gap-1.5 sm:gap-2 shadow-[0_0_25px_rgba(79,195,247,0.5)] hover:shadow-[0_0_35px_rgba(79,195,247,0.8)] hover:scale-105 transition-all duration-300"
              >
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{content.ctaPrimary}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={() => scrollToSection('treatments-section')}
                onMouseEnter={() => soundFX.playHover()}
                className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-full glass-panel text-slate-200 font-semibold text-[11px] sm:text-xs md:text-sm tracking-wider uppercase border border-white/15 hover:border-[#4FC3F7]/50 hover:text-[#4FC3F7] hover:bg-white/5 transition-all duration-300"
              >
                {content.ctaSecondary}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scroll Down Prompt Indicator */}
      <div className="flex flex-col items-center justify-center mb-2 sm:mb-4 text-slate-400 font-mono text-[9px] sm:text-[10px] tracking-widest uppercase">
        <span className="mb-1 sm:mb-2 animate-bounce flex items-center gap-1 text-[#4FC3F7]">
          SCROLL TO ADVANCE ANIMATION <ArrowRight className="w-3 h-3 rotate-90" />
        </span>
      </div>
    </div>
  );
};
