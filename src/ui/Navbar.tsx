import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Calendar, Menu, X, Sparkles, PhoneCall } from 'lucide-react';
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
          ? 'py-3 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.06)]'
          : 'py-5 bg-transparent'
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
          </div>
          <div>
            <span className="text-base font-extrabold tracking-wider text-slate-900 flex items-center gap-1.5 font-sans">
              HOME OF <span className="text-[#0284C7]">SMILES</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500 tracking-widest block uppercase">
              Terwillegar Dental • Edmonton
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 glass-panel px-4 py-2 rounded-full border border-slate-200">
          {[
            { label: '3D Journey', page: 'home' },
            { label: 'About Us', page: 'about' },
            { label: 'Services', page: 'services' },
            { label: 'Our Team', page: 'about' },
            { label: 'Smile Gallery', page: 'gallery' },
            { label: 'Contact', page: 'appointment' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleNavClick(item.page)}
              onMouseEnter={() => soundFX.playHover()}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
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
          {/* Emergency Phone Quick Link */}
          <a
            href="tel:7804301336"
            onMouseEnter={() => soundFX.playHover()}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-mono font-bold text-slate-800 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>780-430-1336</span>
          </a>

          {/* Audio Toggle */}
          <button
            onClick={toggleSound}
            onMouseEnter={() => soundFX.playHover()}
            className="p-2.5 rounded-full glass-card border border-slate-200 text-slate-600 hover:text-[#0284C7] transition-all"
            title={isMuted ? 'Unmute Audio FX' : 'Mute Audio FX'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#0284C7]" />}
          </button>

          {/* Book Appointment CTA */}
          <button
            onClick={() => handleNavClick('appointment')}
            onMouseEnter={() => soundFX.playHover()}
            className="px-5 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#00A3FF] text-white font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-[#0284C7]/25 transition-all duration-300"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Book Visit</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-full bg-slate-100 text-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-2">
            {[
              { label: '3D Treatment Journey', page: 'home' },
              { label: 'About Us & Clinic', page: 'about' },
              { label: 'Comprehensive Services', page: 'services' },
              { label: 'Smile Gallery & Cases', page: 'gallery' },
              { label: 'Book Appointment', page: 'appointment' },
            ].map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className="text-left py-2 text-sm font-semibold text-slate-800 hover:text-[#0284C7]"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>📍 2408 Rabbit Hill Rd NW</span>
            <span className="font-bold text-[#0284C7]">780-430-1336</span>
          </div>
        </div>
      )}
    </header>
  );
};
