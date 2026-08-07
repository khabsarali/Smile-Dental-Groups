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
import { HeroOverlayText } from './components/hero/HeroOverlayText';
import { StageIndicator } from './components/hero/StageIndicator';

import { AboutClinic } from './components/sections/AboutClinic';
import { Treatments } from './components/sections/Treatments';
import { BeforeAfterSlider } from './components/sections/BeforeAfterSlider';
import { TreatmentTimeline } from './components/sections/TreatmentTimeline';
import { MeetDentist } from './components/sections/MeetDentist';
import { Testimonials } from './components/sections/Testimonials';
import { AppointmentBooking } from './components/sections/AppointmentBooking';
import { Footer } from './components/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const { images, loadedCount, totalCount, progress, isLoaded, ensureFrameLoaded } = useImagePreloader();
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
  }, []);

  return (
    <div
      id="global-page-container"
      ref={pageContainerRef}
      className="relative min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#0284C7] selection:text-white overflow-x-hidden"
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
      <Navbar />

      {/* Fixed Full-Screen Global 3D Background Canvas Layer */}
      <HeroSequenceCanvas
        images={images}
        scrollProgress={globalScrollProgress}
        currentStage={currentStage}
        ensureFrameLoaded={ensureFrameLoaded}
      />

      {/* Fixed Full-Screen R3F 3D Particle & Laser Overlay */}
      <ThreeBackground stage={currentStage} progress={globalScrollProgress} />

      {/* Fixed Side Rail Stage Indicator */}
      <StageIndicator currentStage={currentStage} progress={globalScrollProgress} />

      {/* Hero Overview Viewport Section */}
      <div id="hero-container" className="relative w-full min-h-screen z-20">
        <HeroOverlayText stage={currentStage} progress={globalScrollProgress} />
      </div>

      {/* Translucent Content Sections Overlaying 3D Background */}
      <main className="relative z-20">
        <AboutClinic />
        <Treatments />
        <BeforeAfterSlider />
        <TreatmentTimeline />
        <MeetDentist />
        <Testimonials />
        <AppointmentBooking />
      </main>

      {/* Luxury Footer */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}

export default App;
