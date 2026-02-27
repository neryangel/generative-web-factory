import type { Variants} from 'framer-motion';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SplitTextProps {
  children: string;
  className?: string;
  variant?: 'chars' | 'words' | 'lines';
  staggerDelay?: number;
  initialDelay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

const charVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    rotateX: -90,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.03,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

const wordVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    filter: 'blur(10px)',
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      delay: i * 0.08,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

const lineVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: '100%',
    skewY: 7,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: '0%',
    skewY: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.15,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

export function SplitText({
  children,
  className = '',
  variant = 'words',
  initialDelay = 0,
  as = 'div',
}: SplitTextProps) {
  const prefersReducedMotion = useReducedMotion();

  // Fallback for reduced motion
  if (prefersReducedMotion) {
    const _Tag = as; // Reserved for future use with dynamic tag rendering
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: initialDelay }}
      >
        {children}
      </motion.div>
    );
  }

  const renderContent = () => {
    if (variant === 'chars') {
      return children.split('').map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={charVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="inline-block"
          style={{ 
            whiteSpace: char === ' ' ? 'pre' : 'normal',
            perspective: '1000px',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ));
    }

    if (variant === 'words') {
      return children.split(' ').map((word, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={wordVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="inline-block me-[0.25em]"
        >
          {word}
        </motion.span>
      ));
    }

    if (variant === 'lines') {
      return children.split('\n').map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            custom={i}
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="block"
          >
            {line}
          </motion.span>
        </span>
      ));
    }

    return children;
  };

  // Use a simple wrapper div instead of dynamic motion component
  return (
    <div className={className}>
      {renderContent()}
    </div>
  );
}

interface WordRevealProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  delay?: number;
}

export function WordReveal({ children, className = '', delay = 0 }: WordRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const words = children.split(' ');

  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>;
  }
  
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ marginInlineEnd: '0.25em' }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: '100%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.1,
              ease: [0.215, 0.61, 0.355, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

interface LineRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function LineReveal({ children, className = '', delay = 0 }: LineRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '100%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.215, 0.61, 0.355, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
