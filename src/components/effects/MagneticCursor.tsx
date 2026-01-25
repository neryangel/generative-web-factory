import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'text'>('default');
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Hide on mobile/touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Detect hover states
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.closest('button, a, [role="button"]')) {
        setCursorVariant('hover');
      } else if (target.closest('h1, h2, h3, p, span')) {
        setCursorVariant('text');
      } else {
        setCursorVariant('default');
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleElementHover);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleElementHover);
    };
  }, [mouseX, mouseY]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  const variants = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: 'transparent',
      border: '2px solid hsl(var(--primary))',
      scale: 1,
    },
    hover: {
      width: 48,
      height: 48,
      backgroundColor: 'hsla(var(--primary), 0.1)',
      border: '2px solid hsl(var(--primary))',
      scale: 1,
    },
    text: {
      width: 4,
      height: 24,
      backgroundColor: 'hsl(var(--primary))',
      border: 'none',
      scale: 1,
    },
  };

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={cursorVariant}
        variants={variants}
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
        initial={false}
      />
      
      {/* Outer ring (follows with delay) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-primary/30"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: 40,
          height: 40,
          opacity: isVisible && cursorVariant !== 'text' ? 0.5 : 0,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      />

      {/* Hide default cursor */}
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
