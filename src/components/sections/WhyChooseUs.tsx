import React from 'react';
import { Cpu, ShieldCheck, Sparkles, Clock, Award, HeartHandshake } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const WhyChooseUs: React.FC = () => {
  const advantages = [
    {
      icon: <Cpu className="w-6 h-6 text-[#0284C7]" />,
      title: 'Robotic Sub-Micron Accuracy',
      desc: 'Computer-guided 3D robotic surgical arms ensure implant placement within 0.01mm of clinical precision.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#00A3FF]" />,
      title: 'Painless Laser Sterilization',
      desc: 'Advanced dental lasers eliminate bacteria and decay with zero vibration, minimal noise, and faster healing.',
    },
    {
      icon: <Award className="w-6 h-6 text-[#0284C7]" />,
      title: 'VITA BL1 Porcelain Artistry',
      desc: 'Master dental ceramists hand-craft multi-layered porcelain veneers designed specifically for your facial geometry.',
    },
    {
      icon: <Clock className="w-6 h-6 text-emerald-500" />,
      title: '24/7 Emergency Concierge',
      desc: 'Direct line access to emergency dental specialists in Midtown Manhattan with same-day priority appointments.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#0284C7]" />,
      title: 'Lifetime Surgical Warranty',
      desc: 'All structural implant posts and porcelain crowns are backed by our comprehensive lifetime warranty guarantee.',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-[#00A3FF]" />,
      title: 'Concierge Sedation Care',
      desc: 'Relaxing IV sedation, climate-controlled suites, and personalized comfort amenities tailored for anxious patients.',
    },
  ];

  return (
    <section id="why-choose-us" className="relative py-28 px-6 bg-[#F8FAFC]/80 backdrop-blur-xl border-t border-slate-200/60 overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0284C7]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-mono text-[#0284C7] uppercase tracking-widest font-bold mb-3">
            THE ARCHITECTURAL DIFFERENCE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Why Choose <span className="text-gradient-cyan">Smile Dental Groups</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mt-4 font-normal">
            Combining Harvard DMD clinical leadership with bio-robotic technology and five-star Manhattan luxury care.
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
