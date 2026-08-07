import React from 'react';
import { Sparkles, Award, GraduationCap, CheckCircle2 } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const OurTeam: React.FC = () => {
  const doctors = [
    {
      name: 'Dr. Alexander Vance, DDS, FAGD',
      role: 'Master Cosmetic Dental Surgeon',
      credentials: 'Harvard School of Dental Medicine // AACD Accredited Fellow',
      bio: 'Pioneered robotic 3D smile design protocols with over 18 years of surgical mastery in full-arch porcelain rehabilitation.',
      specialties: ['Porcelain Veneers', 'Full-Mouth Reconstruction', 'Digital Smile Design'],
    },
    {
      name: 'Dr. Elena Rostova, DMD, MS',
      role: 'Lead Specialist Orthodontist',
      credentials: 'University of Pennsylvania // Diamond Plus Invisalign Provider',
      bio: 'Specializing in accelerated clear aligner therapy, complex adult malocclusions, and non-surgical facial arch widening.',
      specialties: ['SmartTrack Aligners', 'Airway Orthodontics', 'Surgical Skeletal Guidance'],
    },
    {
      name: 'Dr. Marcus Sterling, DDS, MS',
      role: 'Oral & Maxillofacial Implantologist',
      credentials: 'Columbia University Medical Center // ICOI Diplomate',
      bio: 'Expert in immediate-load dental implants, computer-guided bone regeneration, and microscopic nerve sparing surgery.',
      specialties: ['All-on-4 / All-on-6', 'Sinus Lift Surgery', 'Zirconia Implants'],
    },
  ];

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0284C7]/15 border border-[#0284C7]/30 text-[#38BDF8] text-xs font-mono font-bold tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>BOARD-CERTIFIED FACULTY</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          World-Renowned Smile Architects
        </h2>
        <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
          Every procedure is meticulously planned and performed by internationally acclaimed clinicians dedicated to surgical excellence.
        </p>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {doctors.map((doc, idx) => (
          <div
            key={idx}
            onMouseEnter={() => soundFX.playHover()}
            className="p-8 rounded-3xl bg-slate-50/90 border border-slate-200 hover:border-[#0284C7]/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#00A3FF] flex items-center justify-center text-white font-black text-xl shadow-md">
                {doc.name.split(' ')[1][0]}
                {doc.name.split(' ')[2] ? doc.name.split(' ')[2][0] : ''}
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                  {doc.name}
                </h3>
                <span className="text-xs font-mono font-semibold text-[#0284C7] block mt-0.5">
                  {doc.role}
                </span>
                <span className="text-[11px] font-mono text-slate-500 block mt-1">
                  {doc.credentials}
                </span>
              </div>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal pt-2 border-t border-slate-200">
                {doc.bio}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 space-y-1.5">
              {doc.specialties.map((spec, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
