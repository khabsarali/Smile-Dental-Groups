import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Victoria Sterling',
      role: 'Executive Director, Manhattan',
      treatment: '3D Porcelain Veneers',
      rating: 5,
      comment:
        'The 3D diagnostic simulation was mind-blowing! I was terrified of dental procedures, but Dr. Vance and the robotic laser team made the entire veneer process completely painless.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    },
    {
      name: 'Jonathan Reynolds',
      role: 'Tech Founder, San Francisco',
      treatment: 'Robotic Dental Implants',
      rating: 5,
      comment:
        'I had two missing molars for years. The 3D guided implant placement was completed in under an hour, and I felt zero pain the next day. Truly an Awwwards-level medical experience!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    },
    {
      name: 'Elena Rostova',
      role: 'Architect & Designer, Zurich',
      treatment: 'Laser Whitening & Alignment',
      rating: 5,
      comment:
        'As an architect, I pay attention to structure and light. The optical translucency of their porcelain work is unmatched. My smile looks radiant yet completely natural.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    },
    {
      name: 'Dr. Christopher Blake',
      role: 'Orthopedic Surgeon, Boston',
      treatment: 'Microscopic Root Canal',
      rating: 5,
      comment:
        'Being a surgeon myself, my standards for sterile clinical technique are high. The microscopic laser disinfection protocol here is decades ahead of standard clinics.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    },
  ];

  return (
    <section id="testimonials-section" className="relative py-28 px-6 bg-[#05070A] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="glass-panel px-4 py-1.5 rounded-full text-xs font-mono text-[#4FC3F7] tracking-widest uppercase mb-4 border border-[#4FC3F7]/30 shadow-[0_0_15px_rgba(79,195,247,0.15)]">
            PATIENT VERDICT
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl leading-tight mb-4">
            Patient Smile Testimonials
          </h2>
          <p className="text-slate-400 max-w-xl text-sm sm:text-base font-normal">
            Real stories from patients who experienced our architectural dental transformations.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onMouseEnter={() => soundFX.playHover()}
              className="glass-panel p-8 rounded-3xl border border-white/10 relative flex flex-col justify-between hover:border-[#4FC3F7]/40 transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-white/5 pointer-events-none" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-xs font-mono text-[#00E5FF] font-bold">5.0 PERFECT</span>
                </div>

                {/* Comment */}
                <p className="text-slate-300 text-sm leading-relaxed font-normal mb-8 italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Patient Info */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#4FC3F7]/40"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {rev.name}
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400 block">{rev.role}</span>
                  </div>
                </div>

                <span className="glass-panel px-3 py-1 rounded-full text-[10px] font-mono text-[#4FC3F7] border border-[#4FC3F7]/20">
                  {rev.treatment}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
