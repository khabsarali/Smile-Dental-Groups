import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Calendar, Menu, X, Sparkles } from 'lucide-react';
import { soundFX } from './SoundEffects';

interface NavbarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage = 'home', onNavigate }) => {
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

  const handleNavClick = (pageId: string) => {
    soundFX.playClick();
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(pageId);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-3 bg-white/90 backdrop-blur-xl border-b border-[#0284C7]/15 shadow-[0_10px_30px_rgba(15,23,42,0.06)]'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="flex items-center gap-3 group"
          onMouseEnter={() => soundFX.playHover()}
        >
          <div className="relative w-10 h-10 rounded-xl bg-[#0284C7]/10 border border-[#0284C7]/30 flex items-center justify-center shadow-[0_0_15px_rgba(2,132,199,0.15)] group-hover:shadow-[0_0_25px_rgba(2,132,199,0.35)] transition-all duration-300">
            <Sparkles className="w-5 h-5 text-[#0284C7] group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-xl bg-[#0284C7]/10 blur-sm group-hover:opacity-100 opacity-0 transition-opacity" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-wider text-slate-900 flex items-center gap-1.5 font-sans">
              SMILE <span className="text-[#0284C7]">DENTAL</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500 tracking-widest block uppercase">
              Groups • Architectural Care
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 glass-panel px-4 py-2 rounded-full border border-slate-200">
          {[
            { label: 'Home 3D Keynote', page: 'home' },
            { label: 'About', page: 'about' },
            { label: 'Services', page: 'services' },
            { label: 'Smile Gallery', page: 'gallery' },
            { label: 'Appointment', page: 'appointment' },
          ].map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              onMouseEnter={() => soundFX.playHover()}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                currentPage === item.page
                  ? 'bg-[#0284C7] text-white shadow-sm'
                  : 'text-slate-700 hover:text-[#0284C7] hover:bg-slate-100'
              }`}
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
            className="p-2.5 rounded-full glass-card border border-slate-200 text-slate-600 hover:text-[#0284C7] hover:border-[#0284C7]/40 transition-all duration-300"
            title={isMuted ? 'Unmute Futuristic UI Sounds' : 'Mute UI Sounds'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#0284C7]" />}
          </button>

          {/* Book Appointment CTA */}
          <button
            onClick={() => handleNavClick('appointment')}
            onMouseEnter={() => soundFX.playHover()}
            className="relative group overflow-hidden px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0284C7] to-[#00A3FF] text-white font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-[0_4px_20px_rgba(2,132,199,0.35)] hover:shadow-[0_6px_25px_rgba(2,132,199,0.5)] transition-all duration-300"
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
            className="lg:hidden p-2.5 rounded-full glass-card border border-slate-200 text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#0284C7]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-white/95 backdrop-blur-2xl border-b border-[#0284C7]/20 p-6 flex flex-col gap-4 shadow-2xl">
          {[
            { label: 'Home 3D Keynote', page: 'home' },
            { label: 'About Us', page: 'about' },
            { label: 'Services & Treatments', page: 'services' },
            { label: 'Smile Gallery', page: 'gallery' },
            { label: 'Book Appointment', page: 'appointment' },
          ].map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className={`text-left py-2 text-sm font-semibold border-b border-slate-100 ${
                currentPage === item.page ? 'text-[#0284C7]' : 'text-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
