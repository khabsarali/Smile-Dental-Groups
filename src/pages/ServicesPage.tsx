import React from 'react';
import { Treatments } from '../components/sections/Treatments';
import { TreatmentTimeline } from '../components/sections/TreatmentTimeline';
import { WhyChooseUs } from '../components/sections/WhyChooseUs';

export const ServicesPage: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <span className="text-xs font-mono text-[#0284C7] uppercase tracking-widest font-bold">
          COMPREHENSIVE DENTAL CATALOGUE
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mt-2 mb-4">
          Services & Clinical Treatments
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-base">
          From routine checkups and pediatric hygiene to 3D dental implants, porcelain veneers, and Invisalign aligners in Edmonton.
        </p>
      </div>

      <Treatments />
      <TreatmentTimeline />
      <WhyChooseUs />
    </div>
  );
};
