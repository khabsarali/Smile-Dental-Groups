import React from 'react';
import { Sparkles, MapPin, Phone, Mail, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    soundFX.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#030508] border-t border-white/10 pt-20 pb-12 px-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#4FC3F7]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/10">
          {/* Col 1: Brand & Live Status */}
          <div className="lg:col-span-2 space-y-6">
            <a href="#" onClick={scrollToTop} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4FC3F7]/20 border border-[#4FC3F7]/40 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#4FC3F7]" />
              </div>
              <span className="text-xl font-extrabold tracking-wider text-white">
                SMILE <span className="text-[#4FC3F7]">DENTAL</span> GROUPS
              </span>
            </a>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The international benchmark in architectural dentistry, bio-robotic implants, 3D laser tooth restoration, and luxury cosmetic smile redesign.
            </p>

            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 glass-panel px-3.5 py-1.5 rounded-full text-xs font-mono border border-emerald-500/30 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>● CLINIC OPEN • Emergency Care 24/7</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-mono text-[#4FC3F7] uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {['Overview', 'About Clinic', 'Treatments', 'Before & After', 'Timeline', 'Doctor Profile'].map((item, idx) => (
                <li key={idx}>
                  <a
                    href={`#${item.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onMouseEnter={() => soundFX.playHover()}
                    className="hover:text-[#4FC3F7] transition-colors flex items-center gap-1"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Treatments */}
          <div>
            <h4 className="text-xs font-mono text-[#4FC3F7] uppercase tracking-wider mb-4">Treatments</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {['3D Porcelain Veneers', 'Robotic Implants', 'Microscopic Root Canal', 'Laser Whitening', 'Clear Aligners', 'Sedation Care'].map((item, idx) => (
                <li key={idx} className="hover:text-[#00E5FF] cursor-pointer transition-colors">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div>
            <h4 className="text-xs font-mono text-[#4FC3F7] uppercase tracking-wider mb-4">Location & Direct</h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#4FC3F7] shrink-0 mt-0.5" />
                <span>740 Fifth Avenue, 18th Floor, New York, NY 10019</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#00E5FF] shrink-0" />
                <span>+1 (800) 555-SMILE</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#4FC3F7] shrink-0" />
                <span>concierge@smiledentalgroups.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Mon - Sat: 8:00 AM - 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © 2026 SMILE DENTAL GROUPS. ALL RIGHTS RESERVED. ARCHITECTURAL DENTAL PRECISION.
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">PRIVACY POLICY</a>
            <a href="#" className="hover:text-slate-300 transition-colors">TERMS OF CLINICAL CARE</a>
            <button
              onClick={scrollToTop}
              className="text-[#4FC3F7] flex items-center gap-1 hover:underline"
            >
              BACK TO TOP <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
