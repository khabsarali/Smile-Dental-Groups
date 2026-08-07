import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a') || target.classList.contains('cursor-pointer'))) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null; // Disable on touch mobile
  }

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Outer Cyan Precision Halo */}
      <motion.div
        animate={{
          x: pos.x - (isHovering ? 28 : 16),
          y: pos.y - (isHovering ? 28 : 16),
          scale: isHovering ? 1.5 : 1,
          borderColor: isHovering ? 'rgba(0, 163, 255, 0.8)' : 'rgba(2, 132, 199, 0.4)',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        className="w-8 h-8 rounded-full border border-[#00A3FF]/40 absolute backdrop-blur-[1px]"
      />

      {/* Inner Glowing Blue Dot */}
      <motion.div
        animate={{
          x: pos.x - 3,
          y: pos.y - 3,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 800, damping: 35 }}
        className="w-1.5 h-1.5 rounded-full bg-[#00A3FF] absolute shadow-[0_0_10px_#00A3FF]"
      />
    </div>
  );
};
