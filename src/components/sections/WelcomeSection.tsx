import React from 'react';
import { Calendar, PhoneCall, Sparkles, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

interface WelcomeSectionProps {
  onNavigate?: (page: string) => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onNavigate }) => {
  const servicesList = [
    'Dental Cleaning',
    'Gum Disease Treatment',
    'Teeth Whitening',
    'Dental Implants',
    'Dentures',
    'Invisalign',
    'Crowns & Bridges',
    'Porcelain Veneers',
    'Emergency Dentistry',
    'Pediatric Care',
  ];

  return (
    <section id="welcome-section" className="relative py-28 px-6 bg-white overflow-hidden border-t border-slate-200/80">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0284C7]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00A3FF]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0284C7]/10 border border-[#0284C7]/20 text-[#0284C7] text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>TERWILLEGAR'S NEW & MODERN DENTAL CLINIC</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Welcome to <span className="text-gradient-cyan">Home of Smiles Dental</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Located in the heart of Terwillegar, Edmonton, our clinic offers comprehensive dental solutions combining modern technology, personalized comfort, and strict adherence to the <strong>Alberta Dental Fee Guide</strong>.
            </p>

            {/* Quick Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
                <span>Alberta Fee Guide</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
                <span>Open 7 Days a Week</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <HeartHandshake className="w-4 h-4 text-[#0284C7]" />
                <span>Direct Insurance Billing</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-6">
              <button
                onClick={() => {
                  soundFX.playClick();
                  if (onNavigate) onNavigate('appointment');
                }}
                onMouseEnter={() => soundFX.playHover()}
                className="bg-[#0284C7] hover:bg-[#00A3FF] text-white px-7 py-3.5 rounded-full text-sm font-bold tracking-wide shadow-lg shadow-[#0284C7]/25 hover:shadow-[#00A3FF]/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>

              <a
                href="tel:7804301336"
                onMouseEnter={() => soundFX.playHover()}
                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-7 py-3.5 rounded-full text-sm font-bold tracking-wide hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-red-500" />
                <span>Emergency: 780-430-1336</span>
              </a>
            </div>
          </div>

          {/* Right Column: Services Grid Card */}
          <div className="lg:col-span-5">
            <div className="glass-card p-8 rounded-3xl border border-slate-200/90 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
                Complete Clinical Dental Care
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {servicesList.map((service, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium py-1">
                    <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>📍 2408 Rabbit Hill Rd NW</span>
                <span className="text-emerald-600 font-bold">● OPEN 7 DAYS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
