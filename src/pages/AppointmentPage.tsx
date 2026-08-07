import React from 'react';
import { ContactSection } from '../components/sections/ContactSection';
import { FAQSection } from '../components/sections/FAQSection';

export const AppointmentPage: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <span className="text-xs font-mono text-[#0284C7] uppercase tracking-widest font-bold">
          CONCIERGE SCHEDULING
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mt-2 mb-4">
          Reserve Your Dental Visit
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-base">
          Direct concierge booking for routine checkups, cosmetic consultations, or emergency care in Terwillegar, Edmonton.
        </p>
      </div>

      <ContactSection />
      <FAQSection />
    </div>
  );
};
