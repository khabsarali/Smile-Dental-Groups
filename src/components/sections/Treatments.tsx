import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, ShieldAlert, CheckCircle, ArrowRight, X, Clock, Award, Activity } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

interface TreatmentItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  recovery: string;
  guarantee: string;
  price: string;
  features: string[];
  image: string;
}

export const Treatments: React.FC = () => {
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentItem | null>(null);

  const treatmentData: TreatmentItem[] = [
    {
      id: 'general',
      title: 'General & Preventative Care',
      category: 'Diagnostic & Care',
      tagline: 'Ultrasonic Cleaning & Bio-Film Elimination',
      description:
        'Comprehensive oral health maintenance utilizing ultrasonic scaling, digital plaque mapping, high-definition intraoral cameras, and laser gum therapy.',
      icon: <Sparkles className="w-6 h-6 text-[#0284C7]" />,
      duration: '45 - 60 Mins',
      recovery: 'Immediate',
      guarantee: '100% Plaque Free',
      price: '$150 - $300',
      features: ['Ultrasonic Scaling', 'Intraoral 4K Video Scan', 'Enamel Fluoride Shield', 'Oral Cancer Screening'],
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'implants',
      title: 'Robotic Dental Implants',
      category: 'Surgical Reconstruction',
      tagline: '3D Guided Surgical Titanium Tooth Placement',
      description:
        'Permanent tooth replacement engineered with surgical-grade titanium posts and custom zirconia crowns, positioned with sub-millimeter robotic navigation.',
      icon: <Zap className="w-6 h-6 text-[#00A3FF]" />,
      duration: '1 - 2 Hours',
      recovery: '2 - 3 Days',
      guarantee: 'Lifetime Warranty',
      price: '$1,800 - $3,500',
      features: ['CBCT 3D Bone Mapping', 'Navigated Surgical Guide', 'Pure Grade V Titanium', 'Same-Day Crown Option'],
      image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'rootcanal',
      title: 'Microscopic Root Canal Therapy',
      category: 'Endodontics',
      tagline: 'Laser Disinfection & Painless Bio-Sealing',
      description:
        'Preserve your natural tooth roots using high-power operating microscopes and laser sterilization to remove infected nerve tissue with zero discomfort.',
      icon: <Activity className="w-6 h-6 text-amber-500" />,
      duration: '60 - 90 Mins',
      recovery: '24 Hours',
      guarantee: 'Natural Tooth Preserved',
      price: '$850 - $1,400',
      features: ['30x Optical Microscope', 'Er:YAG Laser Disinfection', 'Hot Bioceramic Obturation', 'Painless Local Anesthesia'],
      image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'veneers',
      title: '3D Porcelain Veneers',
      category: 'Cosmetic Dentistry',
      tagline: 'Ultra-Thin VITA BL1 Ceramic Smile Makeover',
      description:
        'Architectural smile redesign featuring hand-finished 0.2mm porcelain shells tailored to match your facial features, skin tone, and golden ratio.',
      icon: <Award className="w-6 h-6 text-[#0284C7]" />,
      duration: '2 Appointments',
      recovery: 'Immediate',
      guarantee: '15-Year Porcelain Guarantee',
      price: '$1,200 / Tooth',
      features: ['Digital Smile Design Mockup', 'Zero/Minimal Enamel Shaving', 'Stain-Proof Ceramic', 'Natural Light Translucency'],
      image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'whitening',
      title: 'Laser Teeth Whitening',
      category: 'Aesthetic Brightening',
      tagline: 'Up to 8 Shades Brighter in 45 Minutes',
      description:
        'Advanced cold-laser activated peroxide gel breaks down deep intrinsic stains without damaging enamel or causing thermal tooth sensitivity.',
      icon: <Sparkles className="w-6 h-6 text-[#00A3FF]" />,
      duration: '45 Mins',
      recovery: 'Immediate',
      guarantee: '8+ Shades Brighter',
      price: '$450 - $650',
      features: ['Cold Laser Gel Activation', 'Zero Sensitivity Formula', 'Desensitizing Mineral Shield', 'Take-Home Touchup Kit'],
      image: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'orthodontics',
      title: 'Invisible Orthodontics',
      category: 'Teeth Realignment',
      tagline: 'Clear Aligners with AI Movement Telemetry',
      description:
        'Straighten crowded or gapped teeth discreetly using clear Medical Grade thermoplastic aligners generated from 3D intraoral scans.',
      icon: <ShieldAlert className="w-6 h-6 text-[#0284C7]" />,
      duration: '6 - 12 Months',
      recovery: 'None',
      guarantee: 'Perfect Bite Alignment',
      price: '$2,500 - $4,500',
      features: ['3D Scan (No Messy Impression)', 'AI Predictive Tooth Tracking', 'Removable & Removable', 'Includes Post-Retainers'],
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
    },
  ];

  const handleOpenModal = (item: TreatmentItem) => {
    soundFX.playClick();
    setSelectedTreatment(item);
  };

  const handleCloseModal = () => {
    soundFX.playClick();
    setSelectedTreatment(null);
  };

  const scrollToBooking = () => {
    handleCloseModal();
    const el = document.getElementById('booking-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="treatments-section" className="relative py-28 px-6 border-t border-slate-200/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="glass-panel px-4 py-1.5 rounded-full text-xs font-mono font-bold text-[#0284C7] tracking-widest uppercase mb-4 border border-[#0284C7]/30 shadow-sm">
            PRECISION PROCEDURES
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl leading-tight mb-4">
            Advanced Clinical Treatments
          </h2>
          <p className="text-slate-600 max-w-xl text-sm sm:text-base font-normal">
            Every procedure is planned using 3D spatial scanning and executed with surgical robotic precision.
          </p>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {treatmentData.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onMouseEnter={() => soundFX.playHover()}
              className="glass-card rounded-3xl p-6 flex flex-col justify-between group cursor-pointer border border-slate-200 hover:border-[#0284C7]/40 relative overflow-hidden shadow-lg"
              onClick={() => handleOpenModal(item)}
            >
              {/* Card Image Thumbnail */}
              <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-6">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 glass-panel px-3 py-1 rounded-full text-[10px] font-mono font-bold text-[#0284C7] border border-[#0284C7]/30">
                  {item.category}
                </div>
              </div>

              {/* Title & Tagline */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-slate-100 border border-slate-200">{item.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs font-mono font-bold text-[#00A3FF] mb-3">{item.tagline}</p>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-700">{item.price}</span>
                <span className="text-xs font-bold text-[#0284C7] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Protocol <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Detail Modal */}
      <AnimatePresence>
        {selectedTreatment && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="glass-panel-glow max-w-2xl w-full rounded-3xl p-6 sm:p-8 border border-[#0284C7]/40 relative overflow-hidden max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-6 right-6 p-2 rounded-full glass-panel text-slate-500 hover:text-slate-900 border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-[#0284C7]/15 border border-[#0284C7]/30">
                  {selectedTreatment.icon}
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-[#0284C7] uppercase tracking-wider">
                    {selectedTreatment.category}
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900">{selectedTreatment.title}</h3>
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {selectedTreatment.description}
              </p>

              {/* Key Spec Badges */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="glass-panel p-3 rounded-xl text-center border border-slate-200">
                  <Clock className="w-4 h-4 text-[#0284C7] mx-auto mb-1" />
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">Duration</span>
                  <span className="text-xs font-bold text-slate-900">{selectedTreatment.duration}</span>
                </div>
                <div className="glass-panel p-3 rounded-xl text-center border border-slate-200">
                  <Activity className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">Recovery</span>
                  <span className="text-xs font-bold text-slate-900">{selectedTreatment.recovery}</span>
                </div>
                <div className="glass-panel p-3 rounded-xl text-center border border-slate-200">
                  <Award className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">Guarantee</span>
                  <span className="text-xs font-bold text-slate-900">{selectedTreatment.guarantee}</span>
                </div>
              </div>

              {/* Procedure Highlights */}
              <div className="space-y-2 mb-8">
                <h4 className="text-xs font-mono font-bold text-[#0284C7] uppercase tracking-wider mb-2">
                  Clinical Protocol Highlights
                </h4>
                {selectedTreatment.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                    <CheckCircle className="w-4 h-4 text-[#00A3FF] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div>
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">Estimated Fee</span>
                  <span className="text-xl font-bold font-mono text-[#0284C7]">{selectedTreatment.price}</span>
                </div>
                <button
                  onClick={scrollToBooking}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#0284C7] to-[#00A3FF] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg"
                >
                  Schedule Consultation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
