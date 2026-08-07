import React from 'react';
import { AboutClinic } from '../components/sections/AboutClinic';
import { MeetDentist } from '../components/sections/MeetDentist';
import { Testimonials } from '../components/sections/Testimonials';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <span className="text-xs font-mono text-[#0284C7] uppercase tracking-widest font-bold">
          CLINICAL EXCELLENCE & PHILOSOPHY
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mt-2 mb-4">
          About Smile Dental Groups
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-base">
          The international benchmark in architectural dentistry, bio-robotic implants, 3D laser tooth restoration, and luxury cosmetic smile redesign.
        </p>
      </div>

      <AboutClinic />
      <MeetDentist />
      <Testimonials />
    </div>
  );
};
