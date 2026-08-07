import React from 'react';
import { Award, ShieldCheck, Cpu, Sparkles, Star, Users, Clock } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const AboutClinic: React.FC = () => {
  const highlights = [
    {
      icon: <Award className="w-6 h-6 text-[#00A3FF]" />,
      title: 'AACD Accredited Masters',
      desc: 'Top 1% cosmetic dental surgeons recognized by the American Academy of Cosmetic Dentistry for surgical precision.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-emerald-400" />,
      title: 'Digital Robotics & CAD/CAM',
      desc: 'Sub-micron 3D intraoral scanning and German 5-axis ceramic milling for exact, same-day porcelain restorations.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
      title: 'Biological & Pain-Free Protocol',
      desc: 'Gentle Er:YAG laser sterilization, biocompatible ceramic implants, and conscious twilight sedation comfort.',
    },
  ];

  const stats = [
    { val: '14,800+', label: 'Smiles Transformed' },
    { val: '99.8%', label: 'Clinical Success Rate' },
    { val: '25+ Yrs', label: 'Prosthodontic Mastery' },
    { val: '5.0 ★', label: 'Google Verified Rating' },
  ];

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0284C7]/15 border border-[#0284C7]/30 text-[#38BDF8] text-xs font-mono font-bold tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ARCHITECTURAL COSMETIC DENTISTRY</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Where Biomimetic Science Meets Artistry
        </h2>
        <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
          Home of Smiles delivers world-class smile makeovers, porcelain veneer design, and complete full-mouth rehabilitation inside a serene, private luxury penthouse clinic.
        </p>
      </div>

      {/* 3 Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {highlights.map((h, i) => (
          <div
            key={i}
            onMouseEnter={() => soundFX.playHover()}
            className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200/80 hover:border-[#0284C7]/40 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {h.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#0284C7] transition-colors">
              {h.title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
              {h.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Numerical Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-slate-200/60">
        {stats.map((st, i) => (
          <div key={i} className="text-center p-4">
            <span className="text-3xl sm:text-4xl font-black font-mono text-[#0284C7] block mb-1">
              {st.val}
            </span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {st.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
