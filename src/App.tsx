import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useImagePreloader } from './hooks/useImagePreloader';
import { Cinematic3DScroll } from './components/cinematic/Cinematic3DScroll';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const { ensureFrameLoaded, getCachedFrame } = useImagePreloader();

  // Initialize Lenis smooth scroll engine
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

  return (
    <main className="relative min-h-screen bg-[#05080E] text-slate-100 overflow-x-hidden selection:bg-[#0284C7] selection:text-white">
      {/* 100vh Fullscreen Pinned 3D Cinematic Scroll Experience */}
      <Cinematic3DScroll
        ensureFrameLoaded={ensureFrameLoaded}
        getCachedFrame={getCachedFrame}
      />
    </main>
  );
}

export default App;
