import React from 'react';
import { Sparkles, Star, Quote, CheckCircle2 } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      author: 'Victoria Sterling',
      role: 'Fashion Director, New York',
      review: 'I had severe crooked lower alignment and old composite fillings. Dr. Vance transformed my teeth with 10 upper porcelain veneers. The 3D animation showed me the exact result beforehand and the real outcome exceeded my highest expectations.',
      rating: 5,
      treatment: '10 Porcelain Veneers (VITA BL1)',
    },
    {
      author: 'Julian Thorne',
      role: 'Architect & Designer',
      review: 'Completely painless dental surgery. I needed full-arch ceramic implants and was terrified of pain. Their twilight sedation protocol and laser technology made the entire appointment seamless. My bite feels 100% natural.',
      rating: 5,
      treatment: 'Full-Arch Zirconia Implants',
    },
    {
      author: 'Sophia Chen',
      role: 'Venture Partner',
      review: 'The clinic feels like a 5-star Swiss resort rather than a hospital. My clear aligner treatment was finished 4 months ahead of schedule and my smile harmony is perfection. Truly the gold standard.',
      rating: 5,
      treatment: 'SmartTrack Orthodontics',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0284C7]/15 border border-[#0284C7]/30 text-[#38BDF8] text-xs font-mono font-bold tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>VERIFIED GOOGLE & TRUSTPILOT PRAISE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Life-Changing Patient Stories
        </h2>
        <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
          Read genuine reviews from executives, artists, and patients who trusted Home of Smiles for their dental transformations.
        </p>
      </div>

      {/* 3 Testimonial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((r, i) => (
          <div
            key={i}
            onMouseEnter={() => soundFX.playHover()}
            className="p-8 rounded-3xl bg-slate-50/90 border border-slate-200 hover:border-[#0284C7]/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(r.rating)].map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <p className="text-slate-700 text-sm leading-relaxed italic font-normal">
                "{r.review}"
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{r.author}</h3>
                <span className="text-[11px] text-slate-500 font-mono block">{r.role}</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#0284C7] bg-[#0284C7]/10 px-2 py-1 rounded-md">
                {r.treatment}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
