import React from 'react';
import { Sparkles, Scan, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const TreatmentTimeline: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Damaged Jaw Assessment',
      icon: <Sparkles className="w-5 h-5 text-[#0284C7]" />,
      desc: 'Comprehensive diagnostic evaluation of cavities, enamel erosion, crooked alignment, and inflamed gums.',
    },
    {
      step: '02',
      title: 'Digital 3D X-Ray & Root Mapping',
      icon: <Scan className="w-5 h-5 text-[#00A3FF]" />,
      desc: 'Sub-surface holographic CBCT scans reveal root pathways, bone density, and hidden decay with low radiation.',
    },
    {
      step: '03',
      title: 'Orthodontic & Laser Care',
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      desc: 'Painless laser sterilization, micro-decay removal, and custom archwire/Invisalign teeth alignment.',
    },
    {
      step: '04',
      title: 'Healthy Radiant Smile',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      desc: 'VITA BL1 porcelain enamel polish, healthy pink gums, and a radiant, confident 360° smile transformation.',
    },
  ];

  return (
    <section id="journey-section" className="relative py-28 px-6 bg-white border-t border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0284C7]/10 border border-[#0284C7]/20 text-[#0284C7] text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STEP-BY-STEP TRANSFORMATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Your 4-Stage Treatment Journey
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mt-4 font-normal">
            Follow the complete clinical progression from initial diagnostics to your final healthy, confident smile.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, idx) => (
            <div
              key={idx}
              onMouseEnter={() => soundFX.playHover()}
              className="glass-card rounded-3xl p-6 border border-slate-200/80 hover:border-[#0284C7]/40 flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0284C7]/10 border border-[#0284C7]/20 flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0284C7] bg-[#0284C7]/10 px-2.5 py-0.5 rounded-full">
                    STAGE {s.step}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 group-hover:text-[#0284C7] transition-colors">
                  {s.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {s.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-[#0284C7] pt-4 mt-2 border-t border-slate-100">
                  <span>NEXT STAGE</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
