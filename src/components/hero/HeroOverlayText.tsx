import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

interface HeroOverlayTextProps {
  stage: number;
  progress: number;
  onNavigate?: (page: string) => void;
}

export const HeroOverlayText: React.FC<HeroOverlayTextProps> = ({ stage, progress, onNavigate }) => {
  const handleBooking = () => {
    soundFX.playClick();
    if (onNavigate) {
      onNavigate('appointment');
    } else {
      const el = document.getElementById('booking-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getStageContent = () => {
    switch (stage) {
      case 1:
        return {
          title: 'Transform Your Smile with Precision Dentistry',
          subtitle: 'Architectural bio-robotic implants & 3D digital smile design.',
        };
      case 2:
        return {
          title: 'Sub-Surface Roots & Bone Telemetry',
          subtitle: 'Transparent holographic X-ray diagnostic scan.',
        };
      case 3:
        return {
          title: 'Precision Drill & Laser Surgery',
          subtitle: 'Sub-micron decay removal & archwire tooth alignment.',
        };
      case 4:
        return {
          title: 'VITA BL1 Porcelain Enamel Finish',
          subtitle: 'Diamond light sweeps polishing porcelain veneers.',
        };
      case 5:
      default:
        return {
          title: 'Confidence Restored. Life Transformed.',
          subtitle: '360° rotation and natural smile integration.',
        };
    }
  };

  const content = getStageContent();

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-center p-6 sm:p-10 lg:p-16">
      {/* Ultra-Minimal Left Side Hero Content Container */}
      <div className="w-full max-w-md mr-auto text-left pointer-events-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${stage}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            {/* Minimal Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              {content.title}
            </h1>

            {/* Minimal Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-sm">
              {content.subtitle}
            </p>

            {/* Simple CTA Button */}
            <div className="pt-2">
              <button
                onClick={handleBooking}
                onMouseEnter={() => soundFX.playHover()}
                className="bg-[#0284C7] hover:bg-[#00A3FF] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
