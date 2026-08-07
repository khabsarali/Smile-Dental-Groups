import React from 'react';
import { Award, GraduationCap, Sparkles, Stethoscope, Heart } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const OurTeam: React.FC = () => {
  const teamMembers = [
    {
      name: 'Dr. Michael Vance, DMD',
      role: 'Principal Dentist & Implantologist',
      credentials: 'Harvard School of Dental Medicine • AAID Fellow',
      bio: 'Over 16 years of clinical mastery in 3D robotic implant reconstruction, bone grafting, and complex full-mouth aesthetic smile redesign.',
      specialties: ['Robotic Implants', 'Full-Mouth Reconstruction', 'Sedation Care'],
    },
    {
      name: 'Dr. Sarah Lin, DDS',
      role: 'Cosmetic Dentist & Veneer Specialist',
      credentials: 'University of Alberta Dental School • AACD Member',
      bio: 'Passionate about digital smile design and ultra-thin porcelain veneers, creating harmonious and natural smiles for Edmonton families.',
      specialties: ['Porcelain Veneers', 'Invisalign Certified', 'Laser Whitening'],
    },
    {
      name: 'Dr. David Kowalski, DDS',
      role: 'Restorative & Emergency Dentist',
      credentials: 'UBC Faculty of Dentistry • Urgent Dental Specialist',
      bio: 'Dedicated to same-day emergency relief, root canal therapy, and bio-mimetic ceramic restorations with gentle, patient-focused care.',
      specialties: ['Emergency Care', 'Endodontics', 'Crowns & Bridges'],
    },
    {
      name: 'Elena Rostova, RDH',
      role: 'Lead Dental Hygienist',
      credentials: 'Canadian Dental Hygienists Association',
      bio: 'Specializing in ultrasonic periodontal therapy, airflow stain polishing, and gentle preventive care for children and adults.',
      specialties: ['Periodontal Therapy', 'Airflow Polish', 'Pediatric Hygiene'],
    },
  ];

  return (
    <section id="team-section" className="relative py-28 px-6 bg-white border-t border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0284C7]/10 border border-[#0284C7]/20 text-[#0284C7] text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CLINICAL EXCELLENCE IN TERWILLEGAR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Meet Our Experienced Team
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mt-4 font-normal">
            Compassionate dentists, certified specialists, and caring hygienists dedicated to your comfort and long-term oral health.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              onMouseEnter={() => soundFX.playHover()}
              className="glass-card rounded-3xl p-6 border border-slate-200/80 hover:border-[#0284C7]/40 flex flex-col justify-between group transition-all"
            >
              <div>
                {/* Avatar Icon / Graphic */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0284C7]/20 to-[#00A3FF]/10 border border-[#0284C7]/30 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Stethoscope className="w-8 h-8 text-[#0284C7]" />
                </div>

                <span className="text-xs font-mono font-bold text-[#0284C7] uppercase block mb-1">
                  {member.role}
                </span>

                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#0284C7] transition-colors">
                  {member.name}
                </h3>

                <p className="text-xs font-mono text-slate-500 mb-4 pb-3 border-b border-slate-100">
                  {member.credentials}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-6">
                  {member.bio}
                </p>
              </div>

              {/* Specialties Tag Cloud */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                {member.specialties.map((spec, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
