import React from 'react';
import { motion } from 'framer-motion';
import { Award, GraduationCap, FileCheck, CheckCircle2, ShieldCheck } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const MeetDentist: React.FC = () => {
  const credentials = [
    { label: 'DOCTOR OF DENTAL MEDICINE', desc: 'Harvard School of Dental Medicine' },
    { label: 'PH.D. IN BIO-ROBOTICS', desc: 'MIT Health Sciences & Technology' },
    { label: 'BOARD CERTIFIED PROSTHODONTIST', desc: 'American Board of Prosthodontics' },
    { label: 'SURGICAL EXPERIENCE', desc: '20+ Years Clinical Mastery (15,000+ Cases)' },
  ];

  return (
    <section id="doctor-section" className="relative py-28 px-6 bg-[#05070A] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="glass-panel px-4 py-1.5 rounded-full text-xs font-mono text-[#4FC3F7] tracking-widest uppercase mb-4 border border-[#4FC3F7]/30 shadow-[0_0_15px_rgba(79,195,247,0.15)]">
            CLINICAL LEADERSHIP
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl leading-tight mb-4">
            Meet Our Chief Cosmetic Surgeon
          </h2>
          <p className="text-slate-400 max-w-xl text-sm sm:text-base font-normal">
            Pioneering the synthesis of bio-robotics, laser dentistry, and architectural smile design.
          </p>
        </div>

        {/* Doctor Profile Split Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Doctor Portrait Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden glass-panel border border-[#4FC3F7]/30 p-2 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1000"
                alt="Dr. Marcus Vance - Chief Dental Surgeon"
                className="w-full h-[520px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-transparent to-transparent opacity-80" />

              {/* Floating Verified Badge */}
              <div className="absolute top-6 right-6 glass-panel-glow px-4 py-2 rounded-full text-xs font-mono text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 shadow-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> BOARD CERTIFIED LEAD
              </div>

              <div className="absolute bottom-6 left-6 right-6 glass-panel p-5 rounded-2xl border border-white/10">
                <h3 className="text-xl font-extrabold text-white">Dr. Marcus Vance, DMD, Ph.D.</h3>
                <p className="text-xs font-mono text-[#4FC3F7] tracking-wider uppercase mt-0.5">
                  Founder & Chief Prosthodontist
                </p>
              </div>
            </div>
          </motion.div>

          {/* Bio & Academic Credentials */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-8"
          >
            <div>
              <span className="text-xs font-mono text-[#00E5FF] uppercase tracking-widest block mb-2">
                SURGICAL PHILOSOPHY
              </span>
              <blockquote className="text-xl font-serif italic text-slate-200 border-l-2 border-[#4FC3F7] pl-4 mb-6 leading-relaxed">
                "A smile is not merely a set of teeth; it is a structural masterpiece. My mission is to merge medical precision with natural aesthetic harmony so every patient walks out with lifelong confidence."
              </blockquote>
              <p className="text-slate-300 text-sm leading-relaxed">
                Dr. Vance completed his dental doctorate at Harvard Dental School followed by advanced surgical fellowship in robotic prosthodontics at MIT. With over two decades of clinical practice and 150+ published peer-reviewed studies, he leads our multidisciplinary team of specialists.
              </p>
            </div>

            {/* Academic & Professional Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {credentials.map((cred, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => soundFX.playHover()}
                  className="glass-card p-4 rounded-2xl border border-white/10 hover:border-[#4FC3F7]/40 transition-colors"
                >
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#4FC3F7] uppercase tracking-wider mb-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {cred.label}
                  </div>
                  <div className="text-xs font-bold text-white">{cred.desc}</div>
                </div>
              ))}
            </div>

            {/* Accreditations Badges */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-6 text-slate-400 font-mono text-xs">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-yellow-400" /> Top Surgeon Award 2025
              </span>
              <span className="flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[#00E5FF]" /> 150+ Research Publications
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ADA & AAED Fellow
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
