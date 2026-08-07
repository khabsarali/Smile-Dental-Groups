import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scan, Cpu, Zap, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const TreatmentTimeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      num: 1,
      title: 'AI 3D Diagnosis',
      badge: 'SCENE 01',
      icon: <Scan className="w-5 h-5 text-[#0284C7]" />,
      desc: 'High-speed intraoral 4K laser scanning maps every tooth surface, root pathway, and micro-fracture without uncomfortable putty impressions.',
      details: ['0.01mm Scan Precision', 'No Messy Mold Impressions', 'Instant 3D Interactive Model'],
    },
    {
      num: 2,
      title: 'Holographic X-Ray',
      badge: 'SCENE 02',
      icon: <Cpu className="w-5 h-5 text-[#00A3FF]" />,
      desc: 'Transparent X-ray volumetric rendering evaluates bone density, root canal paths, and nerve telemetry for optimal surgical planning.',
      details: ['Zero Radiation Exposure', 'Bone Density Telemetry', 'Nerve Map Safety Protocol'],
    },
    {
      num: 3,
      title: 'Robotic Laser Care',
      badge: 'SCENE 03',
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      desc: 'Painless sub-micron laser surgery removes cavities, sterilizes bacterial plaque, and shapes enamel with robotic precision.',
      details: ['10.6 µm Cold Laser', 'Painless Sedation Option', 'Zero Heat Enamel Protection'],
    },
    {
      num: 4,
      title: 'Porcelain Restoration',
      badge: 'SCENE 04',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      desc: 'Custom engineered VITA BL1 porcelain veneers or crowns are permanently bonded with flawless light reflection properties.',
      details: ['German Zirconia Ceramic', 'Natural Translucency', 'Stain & Chip Proof Shield'],
    },
    {
      num: 5,
      title: 'Smile Integration',
      badge: 'SCENE 05',
      icon: <Sparkles className="w-5 h-5 text-[#0284C7]" />,
      desc: 'The restored bite aligns naturally into your jaw and facial golden ratio proportions, delivering a lifetime of confident smiling.',
      details: ['Bite Occlusion Check', 'Full Lifetime Warranty', 'Annual Polishing Care'],
    },
  ];

  return (
    <section id="timeline-section" className="relative py-28 px-6 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="glass-panel px-4 py-1.5 rounded-full text-xs font-mono font-bold text-[#0284C7] tracking-widest uppercase mb-4 border border-[#0284C7]/30 shadow-sm">
            PATIENT JOURNEY
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl leading-tight mb-4">
            Interactive Treatment Roadmap
          </h2>
          <p className="text-slate-600 max-w-xl text-sm sm:text-base font-normal">
            Click on any phase to explore how our 5-scene clinical process transforms your smile.
          </p>
        </div>

        {/* Timeline Node Buttons Bar */}
        <div className="relative mb-12">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 rounded-full -z-0 hidden md:block">
            <div
              className="h-full bg-gradient-to-r from-[#0284C7] to-[#00A3FF] transition-all duration-500 shadow-[0_0_12px_#0284C7]"
              style={{ width: `${((activeStep - 1) / 4) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
            {steps.map((st) => {
              const isActive = activeStep === st.num;
              return (
                <button
                  key={st.num}
                  onClick={() => {
                    soundFX.playClick();
                    setActiveStep(st.num);
                  }}
                  onMouseEnter={() => soundFX.playHover()}
                  className={`glass-panel p-4 rounded-2xl flex flex-col items-center text-center transition-all duration-300 border ${
                    isActive
                      ? 'border-[#0284C7] bg-white shadow-xl scale-105'
                      : 'border-slate-200 hover:border-[#0284C7]/40 shadow-sm'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-colors ${
                      isActive ? 'bg-[#0284C7]/15 text-[#0284C7]' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {st.icon}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase mb-1 font-semibold">
                    {st.badge}
                  </span>
                  <span className={`text-xs font-bold ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                    {st.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Phase Detailed Glass Card */}
        {steps.map(
          (st) =>
            st.num === activeStep && (
              <motion.div
                key={st.num}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="glass-panel-glow p-8 rounded-3xl border border-[#0284C7]/30 max-w-3xl mx-auto shadow-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#0284C7]/15 text-[#0284C7] font-mono text-xs font-bold border border-[#0284C7]/30">
                    STEP {st.num} OF 5
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900">{st.title}</h3>
                </div>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                  {st.desc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200">
                  {st.details.map((dt, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                      <span>{dt}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
        )}
      </div>
    </section>
  );
};
