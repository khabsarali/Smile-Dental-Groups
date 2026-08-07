import React from 'react';
import { ShieldCheck, Heart, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const AboutClinic: React.FC = () => {
  const values = [
    {
      title: 'Alberta Dental Fee Guide',
      desc: 'We strictly follow the current Alberta Dental Association Fee Guide to keep premier dental care transparent, accessible, and affordable for all Edmonton families.',
    },
    {
      title: 'Digital & Laser Innovation',
      desc: 'Equipped with low-radiation 3D CBCT scanners, intraoral digital impressions, and painless dental lasers to make every appointment comfortable.',
    },
    {
      title: 'Patient-First Comfort',
      desc: 'Climate-controlled suites, ceiling monitors, noise-cancelling headphones, and personalized sedation options for complete peace of mind.',
    },
    {
      title: 'Communities We Serve',
      desc: 'Proudly welcoming patients from Terwillegar, Windermere, Riverbend, Southgate, Mactaggart, Ambleside, and greater Southwest Edmonton.',
    },
  ];

  return (
    <section id="about-clinic" className="relative py-28 px-6 bg-[#F8FAFC] overflow-hidden border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0284C7]/10 border border-[#0284C7]/20 text-[#0284C7] text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TERWILLEGAR PATIENT CARE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            About Home of Smiles Dental
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mt-4 font-normal">
            A state-of-the-art dental sanctuary in Southwest Edmonton designed around patient comfort, clinical precision, and long-term oral wellness.
          </p>
        </div>

        {/* 4 Values Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {values.map((v, idx) => (
            <div
              key={idx}
              onMouseEnter={() => soundFX.playHover()}
              className="glass-card rounded-3xl p-8 border border-slate-200/80 hover:border-[#0284C7]/40 transition-all group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#0284C7]/10 flex items-center justify-center text-[#0284C7] font-bold">
                  0{idx + 1}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                  {v.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {v.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Banner Card */}
        <div className="glass-panel-glow p-8 rounded-3xl border border-[#0284C7]/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-xl font-bold text-slate-900">Direct Insurance Billing & Flexible Financing</h4>
            <p className="text-xs sm:text-sm text-slate-600">
              We bill directly to most major Canadian dental insurance plans and provide zero-interest payment installments.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono font-bold text-[#0284C7] bg-[#0284C7]/10 px-4 py-2 rounded-full">
              📍 2408 Rabbit Hill Rd NW
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
