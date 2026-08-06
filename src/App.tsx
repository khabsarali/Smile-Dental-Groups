import React, { useEffect, useState } from 'react';
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
  const { images, loadedCount, totalCount, progress, isLoaded } = useImagePreloader();
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [heroProgress, setHeroProgress] = useState<number>(0);

  // Initialize Lenis Smooth Scroll Engine & Sync with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
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

  const handleStageChange = (stage: number, prog: number) => {
    setCurrentStage(stage);
    setHeroProgress(prog);
  };

  return (
    <div className="relative min-h-screen bg-[#05070A] text-slate-100 selection:bg-[#4FC3F7] selection:text-black">
      {/* High-Tech Cyber Preloader */}
      <Preloader
        progress={progress}
        loadedCount={loadedCount}
        totalCount={totalCount}
        isLoaded={isLoaded}
      />

      {/* Laser Precision Custom Cursor */}
      <CustomCursor />

      {/* Global Glass Header Navbar */}
      <Navbar />

      {/* Hero Section Container */}
      <div className="relative w-full">
        {/* Scroll-Driven Master Canvas Sequence */}
        <HeroSequenceCanvas images={images} onStageChange={handleStageChange} />

        {/* R3F 3D Laser & Particle Overlay */}
        <ThreeBackground stage={currentStage} progress={heroProgress} />

        {/* Synchronized Headline HUD Overlays */}
        <HeroOverlayText stage={currentStage} progress={heroProgress} />

        {/* Side Rail Stage Progress Indicator */}
        <StageIndicator currentStage={currentStage} progress={heroProgress} />
      </div>

      {/* Content Sections */}
      <main className="relative z-20">
        <AboutClinic />
        <Treatments />
        <BeforeAfterSlider />
        <TreatmentTimeline />
        <MeetDentist />
        <Testimonials />
        <AppointmentBooking />
      </main>

      {/* Luxury Minimal Footer */}
      <Footer />
    </div>
  );
}

export default App;
