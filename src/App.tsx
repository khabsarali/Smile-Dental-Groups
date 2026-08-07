import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useImagePreloader } from './hooks/useImagePreloader';
import { Preloader } from './ui/Preloader';
import { CustomCursor } from './ui/CustomCursor';
import { Navbar } from './ui/Navbar';

import { HeroSequenceCanvas } from './components/hero/HeroSequenceCanvas';
import { ThreeBackground } from './components/hero/ThreeBackground';
import { Footer } from './components/sections/Footer';

import { WelcomeSection } from './components/sections/WelcomeSection';
import { Treatments } from './components/sections/Treatments';
import { WhyChooseUs } from './components/sections/WhyChooseUs';
import { AboutClinic } from './components/sections/AboutClinic';
import { OurTeam } from './components/sections/OurTeam';
import { BeforeAfterSlider } from './components/sections/BeforeAfterSlider';
import { TreatmentTimeline } from './components/sections/TreatmentTimeline';
import { ReviewsSection } from './components/sections/ReviewsSection';
import { FAQSection } from './components/sections/FAQSection';
import { ContactSection } from './components/sections/ContactSection';

import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { GalleryPage } from './pages/GalleryPage';
import { AppointmentPage } from './pages/AppointmentPage';

gsap.registerPlugin(ScrollTrigger);

export type PageId = 'home' | 'about' | 'services' | 'gallery' | 'appointment';

