import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Phone, Mail, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { soundFX } from '../../ui/SoundEffects';

export const AppointmentBooking: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    treatment: '3D Porcelain Veneers',
    doctor: 'Dr. Marcus Vance (Chief Surgeon)',
    preferredDate: '',
    preferredTime: '10:00 AM',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playClick();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.preferredDate) {
      setErrorMsg('Please fill in all required fields (Name, Email, Phone, & Preferred Date).');
      return;
    }

    setIsSubmitting(true);

    // Simulate high-tech API processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      soundFX.playScanBeep();
    }, 1200);
  };

  return (
    <section id="booking-section" className="relative py-28 px-6 bg-[#05070A] overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4FC3F7]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="glass-panel px-4 py-1.5 rounded-full text-xs font-mono text-[#4FC3F7] tracking-widest uppercase mb-4 border border-[#4FC3F7]/30 shadow-[0_0_15px_rgba(79,195,247,0.15)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> RESERVATION PORTAL
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl leading-tight mb-4">
            Book Your Transformation
          </h2>
          <p className="text-slate-400 max-w-lg text-sm sm:text-base font-normal">
            Schedule a 3D diagnostic evaluation with our master dental surgical team.
          </p>
        </div>

        {/* Booking Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-panel-glow p-8 sm:p-12 rounded-3xl border border-[#4FC3F7]/30 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative"
        >
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#4FC3F7]" /> Patient Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Victoria Vance"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#4FC3F7] focus:ring-1 focus:ring-[#4FC3F7] transition-all text-sm"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-2 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#4FC3F7]" /> Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. victoria@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#4FC3F7] focus:ring-1 focus:ring-[#4FC3F7] transition-all text-sm"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#4FC3F7]" /> Direct Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +1 (555) 019-2834"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#4FC3F7] focus:ring-1 focus:ring-[#4FC3F7] transition-all text-sm"
                />
              </div>

              {/* Treatment Choice */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" /> Select Treatment
                </label>
                <select
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white focus:outline-none focus:border-[#4FC3F7] transition-all text-sm"
                >
                  <option value="3D Porcelain Veneers">3D Porcelain Veneers</option>
                  <option value="Robotic Dental Implants">Robotic Dental Implants</option>
                  <option value="Microscopic Root Canal">Microscopic Root Canal</option>
                  <option value="Laser Teeth Whitening">Laser Teeth Whitening</option>
                  <option value="Invisible Orthodontics">Invisible Orthodontics</option>
                  <option value="Full Comprehensive Exam">Full Comprehensive 3D Exam</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#4FC3F7]" /> Preferred Date *
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white focus:outline-none focus:border-[#4FC3F7] transition-all text-sm"
                />
              </div>

              {/* Preferred Time */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#4FC3F7]" /> Preferred Slot
                </label>
                <select
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white focus:outline-none focus:border-[#4FC3F7] transition-all text-sm"
                >
                  <option value="09:00 AM">09:00 AM (Morning)</option>
                  <option value="11:30 AM">11:30 AM (Midday)</option>
                  <option value="02:00 PM">02:00 PM (Afternoon)</option>
                  <option value="04:30 PM">04:30 PM (Evening)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                onMouseEnter={() => soundFX.playHover()}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#4FC3F7] via-[#00E5FF] to-[#4FC3F7] text-slate-950 font-extrabold text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(79,195,247,0.5)] hover:shadow-[0_0_45px_rgba(79,195,247,0.8)] hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">CONFIRMING APPOINTMENT TELEMETRY...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>CONFIRM APPOINTMENT RESERVATION</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Success Modal Confirmation */}
      <AnimatePresence>
        {isSuccess && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="glass-panel-glow max-w-md w-full rounded-3xl p-8 text-center border border-[#00E5FF]/50 shadow-[0_0_50px_rgba(0,229,255,0.3)]"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(52,211,153,0.4)]">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-2">Reservation Confirmed!</h3>
              <p className="text-xs font-mono text-[#00E5FF] uppercase mb-4 tracking-wider">
                CONFIRMATION ID: #SDG-2026-X89
              </p>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Thank you, <strong className="text-white">{formData.fullName}</strong>. Your 3D diagnostic consultation has been scheduled for <strong className="text-[#4FC3F7]">{formData.preferredDate} at {formData.preferredTime}</strong> with {formData.doctor}.
              </p>

              <button
                onClick={() => setIsSuccess(false)}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#4FC3F7] to-[#00E5FF] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg"
              >
                Close Confirmation
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
