import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  reverse?: boolean; // Alias for direction='right'
  pauseOnHover?: boolean;
  className?: string;
  repeat?: number;
}

export function Marquee({
  children,
  speed = 10,
  direction = 'left',
  reverse = false,
  pauseOnHover = true,
  className = '',
  repeat = 4,
}: MarqueeProps) {
  const prefersReducedMotion = useReducedMotion();

  // Slower, more professional animation (speed=10 → 60s loop)
  const duration = 600 / speed;
  // reverse prop is an alias for direction='right'
  const actualDirection = reverse ? 'right' : direction;
  const directionMultiplier = actualDirection === 'left' ? -1 : 1;

  if (prefersReducedMotion) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <div className="flex gap-8">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`overflow-hidden ${className}`}
      style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
    >
      <motion.div
        className="flex gap-8 w-fit"
        animate={{
          x: [0, directionMultiplier * -50 + '%'],
        }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear',
        }}
        whileHover={pauseOnHover ? { animationPlayState: 'paused' } : undefined}
        style={{ animationPlayState: pauseOnHover ? undefined : 'running' }}
      >
        {/* Duplicate children for seamless loop */}
        {Array.from({ length: repeat }).map((_, i) => (
          <div key={i} className="flex gap-8 shrink-0">
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

interface TextMarqueeProps {
  text: string;
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  textClassName?: string;
  separator?: ReactNode;
}

export function TextMarquee({
  text,
  speed = 20,
  direction = 'left',
  className = '',
  textClassName = '',
  separator = <span className="mx-8 text-primary">✦</span>,
}: TextMarqueeProps) {
  const items = Array(8).fill(text);

  return (
    <Marquee speed={speed} direction={direction} className={className}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className={`whitespace-nowrap ${textClassName}`}>{item}</span>
          {separator}
        </span>
      ))}
    </Marquee>
  );
}

interface LogoMarqueeProps {
  logos: Array<{ src: string; alt: string; href?: string }>;
  speed?: number;
  className?: string;
}

export function LogoMarquee({ logos, speed = 25, className = '' }: LogoMarqueeProps) {
  return (
    <Marquee speed={speed} className={className} pauseOnHover>
      {logos.map((logo, i) => (
        <div
          key={i}
          className="flex items-center justify-center px-8 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300"
        >
          {logo.href ? (
            <a href={logo.href} target="_blank" rel="noopener noreferrer">
              <img src={logo.src} alt={logo.alt} className="h-8 md:h-12 w-auto" />
            </a>
          ) : (
            <img src={logo.src} alt={logo.alt} className="h-8 md:h-12 w-auto" />
          )}
        </div>
      ))}
    </Marquee>
  );
}
