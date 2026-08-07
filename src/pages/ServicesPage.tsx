import React from 'react';
import { Treatments } from '../components/sections/Treatments';
import { TreatmentTimeline } from '../components/sections/TreatmentTimeline';

export const ServicesPage: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <span className="text-xs font-mono text-[#0284C7] uppercase tracking-widest font-bold">
          ROBOTIC & COSMETIC PROCEDURES
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mt-2 mb-4">
          Services & Treatments
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-base">
          From 3D Porcelain Veneers to Sub-Micron Robotic Implants and Painless Laser Sterilization.
        </p>
      </div>

      <Treatments />
      <TreatmentTimeline />
    </div>
  );
};
