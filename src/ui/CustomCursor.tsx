import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = target.closest('button, a, input, select, textarea, [role="button"], .interactive');
        setIsPointer(!!isClickable);
      }
    };

    const handleMouseDown = () => setIsHovered(true);
    const handleMouseUp = () => setIsHovered(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Hide default cursor on desktop
  useEffect(() => {
    if (window.innerWidth > 768) {
      document.body.style.cursor = 'default';
    }
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden hidden md:block">
      {/* Outer Laser Ring */}
      <motion.div
        className="absolute rounded-full border border-[#4FC3F7]/50 shadow-[0_0_15px_rgba(79,195,247,0.3)]"
        animate={{
          x: mousePos.x - (isPointer ? 24 : 16),
          y: mousePos.y - (isPointer ? 24 : 16),
          width: isPointer ? 48 : 32,
          height: isPointer ? 48 : 32,
          scale: isHovered ? 0.8 : 1,
          backgroundColor: isPointer ? 'rgba(79, 195, 247, 0.08)' : 'transparent',
          borderColor: isPointer ? 'rgba(0, 229, 255, 0.8)' : 'rgba(79, 195, 247, 0.4)',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25, mass: 0.2 }}
      />

      {/* Inner Precision Laser Dot */}
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]"
        animate={{
          x: mousePos.x - 4,
          y: mousePos.y - 4,
          scale: isHovered ? 1.8 : isPointer ? 1.4 : 1,
        }}
        transition={{ type: 'spring', stiffness: 800, damping: 30, mass: 0.1 }}
      />
    </div>
  );
};
