import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Zap, ArrowUpRight, Check, X, Award, Smile, Stethoscope, HeartHandshake } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

interface TreatmentSpec {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  recovery: string;
  durability: string;
  technology: string;
  benefits: string[];
}

export const Treatments: React.FC = () => {
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentSpec | null>(null);

  const treatmentsData: TreatmentSpec[] = [
    {
      id: 'general-family',
      name: 'General & Family Dentistry',
      category: 'Preventive Care',
      tagline: 'Comprehensive oral health for toddlers, teens, adults, and seniors.',
      description: 'Routine clinical exams, digital low-radiation X-rays, plaque scaling, fluoride varnish, and cavity prevention tailored for the entire family.',
      recovery: 'Immediate',
      durability: 'Ongoing Preventive Health',
      technology: 'Intraoral 3D HD Camera',
      benefits: ['Gentle touch for kids', 'Alberta Fee Guide pricing', 'Direct insurance billing', 'Preventive care plans'],
    },
    {
      id: 'implants',
      name: 'Dental Implants',
      category: 'Permanent Restoration',
      tagline: 'Sub-micron titanium & zirconia implants with natural bone integration.',
      description: 'Replace single, multiple, or full arches of missing teeth with bio-compatible titanium root posts and custom porcelain crowns.',
      recovery: '2-4 Days',
      durability: 'Lifetime Structural Support',
      technology: '3D CBCT Guided Robotic Surgery',
      benefits: ['Prevents bone resorption', 'Functions like real teeth', '100% natural bite force', 'Permanent aesthetic result'],
    },
    {
      id: 'cosmetic',
      name: 'Cosmetic Dentistry & Veneers',
      category: 'Aesthetic Design',
      tagline: 'Custom hand-crafted VITA porcelain veneers and smile transformations.',
      description: 'Correct chips, gaps, discoloration, and tooth shape with ultra-thin porcelain veneers designed to complement your facial structure.',
      recovery: 'Zero downtime',
      durability: '15-25+ Years',
      technology: 'Digital Smile Design (DSD)',
      benefits: ['Stain-resistant porcelain', 'Custom tooth shading', 'Non-invasive preparation', 'Radiant natural glow'],
    },
    {
      id: 'restorative',
      name: 'Restorative Care & Crowns',
      category: 'Tooth Repair',
      tagline: 'Same-day ceramic crowns, bridges, inlays, and tooth-colored composite fillings.',
      description: 'Restore broken, decayed, or weakened teeth with bio-mimetic ceramic restorations engineered to blend seamlessly with surrounding enamel.',
      recovery: '1-2 Days',
      durability: '15-20 Years',
      technology: 'CAD/CAM Chairside Milling',
      benefits: ['Mercury-free composite', 'Same-day crowns available', 'Reinforces natural tooth', 'Natural translucency'],
    },
    {
      id: 'pediatric',
      name: 'Pediatric Dentistry',
      category: 'Children’s Care',
      tagline: 'Fun, gentle, and relaxing dental experiences for young smiles.',
      description: 'Specialized dental care for infants, children, and teens with child-friendly sedation options, sealants, and early orthodontic evaluations.',
      recovery: 'Immediate',
      durability: 'Lifelong Healthy Habits',
      technology: 'Needleless Topical Anesthesia',
      benefits: ['Stress-free child visits', 'Cavity prevention sealants', 'Early alignment screening', 'Gentle hygienists'],
    },
    {
      id: 'emergency',
      name: 'Emergency Dentistry',
      category: 'Immediate Care',
      tagline: 'Same-day urgent relief for toothaches, trauma, and broken teeth.',
      description: 'Direct priority emergency dental care in Terwillegar for severe toothaches, chipped teeth, knocked-out teeth, and abscess infections.',
      recovery: 'Same-day relief',
      durability: 'Clinical Emergency Stabilization',
      technology: 'Digital Emergency Triage',
      benefits: ['Open 7 days a week', 'Immediate pain relief', 'Direct emergency phone line', 'Same-day appointments'],
    },
    {
      id: 'whitening',
      name: 'Professional Teeth Whitening',
      category: 'Cosmetic Brightening',
      tagline: 'Painless laser and in-office LED enamel whitening up to 8 shades lighter.',
      description: 'Remove deep coffee, tea, and age stains safely with professional-strength whitening gels activated by gentle LED laser light.',
      recovery: 'Zero downtime',
      durability: '1-3 Years with touchups',
      technology: 'Laser Enamel Bleaching',
      benefits: ['Up to 8 shades whiter', 'Zero sensitivity formula', '1-hour in-office session', 'Take-home custom trays'],
    },
    {
      id: 'invisalign',
      name: 'Invisalign Clear Aligners',
      category: 'Orthodontics',
      tagline: 'Discreet, removable clear aligners to straighten crooked teeth.',
      description: 'Straighten crowded teeth, close gaps, and correct bite issues without metal brackets or wires using custom 3D-printed transparent aligners.',
      recovery: 'No diet restrictions',
      durability: 'Permanent with retainers',
      technology: 'iTero 3D Digital Scanner',
      benefits: ['Virtually invisible', 'Removable for eating', 'No metal bracket cuts', 'Predictable 3D timeline'],
    },
    {
      id: 'cleanings',
      name: 'Check-Ups & Cleanings',
      category: 'Preventive Hygiene',
      tagline: 'Gentle ultrasonic scaling, airflow polish, and periodontal exams.',
      description: 'Comprehensive periodontal health exams, ultrasonic tartar removal, gentle airflow stain removal, and personalized oral health coaching.',
      recovery: 'Immediate refresh',
      durability: 'Biannual recommended',
      technology: 'Airflow Ultrasonic Scaling',
      benefits: ['Removes tough tartar', 'Freshens breath', 'Prevents gum disease', 'Smooth clean feel'],
    },
  ];

  const openModal = (treatment: TreatmentSpec) => {
    soundFX.playClick();
    setSelectedTreatment(treatment);
  };

  const closeModal = () => {
    soundFX.playClick();
    setSelectedTreatment(null);
  };

  return (
    <section id="services-section" className="relative py-28 px-6 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0284C7]/10 border border-[#0284C7]/20 text-[#0284C7] text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TERWILLEGAR CLINICAL SERVICES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Dental Services
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mt-4 font-normal">
            From routine family checkups to 3D dental implants and cosmetic smile design, experience modern dental excellence in Edmonton.
          </p>
        </div>

        {/* Treatments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {treatmentsData.map((item) => (
            <div
              key={item.id}
              onClick={() => openModal(item)}
              onMouseEnter={() => soundFX.playHover()}
              className="glass-card rounded-3xl p-8 border border-slate-200/90 hover:border-[#0284C7]/40 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-[#0284C7] bg-[#0284C7]/10 px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#0284C7] group-hover:text-white transition-colors duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors mb-2">
                  {item.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-6">
                  {item.tagline}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>TECH:</span>
                  <span className="font-semibold text-slate-800">{item.technology}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>DURABILITY:</span>
                  <span className="font-semibold text-emerald-600">{item.durability}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Spec Sheet */}
      {selectedTreatment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-mono text-[#0284C7] font-bold uppercase">{selectedTreatment.category}</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{selectedTreatment.name}</h3>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">{selectedTreatment.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-slate-100 font-mono text-xs">
              <div>
                <span className="text-slate-400 block mb-1">RECOVERY</span>
                <span className="font-bold text-slate-800">{selectedTreatment.recovery}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">DURABILITY</span>
                <span className="font-bold text-emerald-600">{selectedTreatment.durability}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">TECHNOLOGY</span>
                <span className="font-bold text-[#0284C7]">{selectedTreatment.technology}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono text-slate-900 font-bold uppercase">Clinical Advantages:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedTreatment.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={closeModal}
              className="w-full py-3 bg-[#0284C7] hover:bg-[#00A3FF] text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all"
            >
              Close Specifications
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
