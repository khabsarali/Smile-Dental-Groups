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
      question: 'Do you follow the Alberta Dental Fee Guide?',
      answer:
        'Yes. Home of Smiles strictly follows the current Alberta Dental Association Fee Guide to ensure our pricing remains transparent, fair, and accessible for all Edmonton individuals and families.',
    },
    {
      question: 'Do you offer direct billing to Canadian insurance plans?',
      answer:
        'Yes. We direct bill to almost all major Canadian dental insurance providers (including Sun Life, Manulife, Canada Life, Green Shield, Alberta Blue Cross, and more), so you only pay your co-pay or deductible.',
    },
    {
      question: 'Are you accepting new patients and emergency walk-ins?',
      answer:
        'Absolutely! We warmly welcome new patients of all ages from Terwillegar, Windermere, Riverbend, and across Edmonton. We are open 7 days a week and offer same-day priority emergency dental care.',
    },
    {
      question: 'How long does Invisalign treatment take?',
      answer:
        'Most adult and teen Invisalign treatments take between 6 to 18 months depending on the complexity of your alignment. With our digital 3D iTero scanner, we show you your predicted smile outcome before you start.',
    },
    {
      question: 'What should I do during a dental emergency?',
      answer:
        'Call our direct emergency line at 780-430-1336 immediately. If a tooth is knocked out, keep it moist in milk or saliva and come straight to our clinic at 2408 Rabbit Hill Rd NW.',
    },
    {
      question: 'Are dental implants painful?',
      answer:
        'No. Utilizing local anesthesia or dental sedation combined with 3D CBCT guided placement, most patients report minimal discomfort during the procedure and easily manage recovery with standard over-the-counter pain relievers.',
    },
  ];

  const toggleFAQ = (index: number) => {
    soundFX.playClick();
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="relative py-28 px-6 bg-white border-t border-slate-200/80 overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="w-12 h-12 rounded-2xl bg-[#0284C7]/10 border border-[#0284C7]/20 flex items-center justify-center mb-4">
            <HelpCircle className="w-6 h-6 text-[#0284C7]" />
          </div>
          <span className="text-xs font-mono text-[#0284C7] uppercase tracking-widest font-bold mb-2">
            PATIENT INFORMATION & ANSWERS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mt-3 font-normal">
            Helpful information regarding the Alberta Fee Guide, direct insurance billing, and clinic procedures.
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
