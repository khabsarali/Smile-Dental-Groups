import React from 'react';
import { Sparkles, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-950 text-white pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Col 1: Brand Info */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#00A3FF] flex items-center justify-center shadow-lg shadow-[#0284C7]/30 border border-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block">
                Home of Smiles
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#38BDF8] uppercase block">
                Luxury Aesthetic Dentistry
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            World-class cosmetic surgery, biological smile design, and painless full-arch restorations in New York.
          </p>
        </div>

        {/* Col 2: Treatments */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
            Procedures
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('services')}>Porcelain Veneers</li>
            <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('services')}>Full-Arch Implants</li>
            <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('services')}>Clear Aligners</li>
            <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('services')}>Laser Whitening</li>
          </ul>
        </div>

        {/* Col 3: Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
            Navigation
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('hero-section')}>3D Cinematic Journey</li>
            <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('about')}>About Studio</li>
            <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('team')}>Specialists</li>
            <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('gallery')}>Before & After</li>
          </ul>
        </div>

        {/* Col 4: Accreditation */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
            Accreditation
          </h4>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>AACD Accredited Fellow</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ICOI Master Implantologist</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ADA Certified Facility</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <span>© {new Date().getFullYear()} Home of Smiles Groups. All Rights Reserved.</span>
        <span className="font-mono text-[11px]">Precision 3D Dental Experience</span>
      </div>
    </footer>
  );
};
