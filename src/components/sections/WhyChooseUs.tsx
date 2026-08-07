import React from 'react';
import { Cpu, ShieldCheck, Sparkles, Clock, Award, Star, HeartHandshake, Smile } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const WhyChooseUs: React.FC = () => {
  const advantages = [
    {
      icon: <Sparkles className="w-6 h-6 text-[#0284C7]" />,
      title: 'Wide Range of Dental Services',
      desc: 'From routine family cleanings and pediatric visits to complex 3D dental implants and porcelain veneers, all under one roof.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-[#00A3FF]" />,
      title: 'Modern Technology',
      desc: 'Low-radiation 3D CBCT imaging, iTero digital impressions, and gentle laser treatments for maximum clinical accuracy.',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-emerald-500" />,
      title: 'Personalized Dental Care',
      desc: 'Tailored treatment plans that respect your individual smile goals, schedule, comfort preferences, and budget.',
    },
    {
      icon: <Award className="w-6 h-6 text-[#0284C7]" />,
      title: 'Alberta Dental Fee Guide',
      desc: 'We follow the current Alberta Dental Association Fee Guide to ensure transparent, fair, and accessible pricing for all patients.',
    },
    {
      icon: <Smile className="w-6 h-6 text-[#00A3FF]" />,
      title: 'Patient Focused Dentistry',
      desc: 'Warm hospitality, gentle touch, relaxing climate-controlled suites, and sedation options for anxious patients.',
    },
    {
      icon: <Star className="w-6 h-6 text-amber-500" />,
      title: '5-Star Google Reviews',
      desc: 'Over 320+ verified 5-star patient reviews praising our compassionate team, painless procedures, and beautiful smile results.',
    },
  ];

  return (
    <section id="why-choose-us" className="relative py-28 px-6 bg-white border-t border-slate-200/80 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0284C7]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-mono text-[#0284C7] uppercase tracking-widest font-bold mb-3">
            THE HOME OF SMILES ADVANTAGE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Why Choose <span className="text-gradient-cyan">Home of Smiles</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mt-4 font-normal">
            Modern Edmonton dentistry centered around honesty, gentle techniques, and exceptional patient care.
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((item, idx) => (
            <div
              key={idx}
              onMouseEnter={() => soundFX.playHover()}
              className="glass-card p-8 rounded-3xl border border-slate-200/80 hover:border-[#0284C7]/40 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#0284C7]/10 border border-[#0284C7]/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#0284C7]/20 transition-all duration-300">
                {item.icon}
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#0284C7] transition-colors">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
