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

import { BeforeAfterSlider } from './components/sections/BeforeAfterSlider';
import { AboutClinic } from './components/sections/AboutClinic';
import { WhyChooseUs } from './components/sections/WhyChooseUs';
import { FAQSection } from './components/sections/FAQSection';
import { ContactSection } from './components/sections/ContactSection';

import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { GalleryPage } from './pages/GalleryPage';
import { AppointmentPage } from './pages/AppointmentPage';

gsap.registerPlugin(ScrollTrigger);

export type PageId = 'home' | 'about' | 'services' | 'gallery' | 'appointment';

export function App() {
  const { images, loadedCount, totalCount, progress, isLoaded, ensureFrameLoaded } = useImagePreloader();
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

  // Global Document ScrollTrigger mapping 0% (top) to 100% (bottom of page)
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
    setCurrentPage(page as PageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      id="global-page-container"
      ref={pageContainerRef}
      className="relative min-h-screen bg-white text-slate-900 selection:bg-[#0284C7] selection:text-white overflow-x-hidden"
    >
      {/* High-Tech Preloader */}
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

      {/* Page Routing */}
      {currentPage === 'home' && (
        <>
          {/* Fixed Full-Screen 3D Background Canvas Layer */}
          <HeroSequenceCanvas
            images={images}
            scrollProgress={globalScrollProgress}
            currentStage={currentStage}
            ensureFrameLoaded={ensureFrameLoaded}
          />

          {/* Fixed Full-Screen R3F 3D Particle Overlay */}
          <ThreeBackground stage={currentStage} progress={globalScrollProgress} />

          {/* Clean 3D Scroll Journey Viewport (100% Unobstructed 3D Animation) */}
          <div id="hero-container" className="relative w-full h-[500vh] z-20 pointer-events-none" />

          {/* Website Content Begins Immediately After Final Smile Reveal */}
          <main className="relative z-30 bg-white/95 backdrop-blur-2xl border-t border-slate-200/80 shadow-[0_-20px_50px_rgba(15,23,42,0.1)] transition-all duration-700">
            {/* 1. Before & After Gallery */}
            <BeforeAfterSlider />

            {/* 2. About the Clinic */}
            <AboutClinic />

            {/* 3. Why Choose Us */}
            <WhyChooseUs />

            {/* 4. Frequently Asked Questions */}
            <FAQSection />

            {/* 5. Contact Us & Reservation */}
            <ContactSection />
          </main>
        </>
      )}

      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'services' && <ServicesPage />}
      {currentPage === 'gallery' && <GalleryPage />}
      {currentPage === 'appointment' && <AppointmentPage />}

      {/* Luxury Footer Navigation Hub */}
      <div className="relative z-30">
        <Footer onNavigate={handleNavigate} />
      </div>
    </div>
  );
}

export default App;
