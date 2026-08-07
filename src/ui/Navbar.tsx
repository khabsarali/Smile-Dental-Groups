import React, { useState, useEffect } from 'react';
import { Sparkles, Phone, Calendar, Menu, X, ShieldCheck } from 'lucide-react';
import { soundFX } from './SoundEffects';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: '3D Journey', id: 'hero-section' },
    { label: 'About Studio', id: 'about' },
    { label: 'Treatments', id: 'services' },
    { label: 'Specialists', id: 'team' },
    { label: 'Results', id: 'gallery' },
    { label: 'Technology', id: 'technology' },
    { label: 'FAQ', id: 'faq' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'py-3 bg-slate-950/80 backdrop-blur-2xl border-b border-white/10 shadow-2xl'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => {
            soundFX.playClick();
            onNavigate('hero-section');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#00A3FF] flex items-center justify-center shadow-lg shadow-[#0284C7]/30 border border-white/20 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-black tracking-tight text-white block">
              Home of Smiles
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#38BDF8] uppercase block">
              Luxury Cosmetic Dentistry
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 glass-panel px-4 py-1.5 rounded-full border border-white/15">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                soundFX.playClick();
                onNavigate(item.id);
              }}
              onMouseEnter={() => soundFX.playHover()}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right CTA Group */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="tel:+18005557645"
            onMouseEnter={() => soundFX.playHover()}
            className="glass-panel px-3.5 py-2 rounded-full text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 border border-white/15 transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-[#00A3FF]" />
            <span>(800) 555-SMILE</span>
          </a>

          <button
            onClick={() => {
              soundFX.playClick();
              onNavigate('appointment');
            }}
            onMouseEnter={() => soundFX.playHover()}
            className="glass-button px-5 py-2.5 rounded-full text-xs font-bold text-white flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Consultation</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl glass-panel text-slate-200"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-t border-white/10 p-6 space-y-3 bg-slate-950/95 backdrop-blur-2xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                soundFX.playClick();
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-[#38BDF8]"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              soundFX.playClick();
              onNavigate('appointment');
              setMobileMenuOpen(false);
            }}
            className="glass-button w-full py-3 rounded-xl text-center text-sm font-bold text-white mt-4 block"
          >
            Book Consultation
          </button>
        </div>
      )}
    </nav>
  );
};
