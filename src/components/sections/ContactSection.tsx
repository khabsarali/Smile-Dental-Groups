import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, Phone, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('Porcelain Veneers & Smile Makeover');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playSuccess();
    setSubmitted(true);
  };

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0284C7]/15 border border-[#0284C7]/30 text-[#38BDF8] text-xs font-mono font-bold tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>VIP PRIVATE CONSULTATION</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Reserve Your 3D Smile Consultation
        </h2>
        <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
          Meet with our board-certified cosmetic surgeons for full-arch 3D holographic scans and a personalized treatment roadmap.
        </p>
      </div>

      {/* Booking Form + Info Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
        {/* Left Interactive Form */}
        <div className="lg:col-span-7 p-8 rounded-3xl bg-slate-50/90 border border-slate-200 shadow-xl flex flex-col justify-between">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Consultation Confirmed</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you, {name || 'Patient'}. Our executive concierge will contact you within 2 business hours to finalize your appointment schedule.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold font-mono text-slate-700 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Victoria Sterling"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-mono text-slate-700 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="victoria@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-mono text-slate-700 uppercase mb-1">
                  Desired Treatment
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none text-sm bg-white"
                >
                  <option>Porcelain Veneers & Smile Makeover</option>
                  <option>Full-Arch Dental Implants (All-on-4)</option>
                  <option>Invisible Orthodontic Aligners</option>
                  <option>Laser Teeth Whitening</option>
                  <option>Comprehensive Dental Checkup</option>
                </select>
              </div>

              <button
                type="submit"
                onMouseEnter={() => soundFX.playHover()}
                className="glass-button w-full py-3.5 px-6 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Confirm VIP Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Right Penthouse Details */}
        <div className="lg:col-span-5 p-8 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">
              Private Penthouse Suite
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#00A3FF] shrink-0 mt-0.5" />
                <span>740 Park Avenue, Penthouse Level, New York, NY 10021</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#00A3FF] shrink-0" />
                <span>(800) 555-SMILE / (212) 555-0199</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#00A3FF] shrink-0" />
                <span>Monday – Saturday: 8:00 AM – 7:00 PM</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-slate-400">
            Complimentary private valet parking and luxury chauffeur transfers available upon reservation.
          </div>
        </div>
      </div>
    </div>
  );
};
