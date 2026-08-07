import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Calendar, CheckCircle2, Send } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Dental Cleaning & Check-Up',
    date: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playClick();
    setSubmitted(true);
  };

  return (
    <section id="contact-section" className="relative py-28 px-6 bg-white border-t border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-mono text-[#0284C7] uppercase tracking-widest font-bold mb-2">
            TERWILLEGAR DENTAL PRACTICE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Book an Appointment & Contact Us
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mt-3 font-normal">
            Visit our modern clinic in Edmonton or reserve your appointment online. Open 7 days a week.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Direct Info & Location Map */}
          <div className="space-y-8">
            <div className="glass-card p-8 rounded-3xl border border-slate-200/80 space-y-6">
              <h3 className="text-xl font-extrabold text-slate-900 mb-4">Clinic Location & Hours</h3>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0284C7]/10 border border-[#0284C7]/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#0284C7]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Address</h4>
                  <p className="text-xs sm:text-sm text-slate-600">2408 Rabbit Hill Rd NW, Edmonton, AB</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0284C7]/10 border border-[#0284C7]/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#0284C7]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Phone</h4>
                  <a href="tel:7804301336" className="text-xs sm:text-sm font-bold text-[#0284C7] hover:underline">
                    780-430-1336
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0284C7]/10 border border-[#0284C7]/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#0284C7]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Email</h4>
                  <a href="mailto:info@HomeOfSmiles.ca" className="text-xs sm:text-sm text-slate-600 hover:text-[#0284C7]">
                    info@HomeOfSmiles.ca
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Business Hours</h4>
                  <p className="text-xs sm:text-sm text-slate-600">Open 7 Days a Week • Emergency Dentistry Available</p>
                </div>
              </div>
            </div>

            {/* Google Map Embed for 2408 Rabbit Hill Rd NW, Edmonton */}
            <div className="glass-card p-3 rounded-3xl border border-slate-200/80 overflow-hidden h-64 relative bg-slate-100 flex items-center justify-center">
              <iframe
                title="Home of Smiles Dental Map"
                src="https://maps.google.com/maps?q=2408%20Rabbit%20Hill%20Rd%20NW,%20Edmonton,%20AB&t=&z=15&ie=UTF8&iwloc=&output=embed"
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
                <h3 className="text-2xl font-bold text-slate-900">Appointment Request Received</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                  Thank you, <span className="font-semibold text-slate-900">{formData.name}</span>. Our reception team in Terwillegar will call you at {formData.phone} shortly to confirm your booking.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 bg-[#0284C7] text-white px-6 py-2.5 rounded-full text-xs font-bold"
                >
                  Book Another Visit
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#0284C7]" />
                  <span>Reserve Your Visit</span>
                </h3>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="780-000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">Service Needed</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#0284C7]"
                    >
                      <option>Dental Cleaning & Check-Up</option>
                      <option>Teeth Whitening</option>
                      <option>Dental Implants</option>
                      <option>Invisalign Aligners</option>
                      <option>Porcelain Veneers</option>
                      <option>Crowns & Bridges</option>
                      <option>Pediatric Care</option>
                      <option>Emergency Care</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">Preferred Date</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">Message / Notes (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Tell us about any symptoms or dental goals..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                <button
                  type="submit"
                  onMouseEnter={() => soundFX.playHover()}
                  className="w-full py-3.5 bg-[#0284C7] hover:bg-[#00A3FF] text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg shadow-[#0284C7]/25 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm Appointment Booking</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
