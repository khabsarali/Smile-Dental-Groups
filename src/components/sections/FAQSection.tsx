import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'Are robotic dental implants painful?',
      answer:
        'No. Robotic guided surgery utilizes computer-planned micro-incisions that minimize tissue trauma. Coupled with localized digital anesthesia or concierge sedation, patients experience virtually zero pain during the procedure and significantly faster recovery.',
    },
    {
      question: 'How long do 3D Porcelain Veneers last?',
      answer:
        'Our custom multi-layered VITA BL1 porcelain veneers are engineered for maximum durability. With standard oral hygiene and biannual checkups, they typically last 15 to 25+ years without staining or fading.',
    },
    {
      question: 'Can I complete my smile restoration in a single visit?',
      answer:
        'Yes. Utilizing our in-house 3D CAD/CAM milling laboratory and laser scanning technology, same-day ceramic crowns and temporary veneer prototypes can be designed, fabricated, and placed in just one appointment.',
    },
    {
      question: 'What is the cost of a full 3D smile consultation?',
      answer:
        'Initial consultations include full-jaw 3D CBCT diagnostic imaging, AI root mapping telemetry, and personalized treatment planning with Dr. Vance. We provide transparent fee structures and flexible healthcare financing plans.',
    },
    {
      question: 'How does painless laser decay removal work?',
      answer:
        'Dental lasers emit focused light energy that vaporizes decay and bacteria at the molecular level without the friction, heat, or noise of traditional dental drills, preserving maximum healthy natural tooth structure.',
    },
    {
      question: 'Do you offer emergency dental services on weekends?',
      answer:
        'Yes. Smile Dental Groups provides 24/7 emergency concierge care at our Fifth Avenue practice for acute dental trauma, severe pain, or displaced restorations.',
    },
  ];

  const toggleFAQ = (index: number) => {
    soundFX.playClick();
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="relative py-28 px-6 bg-[#F8FAFC]/80 backdrop-blur-xl border-t border-slate-200/60 overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="w-12 h-12 rounded-2xl bg-[#0284C7]/10 border border-[#0284C7]/20 flex items-center justify-center mb-4">
            <HelpCircle className="w-6 h-6 text-[#0284C7]" />
          </div>
          <span className="text-xs font-mono text-[#0284C7] uppercase tracking-widest font-bold mb-2">
            PATIENT INFORMATION
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mt-3 font-normal">
            Everything you need to know about our 3D treatments, robotic procedures, and consultation process.
          </p>
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="glass-card rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  onMouseEnter={() => soundFX.playHover()}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-[#0284C7] transition-colors"
                >
                  <span className="text-base sm:text-lg font-bold">{faq.question}</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 bg-[#0284C7] text-white' : 'text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 font-normal">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
