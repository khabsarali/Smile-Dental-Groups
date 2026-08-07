import React from 'react';
import { Sparkles, MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    soundFX.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (page: string) => {
    soundFX.playClick();
    if (onNavigate) {
      onNavigate(page);
    } else {
      scrollToTop();
    }
  };

  return (
    <footer className="relative bg-[#0F172A] text-slate-100 border-t border-slate-800 pt-20 pb-12 px-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#0284C7]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-slate-800">
          {/* Col 1: Brand & Status */}
          <div className="lg:col-span-2 space-y-6">
            <button onClick={() => handleNav('home')} className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#0284C7]/20 border border-[#0284C7]/40 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#38BDF8]" />
              </div>
              <span className="text-xl font-extrabold tracking-wider text-white">
                HOME OF <span className="text-[#38BDF8]">SMILES</span>
              </span>
            </button>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Terwillegar's modern dental clinic in Southwest Edmonton. Offering comprehensive family, cosmetic, implant, and emergency dentistry following the Alberta Dental Fee Guide.
            </p>

            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-900/90 px-3.5 py-1.5 rounded-full text-xs font-mono border border-emerald-500/30 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>● OPEN 7 DAYS A WEEK • Emergency Dentistry</span>
            </div>
          </div>

          {/* Col 2: Navigation Hub */}
          <div>
            <h4 className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider mb-4 font-bold">Navigation</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {[
                { label: '3D Treatment Journey', page: 'home' },
                { label: 'About Our Clinic', page: 'about' },
                { label: 'Comprehensive Services', page: 'services' },
                { label: 'Smile Transformations', page: 'gallery' },
                { label: 'Book Appointment', page: 'appointment' },
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleNav(item.page)}
                    onMouseEnter={() => soundFX.playHover()}
                    className="hover:text-[#38BDF8] transition-colors text-left flex items-center gap-1"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4 className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider mb-4 font-bold">Services</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {['Dental Implants', 'Porcelain Veneers', 'Invisalign Aligners', 'Teeth Whitening', 'Root Canal Therapy', 'Pediatric Dentistry'].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleNav('services')}
                    onMouseEnter={() => soundFX.playHover()}
                    className="hover:text-[#38BDF8] text-left transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Location & Direct Contact */}
          <div>
            <h4 className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider mb-4 font-bold">Contact & Location</h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                <span>2408 Rabbit Hill Rd NW, Edmonton, AB</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>780-430-1336</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>info@HomeOfSmiles.ca</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Open 7 Days a Week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div>
            © 2026 HOME OF SMILES DENTAL. ALL RIGHTS RESERVED. ALBERTA DENTAL FEE GUIDE COMPLIANT.
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => handleNav('about')} className="hover:text-slate-200 transition-colors">PRIVACY POLICY</button>
            <button onClick={() => handleNav('about')} className="hover:text-slate-200 transition-colors">TERMS OF CLINICAL CARE</button>
            <button
              onClick={scrollToTop}
              className="text-[#38BDF8] flex items-center gap-1 hover:underline font-bold"
            >
              BACK TO TOP <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
