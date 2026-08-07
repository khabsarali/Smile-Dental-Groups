import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useImagePreloader } from './hooks/useImagePreloader';
import { CustomCursor } from './ui/CustomCursor';
import { Navbar } from './ui/Navbar';

import { Cinematic3DScroll } from './components/cinematic/Cinematic3DScroll';
import { AboutClinic } from './components/sections/AboutClinic';
import { Treatments } from './components/sections/Treatments';
import { OurTeam } from './components/sections/OurTeam';
import { BeforeAfterSlider } from './components/sections/BeforeAfterSlider';
import { WhyChooseUs } from './components/sections/WhyChooseUs';
import { ReviewsSection } from './components/sections/ReviewsSection';
import { FAQSection } from './components/sections/FAQSection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const { ensureFrameLoaded, getCachedFrame } = useImagePreloader();

  // Initialize Lenis smooth scroll engine & Sync with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#05080E] text-slate-100 overflow-x-hidden selection:bg-[#0284C7] selection:text-white">
      {/* Laser Precision Custom Cursor */}
      <CustomCursor />

      {/* Global Frosted Glass Header Navbar */}
      <Navbar onNavigate={handleNavigate} />

      {/* 1. HERO ANIMATION: 100vh Fullscreen 3D Anti-Gravity Dental Transformation */}
      <section id="hero-section" className="relative w-full">
        <Cinematic3DScroll />
      </section>

      {/* 2. POST-HERO LUXURY CONTENT SECTIONS: Floating Glassmorphism Cards */}
      <main className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 space-y-24 py-20">
        {/* Section 1: About the Studio */}
        <div id="about" className="glass-card rounded-[2.5rem] p-6 sm:p-10 border border-white/20 backdrop-blur-2xl bg-white/85 text-slate-900 shadow-[0_25px_60px_rgba(0,0,0,0.2)]">
          <AboutClinic />
        </div>

        {/* Section 2: Specialized Treatments */}
        <div id="services" className="glass-card rounded-[2.5rem] p-6 sm:p-10 border border-white/20 backdrop-blur-2xl bg-white/85 text-slate-900 shadow-[0_25px_60px_rgba(0,0,0,0.2)]">
          <Treatments />
        </div>

        {/* Section 3: Our Dental Specialists */}
        <div id="team" className="glass-card rounded-[2.5rem] p-6 sm:p-10 border border-white/20 backdrop-blur-2xl bg-white/85 text-slate-900 shadow-[0_25px_60px_rgba(0,0,0,0.2)]">
          <OurTeam />
        </div>

        {/* Section 4: Interactive Before & After Comparison */}
        <div id="gallery" className="glass-card rounded-[2.5rem] p-6 sm:p-10 border border-white/20 backdrop-blur-2xl bg-white/85 text-slate-900 shadow-[0_25px_60px_rgba(0,0,0,0.2)]">
          <BeforeAfterSlider />
        </div>

        {/* Section 5: Why Discerning Patients Choose Us */}
        <div id="technology" className="glass-card rounded-[2.5rem] p-6 sm:p-10 border border-white/20 backdrop-blur-2xl bg-white/85 text-slate-900 shadow-[0_25px_60px_rgba(0,0,0,0.2)]">
          <WhyChooseUs />
        </div>

        {/* Section 6: Verified Patient Testimonials */}
        <div id="reviews" className="glass-card rounded-[2.5rem] p-6 sm:p-10 border border-white/20 backdrop-blur-2xl bg-white/85 text-slate-900 shadow-[0_25px_60px_rgba(0,0,0,0.2)]">
          <ReviewsSection />
        </div>

        {/* Section 7: Frequently Asked Questions */}
        <div id="faq" className="glass-card rounded-[2.5rem] p-6 sm:p-10 border border-white/20 backdrop-blur-2xl bg-white/85 text-slate-900 shadow-[0_25px_60px_rgba(0,0,0,0.2)]">
          <FAQSection />
        </div>

        {/* Section 8: VIP Appointment Booking & Penthouse Details */}
        <div id="appointment" className="glass-card rounded-[2.5rem] p-6 sm:p-10 border border-white/20 backdrop-blur-2xl bg-white/85 text-slate-900 shadow-[0_25px_60px_rgba(0,0,0,0.2)]">
          <ContactSection />
        </div>
      </main>

      {/* Luxury Footer Navigation Hub */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