export function App() {
  const { loadedCount, totalCount, progress, isLoaded, ensureFrameLoaded, getCachedFrame } = useImagePreloader();
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [globalScrollProgress, setGlobalScrollProgress] = useState<number>(0);
  const pageContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis Smooth Scroll Engine & Sync with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.9,
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

  // Global Document ScrollTrigger mapping 0% to 100% across the 3D scroll viewport
  useEffect(() => {
    if (!pageContainerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: pageContainerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.05,
      onUpdate: (self) => {
        const prog = self.progress;
        setGlobalScrollProgress(prog);

        // Map global page scroll to 5 scenes
        let stage = 1;
        if (prog < 0.2) stage = 1;
        else if (prog < 0.4) stage = 2;
        else if (prog < 0.6) stage = 3;
        else if (prog < 0.8) stage = 4;
        else stage = 5;

        setCurrentStage(stage);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [currentPage]);

  const handleNavigate = (page: string) => {
    // If on homepage and a section ID is clicked, smooth scroll to it
    const element = document.getElementById(page);
    if (element && currentPage === 'home') {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      setCurrentPage(page as PageId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      id="global-page-container"
      ref={pageContainerRef}
      className="relative min-h-screen bg-[#05080E] text-slate-900 selection:bg-[#0284C7] selection:text-white overflow-x-hidden"
    >
      {/* SECTION 1: High-Tech Preloader */}
      <Preloader
        progress={progress}
        loadedCount={loadedCount}
        totalCount={totalCount}
        isLoaded={isLoaded}
      />

      {/* Laser Precision Custom Cursor */}
      <CustomCursor />

      {/* Global Header Navbar */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* FIXED PERMANENT LIVING 3D BACKGROUND (Stays alive & visible behind entire website) */}
      <HeroSequenceCanvas
        scrollProgress={globalScrollProgress}
        currentStage={currentStage}
        ensureFrameLoaded={ensureFrameLoaded}
        getCachedFrame={getCachedFrame}
      />

      {/* Fixed Full-Screen R3F 3D Particle & Laser Overlay */}
      <ThreeBackground stage={currentStage} progress={globalScrollProgress} />

      {/* Page Routing */}
      {currentPage === 'home' && (
        <>
          {/* INITIAL EXPERIENCE: 100% Unobstructed Fullscreen 3D Scroll Journey Viewport */}
          <div id="hero-journey-viewport" className="relative w-full h-[500vh] z-20 pointer-events-none" />

          {/* POST-ANIMATION CONTENT FLOW: Floating Glassmorphism Cards Over Living 3D Background */}
          <main className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 space-y-24 py-16 transition-all duration-700">
            {/* 1. About the Clinic (Floating Glassmorphic Card) */}
            <div id="about" className="glass-card rounded-[2.5rem] p-4 sm:p-8 border border-white/30 backdrop-blur-2xl bg-white/80 shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
              <AboutClinic />
            </div>

            {/* 2. Our Philosophy & Welcome Section */}
            <div id="welcome" className="glass-card rounded-[2.5rem] p-4 sm:p-8 border border-white/30 backdrop-blur-2xl bg-white/80 shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
              <WelcomeSection onNavigate={handleNavigate} />
            </div>

            {/* 3. Why Choose Us & Modern Technology */}
            <div id="why-choose-us" className="glass-card rounded-[2.5rem] p-4 sm:p-8 border border-white/30 backdrop-blur-2xl bg-white/80 shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
              <WhyChooseUs />
            </div>

            {/* 4. Comprehensive Treatments (Implants, Veneers, Orthodontics, Emergency) */}
            <div id="services" className="glass-card rounded-[2.5rem] p-4 sm:p-8 border border-white/30 backdrop-blur-2xl bg-white/80 shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
              <Treatments />
            </div>

            {/* 5. Our Dental Specialists & Doctors */}
            <div id="team" className="glass-card rounded-[2.5rem] p-4 sm:p-8 border border-white/30 backdrop-blur-2xl bg-white/80 shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
              <OurTeam />
            </div>

            {/* 6. Before & After Results Slider */}
            <div id="gallery" className="glass-card rounded-[2.5rem] p-4 sm:p-8 border border-white/30 backdrop-blur-2xl bg-white/80 shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
              <BeforeAfterSlider />
            </div>

            {/* 7. Treatment Journey Timeline */}
            <div id="journey" className="glass-card rounded-[2.5rem] p-4 sm:p-8 border border-white/30 backdrop-blur-2xl bg-white/80 shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
              <TreatmentTimeline />
            </div>

            {/* 8. 5-Star Patient Reviews & Google Testimonials */}
            <div id="reviews" className="glass-card rounded-[2.5rem] p-4 sm:p-8 border border-white/30 backdrop-blur-2xl bg-white/80 shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
              <ReviewsSection />
            </div>

            {/* 9. Frequently Asked Questions Accordion */}
            <div id="faq" className="glass-card rounded-[2.5rem] p-4 sm:p-8 border border-white/30 backdrop-blur-2xl bg-white/80 shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
              <FAQSection />
            </div>

            {/* 10. Book an Appointment & Contact Details */}
            <div id="appointment" className="glass-card rounded-[2.5rem] p-4 sm:p-8 border border-white/30 backdrop-blur-2xl bg-white/80 shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
              <ContactSection />
            </div>
          </main>
        </>
      )}

      {currentPage === 'about' && (
        <div className="relative z-30 pt-20 max-w-7xl mx-auto px-4 sm:px-6">
          <AboutPage />
        </div>
      )}
      {currentPage === 'services' && (
        <div className="relative z-30 pt-20 max-w-7xl mx-auto px-4 sm:px-6">
          <ServicesPage />
        </div>
      )}
      {currentPage === 'gallery' && (
        <div className="relative z-30 pt-20 max-w-7xl mx-auto px-4 sm:px-6">
          <GalleryPage />
        </div>
      )}
      {currentPage === 'appointment' && (
        <div className="relative z-30 pt-20 max-w-7xl mx-auto px-4 sm:px-6">
          <AppointmentPage />
        </div>
      )}

      {/* SECTION 13: Luxury Footer Navigation Hub */}
      <div className="relative z-30 mt-16">
        <Footer onNavigate={handleNavigate} />
      </div>
    </div>
  );
}

export default App;
