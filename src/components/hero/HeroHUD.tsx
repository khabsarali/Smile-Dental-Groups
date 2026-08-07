import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity, Scan, Zap, ShieldCheck, Smile, ChevronDown } from 'lucide-react';

interface HeroHUDProps {
  scrollProgress: number;
  currentStage: number;
}

export const HeroHUD: React.FC<HeroHUDProps> = ({ scrollProgress, currentStage }) => {
  const stagesInfo = [
    {
      stage: 1,
      tag: 'STAGE 01 // INITIAL PATHOLOGY',
      icon: <Activity className="w-4 h-4 text-rose-400" />,
      title: 'Structural Enamel Decay & Misalignment',
      desc: 'High-resolution visualization of dental damage, cavity formation, crooked bite alignment, and periodontal inflammation.',
      specs: [
        { label: 'Erosion Depth', val: '1.8 mm' },
        { label: 'Crooked Offset', val: '+14.2°' },
        { label: 'Bite Harmony', val: 'Compromised' },
      ],
      color: 'from-rose-500/20 to-orange-500/20',
      border: 'border-rose-500/30',
      badge: 'bg-rose-500/10 text-rose-300',
    },
    {
      stage: 2,
      tag: 'STAGE 02 // 3D CBCT DIAGNOSTICS',
      icon: <Scan className="w-4 h-4 text-[#00A3FF]" />,
      title: 'Sub-Surface Root & Nerve Mapping',
      desc: 'Low-radiation holographic tomography reveals bone density, nerve canals, and hidden sub-enamel root decay.',
      specs: [
        { label: 'CBCT Voxel Size', val: '75 μm' },
        { label: 'Root Status', val: '3D Mapped' },
        { label: 'Bone Quality', val: 'Type II Dense' },
      ],
      color: 'from-[#0284C7]/20 to-[#00A3FF]/20',
      border: 'border-[#00A3FF]/40',
      badge: 'bg-[#00A3FF]/10 text-[#38BDF8]',
    },
    {
      stage: 3,
      tag: 'STAGE 03 // LASER & ORTHODONTICS',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      title: 'Robotic Laser Sterilization & Braces Alignment',
      desc: 'Painless Er:YAG laser sterilization removes micro-decay while clear archwires guide teeth into ideal parabolic alignment.',
      specs: [
        { label: 'Laser Wavelength', val: '2,940 nm' },
        { label: 'Traction Force', val: '0.25 N Gentle' },
        { label: 'Archwire Phase', val: 'Active Guidance' },
      ],
      color: 'from-amber-500/20 to-yellow-500/20',
      border: 'border-amber-500/40',
      badge: 'bg-amber-500/10 text-amber-300',
    },
    {
      stage: 4,
      tag: 'STAGE 04 // BIOMIMETIC RESTORATION',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      title: 'Healthy Porcelain Enamel & Gingival Harmony',
      desc: 'VITA BL1 lithium disilicate veneers restore flawless bite dynamics, healthy pink gum margins, and diamond specular luster.',
      specs: [
        { label: 'Porcelain Shade', val: 'VITA BL1 White' },
        { label: 'Ceramic Matrix', val: 'Lithium Disilicate' },
        { label: 'Occlusion', val: '100% Symmetrical' },
      ],
      color: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/40',
      badge: 'bg-emerald-500/10 text-emerald-300',
    },
    {
      stage: 5,
      tag: 'STAGE 05 // AESTHETIC SMILE REVEAL',
      icon: <Smile className="w-4 h-4 text-cyan-300" />,
      title: 'Complete Facial Harmony & Natural Smile',
      desc: 'The restored 3D jaw integrates seamlessly into the patient’s facial architecture, ending in a confident, radiant smile.',
      specs: [
        { label: 'Symmetry Ratio', val: '99.8% Golden Arc' },
        { label: 'Smile Line', val: 'Ideal Curvature' },
        { label: 'Confidence', val: 'Permanent' },
      ],
      color: 'from-[#0284C7]/30 to-purple-500/20',
      border: 'border-cyan-400/40',
      badge: 'bg-cyan-500/10 text-cyan-300',
    },
  ];

  const currentInfo = stagesInfo[Math.max(0, Math.min(stagesInfo.length - 1, currentStage - 1))];

  return (
    <div className="fixed inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 sm:p-10 select-none">
      {/* Top Floating Cinematic Progress Bar */}
      <div className="w-full max-w-xl mx-auto">
        <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-2xl bg-slate-950/60 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A3FF] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00A3FF]" />
            </span>
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-200">
              3D CINEMATIC TIMELINE
            </span>
          </div>

          {/* 5 Stage Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  currentStage === s
                    ? 'w-6 sm:w-8 bg-[#00A3FF] shadow-[0_0_10px_#00A3FF]'
                    : currentStage > s
                    ? 'w-2 sm:w-2.5 bg-slate-400'
                    : 'w-2 sm:w-2.5 bg-slate-700'
                }`}
              />
            ))}
          </div>

          <span className="text-xs font-mono font-bold text-[#00A3FF]">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>

      {/* Floating Lower HUD Clinical Telemetry Card */}
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={`glass-panel p-5 sm:p-6 rounded-3xl border ${currentInfo.border} shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl bg-slate-950/75 text-white space-y-4`}
          >
            {/* Header Stage Badge */}
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${currentInfo.badge}`}>
                {currentInfo.icon}
                {currentInfo.tag}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                FRAME {Math.min(150, Math.max(1, Math.round(scrollProgress * 149) + 1))} / 150
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-1">
                {currentInfo.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                {currentInfo.desc}
              </p>
            </div>

            {/* Live Clinical Metric Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
              {currentInfo.specs.map((sp, idx) => (
                <div key={idx} className="bg-white/5 rounded-xl p-2 border border-white/10 text-center">
                  <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-tight">
                    {sp.label}
                  </span>
                  <span className="text-xs font-bold text-[#38BDF8] truncate block">
                    {sp.val}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Scroll Prompt Hint */}
      <div className="w-full flex items-center justify-center pb-2">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/50 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-300"
        >
          <span>Scroll to explore treatment transformation</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#00A3FF]" />
        </motion.div>
      </div>
    </div>
  );
};
