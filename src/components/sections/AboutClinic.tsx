import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Sparkles, Award, CheckCircle2 } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const AboutClinic: React.FC = () => {
  const stats = [
    { value: '15,000+', label: 'Smiles Restored', icon: <Sparkles className="w-4 h-4 text-[#4FC3F7]" /> },
    { value: '99.8%', label: 'Precision Accuracy', icon: <Cpu className="w-4 h-4 text-[#00E5FF]" /> },
    { value: '25+', label: 'Global Awards', icon: <Award className="w-4 h-4 text-yellow-400" /> },
    { value: '100%', label: 'Painless Laser Tech', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
  ];

  return (
    <section id="about-clinic" className="relative py-28 px-6 bg-[#05070A] overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#4FC3F7]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-[#00E5FF]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header Badge */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="glass-panel px-4 py-1.5 rounded-full text-xs font-mono text-[#4FC3F7] tracking-widest uppercase mb-4 border border-[#4FC3F7]/30 shadow-[0_0_15px_rgba(79,195,247,0.15)]">
            ABOUT SMILE DENTAL GROUPS
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl leading-tight">
            Where High-Tech Robotics Meets Architectural Dentistry
          </h2>
        </div>

        {/* Split Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Showcase Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-2 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200"
                alt="Smile Dental Groups Futuristic Clinic Interior"
                className="w-full h-[450px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-transparent to-transparent opacity-80" />

              {/* Floating Holographic Badge */}
              <div className="absolute bottom-6 left-6 right-6 glass-panel-glow p-5 rounded-2xl border border-[#4FC3F7]/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#4FC3F7]/20 border border-[#4FC3F7]/50 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-[#4FC3F7]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Next-Gen Medical Facility
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      Equipped with 3D Holographic CT Scanners & Laser Surgery Suits
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Philosophy & Specs */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Redefining the Gold Standard of Patient Care
              </h3>
              <p className="text-slate-300 leading-relaxed font-normal mb-6">
                At Smile Dental Groups, we view dental restoration as a fusion of biological architecture and high-precision robotics. Using ultra-resolution 3D volumetric scanning and AI-driven smile simulation, every crown, veneer, and implant is crafted to sub-micron accuracy.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3">
              {[
                'Sub-Micron Laser Sterilization & Zero Cavity Recurrence',
                'Bio-Compatible Zirconia & German Engineered Ceramic Enamel',
                'AI Smile Simulation matching facial golden ratio proportions',
                '100% Painless Sedation Dentistry & Accelerated Recovery',
              ].map((feat, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => soundFX.playHover()}
                  className="glass-card p-3.5 rounded-xl flex items-center gap-3 hover:border-[#4FC3F7]/40"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#4FC3F7] shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-slate-200">{feat}</span>
                </div>
              ))}
            </div>

            {/* Live Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
              {stats.map((st, i) => (
                <div
                  key={i}
                  onMouseEnter={() => soundFX.playHover()}
                  className="glass-panel p-4 rounded-2xl border border-white/5 text-center group hover:border-[#4FC3F7]/40 transition-colors"
                >
                  <div className="flex justify-center mb-2">{st.icon}</div>
                  <div className="text-xl sm:text-2xl font-extrabold font-mono text-white group-hover:text-[#4FC3F7] transition-colors">
                    {st.value}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-1">
                    {st.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
