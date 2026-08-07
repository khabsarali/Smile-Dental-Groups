import React from 'react';
import { Star, CheckCircle2, Quote, Sparkles } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      name: 'Jessica Reynolds',
      location: 'Terwillegar Towne, Edmonton',
      treatment: '3D Porcelain Veneers & Whitening',
      rating: 5,
      date: '2 weeks ago',
      quote:
        'Home of Smiles completely changed my perspective on dentistry. The 3D digital smile design showed me exactly what my veneers would look like before we even started. Absolutely pain-free and stunning results!',
    },
    {
      name: 'Marcus Sterling',
      location: 'Windermere, Edmonton',
      treatment: 'Robotic Dental Implants',
      rating: 5,
      date: '1 month ago',
      quote:
        'Dr. Vance and the team are exceptional. The robotic guided implant procedure was fast, and I felt zero pain during recovery. Having a practice in Terwillegar following the Alberta Fee Guide is a huge plus.',
    },
    {
      name: 'Amanda Chen',
      location: 'Southgate, Edmonton',
      treatment: 'Emergency Root Canal & Ceramic Crown',
      rating: 5,
      date: '3 weeks ago',
      quote:
        'I had a severe toothache on a Sunday, and their emergency line answered immediately. They got me in within an hour and relieved my pain with laser precision. Forever grateful for this clinic!',
    },
    {
      name: 'David MacLeod',
      location: 'Riverbend, Edmonton',
      treatment: 'Family Cleaning & Kids Checkup',
      rating: 5,
      date: 'Recent Visit',
      quote:
        'Took both my young kids for their biannual cleanings. The hygienists were so kind, gentle, and patient. The kids loved the experience. Highly recommend to all Edmonton families!',
    },
  ];

  return (
    <section id="reviews-section" className="relative py-28 px-6 bg-white border-t border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0284C7]/10 border border-[#0284C7]/20 text-[#0284C7] text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VERIFIED PATIENT EXPERIENCES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            5-Star Google Reviews
          </h2>
          <div className="flex items-center gap-2 mt-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-900">4.9 / 5.0 Rating</span>
            <span className="text-xs text-slate-500 font-mono">• 320+ Verified Edmonton Reviews</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              onMouseEnter={() => soundFX.playHover()}
              className="glass-card rounded-3xl p-8 border border-slate-200/90 hover:border-[#0284C7]/40 flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-slate-400">{rev.date}</span>
                </div>

                <Quote className="w-8 h-8 text-[#0284C7]/20 mb-2" />

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal mb-6 italic">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{rev.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">{rev.location}</span>
                </div>

                <span className="text-[11px] font-mono font-bold text-[#0284C7] bg-[#0284C7]/10 px-2.5 py-1 rounded-full">
                  {rev.treatment}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
