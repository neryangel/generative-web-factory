import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function MagneticCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover'>('default');
  // Start with null to avoid hydration mismatch - will be set in useEffect
  const [isTouchDevice, setIsTouchDevice] = useState<boolean | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Stiffer spring so the ring stays closer to the real cursor
  const springConfig = { damping: 30, stiffness: 500 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect touch device only on client side to avoid hydration mismatch
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);

    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Detect hover states for interactive elements only
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest('button, a, [role="button"], input, textarea, select, .cursor-pointer')) {
        setCursorVariant('hover');
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

  // Don't render until we know if it's a touch device (avoids hydration mismatch)
  // Also don't render on touch devices
  if (isTouchDevice === null || isTouchDevice) {
    return null;
  }

  return (
    /* Subtle accent ring that follows cursor — native cursor stays visible */
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
        borderStyle: 'solid',
        borderColor: 'hsl(var(--primary))',
        backgroundColor: cursorVariant === 'hover' ? 'hsla(var(--primary), 0.06)' : 'transparent',
      }}
      animate={{
        width: cursorVariant === 'hover' ? 44 : 28,
        height: cursorVariant === 'hover' ? 44 : 28,
        opacity: isVisible ? (cursorVariant === 'hover' ? 0.55 : 0.3) : 0,
        borderWidth: cursorVariant === 'hover' ? 2 : 1.5,
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 400 }}
      initial={false}
    />
  );
}
