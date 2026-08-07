import React from 'react';
import { BeforeAfterSlider } from '../components/sections/BeforeAfterSlider';
import { ReviewsSection } from '../components/sections/ReviewsSection';
import { TreatmentTimeline } from '../components/sections/TreatmentTimeline';

export const GalleryPage: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <span className="text-xs font-mono text-[#0284C7] uppercase tracking-widest font-bold">
          PATIENT TRANSFORMATIONS
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mt-2 mb-4">
          Smile Gallery & Real Results
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-base">
          Explore real before and after smile transformations achieved with porcelain veneers, whitening, and dental implants.
        </p>
      </div>

      <BeforeAfterSlider />
      <TreatmentTimeline />
      <ReviewsSection />
    </div>
  );
};
