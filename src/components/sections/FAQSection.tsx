import React, { useState } from 'react';
import { Sparkles, ChevronDown, HelpCircle } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Will my porcelain veneers look natural or overly artificial?',
      a: 'We specialize in biomimetic ceramic dentistry using VITA BL1 lithium disilicate porcelain. Each veneer is hand-layered with natural micro-translucency, subtle surface texture, and optical depth that mirrors youthful natural enamel.',
    },
    {
      q: 'Is the dental transformation process truly pain-free?',
      a: 'Yes. We employ painless Er:YAG laser sterilization, computerized local anesthesia, and optional twilight sedation. Our patients consistently report zero discomfort during and after appointments.',
    },
    {
      q: 'How long do full-mouth dental implants and veneers last?',
      a: 'With proper oral hygiene, our handcrafted porcelain veneers and biocompatible zirconia implants typically last 15 to 25+ years, backed by our comprehensive clinical warranty.',
    },
    {
      q: 'Can I preview my final smile before any irreversible work begins?',
      a: 'Absolutely. We utilize digital 3D intraoral scans and physical cosmetic mock-ups that you wear temporarily. You approve every contour, shade, and tooth length before final porcelain fabrication.',
    },
  ];

  const toggle = (i: number) => {
    soundFX.playClick();
    setOpenIdx(openIdx === i ? null : i);
  };

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0284C7]/15 border border-[#0284C7]/30 text-[#38BDF8] text-xs font-mono font-bold tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FREQUENT PATIENT INQUIRIES</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Everything You Need to Know
        </h2>
        <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
          Transparent answers regarding procedure timelines, painlessness, veneer longevity, and cosmetic design protocols.
        </p>
      </div>

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-slate-50/90 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggle(i)}
                onMouseEnter={() => soundFX.playHover()}
                className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="text-base sm:text-lg font-bold text-slate-900">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#0284C7] shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal border-t border-slate-200/60 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
