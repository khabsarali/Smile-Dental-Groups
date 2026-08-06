import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Calendar, Menu, X, Sparkles } from 'lucide-react';
import { soundFX } from './SoundEffects';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFX.playClick();
  };

  const scrollToSection = (id: string) => {
    soundFX.playClick();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-3 bg-[#05070A]/80 backdrop-blur-xl border-b border-[#4FC3F7]/15 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('hero-container');
          }}
          className="flex items-center gap-3 group"
          onMouseEnter={() => soundFX.playHover()}
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#4FC3F7]/20 to-[#00E5FF]/5 border border-[#4FC3F7]/30 flex items-center justify-center shadow-[0_0_15px_rgba(79,195,247,0.2)] group-hover:shadow-[0_0_25px_rgba(79,195,247,0.5)] transition-all duration-300">
            <Sparkles className="w-5 h-5 text-[#4FC3F7] group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-xl bg-[#4FC3F7]/10 blur-sm group-hover:opacity-100 opacity-0 transition-opacity" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-wider text-white flex items-center gap-1.5 font-sans">
              SMILE <span className="text-[#4FC3F7]">DENTAL</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 tracking-widest block uppercase">
              Groups • Architectural Care
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 glass-panel px-4 py-2 rounded-full border border-white/10">
          {[
            { label: 'Overview', id: 'hero-container' },
            { label: 'About', id: 'about-clinic' },
            { label: 'Treatments', id: 'treatments-section' },
            { label: 'Before / After', id: 'before-after-section' },
            { label: 'Timeline', id: 'timeline-section' },
            { label: 'Meet Doctor', id: 'doctor-section' },
            { label: 'Reviews', id: 'testimonials-section' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              onMouseEnter={() => soundFX.playHover()}
              className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-[#4FC3F7] hover:bg-white/5 rounded-full transition-all duration-200"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Audio Toggle */}
          <button
            onClick={toggleSound}
            onMouseEnter={() => soundFX.playHover()}
            className="p-2.5 rounded-full glass-card border border-white/10 text-slate-300 hover:text-[#4FC3F7] hover:border-[#4FC3F7]/40 transition-all duration-300"
            title={isMuted ? 'Unmute Futuristic UI Sounds' : 'Mute UI Sounds'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#4FC3F7]" />}
          </button>

          {/* Book Appointment CTA */}
          <button
            onClick={() => scrollToSection('booking-section')}
            onMouseEnter={() => soundFX.playHover()}
            className="relative group overflow-hidden px-5 py-2.5 rounded-full bg-gradient-to-r from-[#4FC3F7] to-[#00E5FF] text-slate-950 font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(79,195,247,0.4)] hover:shadow-[0_0_30px_rgba(79,195,247,0.7)] transition-all duration-300"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Appointment</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              soundFX.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2.5 rounded-full glass-card border border-white/10 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#4FC3F7]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-[#05070A]/95 backdrop-blur-2xl border-b border-[#4FC3F7]/20 p-6 flex flex-col gap-4 shadow-2xl">
          {[
            { label: 'Overview', id: 'hero-container' },
            { label: 'About Clinic', id: 'about-clinic' },
            { label: 'Treatments', id: 'treatments-section' },
            { label: 'Before & After', id: 'before-after-section' },
            { label: 'Treatment Timeline', id: 'timeline-section' },
            { label: 'Meet Dr. Vance', id: 'doctor-section' },
            { label: 'Patient Testimonials', id: 'testimonials-section' },
            { label: 'Book Appointment', id: 'booking-section' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-left py-2 text-sm font-semibold text-slate-200 hover:text-[#4FC3F7] border-b border-slate-800/60"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
