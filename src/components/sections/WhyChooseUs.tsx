import React from 'react';
import { Sparkles, Cpu, ShieldCheck, Zap, HeartHandshake, Eye, Clock } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: <Cpu className="w-5 h-5 text-[#00A3FF]" />,
      title: 'Micro-Robotic Dentistry',
      desc: 'Sub-millimeter 3D surgical guides and laser enamel preparation eliminate trauma and accelerate tissue healing.',
    },
    {
      icon: <Eye className="w-5 h-5 text-emerald-500" />,
      title: 'Digital Smile Simulation',
      desc: 'Preview your exact 3D smile harmony, tooth length, and shade prior to any physical preparation.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-purple-500" />,
      title: 'Lifetime Porcelain Guarantee',
      desc: 'Every handcrafted ceramic veneer and zirconia implant crown is backed by an unconditional clinical warranty.',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-rose-500" />,
      title: 'Private Penthouse Suites',
      desc: 'Enjoy one-on-one concierge care, noise-canceling headphones, and soothing aromatherapy throughout your visit.',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0284C7]/15 border border-[#0284C7]/30 text-[#38BDF8] text-xs font-mono font-bold tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PRECISION CLINICAL ADVANTAGES</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Why Discerning Patients Choose Us
        </h2>
        <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
          We reject assembly-line dentistry in favor of bespoke, artisanal smile transformations powered by cutting-edge medical robotics.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((p, i) => (
          <div
            key={i}
            onMouseEnter={() => soundFX.playHover()}
            className="p-6 rounded-3xl bg-slate-50/90 border border-slate-200 hover:border-[#0284C7]/40 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {p.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#0284C7] transition-colors">
                {p.title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                {p.desc}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-mono text-[#0284C7] font-semibold">
              <span>Standard of Care</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
