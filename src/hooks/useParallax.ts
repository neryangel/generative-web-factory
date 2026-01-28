import { useEffect, useRef, useState } from 'react';
import type { MotionValue } from 'framer-motion';
import { useScroll, useSpring, useTransform } from 'framer-motion';

interface UseParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  springConfig?: { damping: number; stiffness: number };
  offset?: [string, string];
}

interface UseParallaxReturn {
  ref: React.RefObject<HTMLElement>;
  y: MotionValue<number>;
  x: MotionValue<number>;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
  progress: MotionValue<number>;
}

export function useParallax({
  speed = 0.5,
  direction = 'up',
  springConfig = { damping: 30, stiffness: 100 },
  offset = ['start end', 'end start'],
}: UseParallaxOptions = {}): UseParallaxReturn {
  const ref = useRef<HTMLElement>(null);
  // Reserved for future element position tracking
  const [_elementTop, _setElementTop] = useState(0);
  const [_elementHeight, _setElementHeight] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  });

  // Calculate parallax values based on direction
  const parallaxRange = 100 * speed;
  
  const yRaw = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'up' ? [parallaxRange, -parallaxRange] : 
    direction === 'down' ? [-parallaxRange, parallaxRange] : [0, 0]
  );
  
  const xRaw = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'left' ? [parallaxRange, -parallaxRange] :
    direction === 'right' ? [-parallaxRange, parallaxRange] : [0, 0]
  );

  const scaleRaw = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 1 + (speed * 0.1), 1]
  );

  const opacityRaw = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.6, 1, 1, 0.6]
  );

  // Apply spring physics for smooth motion
  const y = useSpring(yRaw, springConfig);
  const x = useSpring(xRaw, springConfig);
  const scale = useSpring(scaleRaw, springConfig);
  const opacity = useSpring(opacityRaw, springConfig);

  return {
    ref,
    y,
    x,
    scale,
    opacity,
    progress: scrollYProgress,
  };
}

// Hook for simple scroll-based opacity and transform
export function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// Hook for mouse-based parallax (for hero sections)
export function useMouseParallax(intensity = 0.02) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) * intensity;
      const y = (e.clientY - window.innerHeight / 2) * intensity;
      setPosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity]);

  return position;
}
