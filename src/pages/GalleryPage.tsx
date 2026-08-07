import React from 'react';
import { BeforeAfterSlider } from '../components/sections/BeforeAfterSlider';
import { Testimonials } from '../components/sections/Testimonials';

export const GalleryPage: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <span className="text-xs font-mono text-[#0284C7] uppercase tracking-widest font-bold">
          PATIENT CASE RESULTS & REVIEWS
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mt-2 mb-4">
          Smile Gallery & Transformations
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-base">
          Explore real before and after patient transformations and verified 5-star clinical testimonials.
        </p>
      </div>

      <BeforeAfterSlider />
      <Testimonials />
    </div>
  );
};
