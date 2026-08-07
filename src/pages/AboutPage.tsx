import React from 'react';
import { AboutClinic } from '../components/sections/AboutClinic';
import { OurTeam } from '../components/sections/OurTeam';
import { WhyChooseUs } from '../components/sections/WhyChooseUs';
import { ReviewsSection } from '../components/sections/ReviewsSection';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <span className="text-xs font-mono text-[#0284C7] uppercase tracking-widest font-bold">
          TERWILLEGAR CLINICAL LEADERSHIP
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mt-2 mb-4">
          About Home of Smiles Dental
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-base">
          A modern Edmonton dental sanctuary dedicated to family wellness, digital precision, and transparent care following the Alberta Dental Fee Guide.
        </p>
      </div>

      <AboutClinic />
      <OurTeam />
      <WhyChooseUs />
      <ReviewsSection />
    </div>
  );
};
