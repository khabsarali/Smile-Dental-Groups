import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '3D Porcelain Veneers',
    date: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playClick();
    setSubmitted(true);
  };

  return (
    <section id="contact-section" className="relative py-28 px-6 bg-[#F8FAFC]/80 backdrop-blur-xl border-t border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-mono text-[#0284C7] uppercase tracking-widest font-bold mb-2">
            DIRECT CONCIERGE ACCESS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Contact Us & Reserve Appointment
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mt-3 font-normal">
            Visit our state-of-the-art practice on Fifth Avenue or request a 3D digital consultation online.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Direct Info & Location Map */}
          <div className="space-y-8">
            <div className="glass-card p-8 rounded-3xl border border-slate-200/80 space-y-6">
              <h3 className="text-xl font-extrabold text-slate-900 mb-4">Practice Location</h3>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0284C7]/10 border border-[#0284C7]/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#0284C7]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Manhattan Flagship</h4>
                  <p className="text-xs sm:text-sm text-slate-600">740 Fifth Avenue, 18th Floor, New York, NY 10019</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0284C7]/10 border border-[#0284C7]/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#0284C7]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Direct Phone</h4>
                  <p className="text-xs sm:text-sm text-slate-600">+1 (800) 555-SMILE</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0284C7]/10 border border-[#0284C7]/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#0284C7]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Concierge Email</h4>
                  <p className="text-xs sm:text-sm text-slate-600">concierge@smiledentalgroups.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Clinical Hours</h4>
                  <p className="text-xs sm:text-sm text-slate-600">Mon - Sat: 8:00 AM - 8:00 PM • Sun: By Appointment</p>
                </div>
              </div>
            </div>

            {/* Google Map Preview Card */}
            <div className="glass-card p-4 rounded-3xl border border-slate-200/80 overflow-hidden h-64 relative bg-slate-100 flex items-center justify-center">
              <iframe
                title="Location Map"
                src="https://maps.google.com/maps?q=740%20Fifth%20Avenue,%20New%20York&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full rounded-2xl border-0"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column: Appointment Form */}
          <div className="glass-panel-glow p-8 sm:p-10 rounded-3xl border border-[#0284C7]/20 shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Consultation Confirmed</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                  Thank you, <span className="font-semibold text-slate-900">{formData.name}</span>. Our concierge team will reach out within 2 hours to confirm your appointment time.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 bg-[#0284C7] text-white px-6 py-2.5 rounded-full text-xs font-bold"
                >
                  Book Another Reservation
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#0284C7]" />
                  <span>Online Reservation</span>
                </h3>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Jane Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-2">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-2">Select Procedure</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#0284C7]"
                  >
                    <option>3D Porcelain Veneers</option>
                    <option>Sub-Micron Robotic Implants</option>
                    <option>Painless Laser Whitening</option>
                    <option>Full-Jaw Smile Restoration</option>
                    <option>Clear Aligner Orthodontics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-2">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                <button
                  type="submit"
                  onMouseEnter={() => soundFX.playHover()}
                  className="w-full py-4 bg-[#0284C7] hover:bg-[#00A3FF] text-white font-bold text-sm tracking-wider uppercase rounded-xl shadow-lg shadow-[#0284C7]/25 transition-all mt-4"
                >
                  Confirm Reservation Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
