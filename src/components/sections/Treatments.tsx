import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Zap, Scan, ArrowRight, CheckCircle2 } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const Treatments: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const services = [
    {
      id: 'veneers',
      title: 'Porcelain Veneers & Laminates',
      subtitle: 'VITA BL1 Ultra-Thin Ceramic',
      desc: 'Handcrafted wafer-thin lithium disilicate porcelain veneers correcting severe enamel discoloration, micro-fractures, and gaps with natural translucency.',
      benefits: ['0.3mm ultra-conservative prep', '100% stain-resistant glaze', 'Hand-layered 3D depth', 'Lifetime ceramic guarantee'],
      stat: '10-20+ Year Longevity',
    },
    {
      id: 'implants',
      title: 'Full-Arch Dental Implants',
      subtitle: 'All-on-4 / All-on-6 Zirconia',
      desc: 'Permanent titanium and biocompatible ceramic root replacements integrated into bone with 3D surgical navigation for instant chew function.',
      benefits: ['Immediate same-day loading', 'High-density Osseo-integration', 'Prevents bone resorption', 'Natural tooth aesthetic'],
      stat: '99.4% Integration Success',
    },
    {
      id: 'aligners',
      title: 'Invisible Orthodontic Aligners',
      subtitle: 'Clear Custom Archwire Guidance',
      desc: 'SmartTrack clear aligners discretely straightening crooked teeth, open bites, and crowded dental arches without metallic brackets.',
      benefits: ['Virtually undetectable', 'Removable for dining', 'Digital 3D weekly monitoring', '50% faster than traditional braces'],
      stat: '6-12 Month Completion',
    },
    {
      id: 'whitening',
      title: 'Laser Teeth Whitening',
      subtitle: 'Philips Zoom & Er:YAG Laser',
      desc: 'In-office light-accelerated hydrogen peroxide gel treatment lifting years of coffee, tobacco, and age-related stains in one 45-minute session.',
      benefits: ['Up to 8 shades brighter', 'Zero enamel dehydration', 'Desensitizing fluoride seal', 'Immediate radiant luster'],
      stat: '45-Minute Session',
    },
    {
      id: 'rootcanal',
      title: 'Microscopic Endodontics',
      subtitle: '3D Root Canal Disinfection',
      desc: 'High-magnification surgical microscope therapy removing deep pulp infections and sealing nerve canals painlessly in a single visit.',
      benefits: ['Zeiss 25x optical magnification', 'Gentle ultrasonic irrigation', 'Saves the natural tooth', '100% pain-free protocol'],
      stat: 'Single Visit Comfort',
    },
    {
      id: 'rehab',
      title: 'Full Mouth Rehabilitation',
      subtitle: 'Neuromuscular Bite Rebuilding',
      desc: 'Comprehensive reconstruction of worn, broken, or misaligned dentition restoring golden ratio proportions and pain-free TMJ alignment.',
      benefits: ['Complete aesthetic transformation', 'Balanced joint occlusion', 'Restores facial height', 'Custom digital smile design'],
      stat: 'Comprehensive Transformation',
    },
  ];

  const current = services[selectedIdx];

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0284C7]/15 border border-[#0284C7]/30 text-[#38BDF8] text-xs font-mono font-bold tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SPECIALIZED CLINICAL PROCEDURES</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Comprehensive Dental Mastery
        </h2>
        <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
          From subtle porcelain enhancements to complete surgical restorations, discover precision treatments engineered for a lifetime of confidence.
        </p>
      </div>

      {/* Interactive Tabs + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Services Selector List */}
        <div className="lg:col-span-5 space-y-2">
          {services.map((s, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <div
                key={s.id}
                onClick={() => {
                  soundFX.playClick();
                  setSelectedIdx(idx);
                }}
                onMouseEnter={() => soundFX.playHover()}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-[1.02]'
                    : 'bg-slate-50/80 text-slate-700 border-slate-200/80 hover:bg-slate-100/80'
                }`}
              >
                <div>
                  <h3 className="text-base font-bold">{s.title}</h3>
                  <span className={`text-xs font-mono block mt-0.5 ${isSelected ? 'text-[#38BDF8]' : 'text-slate-500'}`}>
                    {s.subtitle}
                  </span>
                </div>
                <ArrowRight className={`w-5 h-5 transition-transform ${isSelected ? 'translate-x-1 text-[#38BDF8]' : 'text-slate-400'}`} />
              </div>
            );
          })}
        </div>

        {/* Right Active Specification Panel */}
        <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-slate-50/90 border border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-mono text-[#0284C7] uppercase font-bold tracking-wider block">
                {current.subtitle}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {current.title}
              </h3>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-[#0284C7]/15 text-[#0284C7] font-mono text-xs font-bold">
              {current.stat}
            </span>
          </div>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            {current.desc}
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {current.benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
