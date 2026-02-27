import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface PreloaderProps {
  onComplete?: () => void;
  minDuration?: number;
}

export function Preloader({ onComplete, minDuration = 2000 }: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    let rafId: number;
    let currentProgress = 0;

    // Animate loading progress with requestAnimationFrame
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const targetProgress = Math.min((elapsed / minDuration) * 100, 100);
      currentProgress = currentProgress + (targetProgress - currentProgress) * 0.1;
      const clampedProgress = Math.min(currentProgress, 100);
      setProgress(clampedProgress);

      if (elapsed < minDuration) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);

    // Complete after minimum duration
    const timeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        onComplete?.();
      }, 500);
    }, minDuration);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeout);
    };
  }, [minDuration, onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
          }}
        >
          {/* Logo reveal */}
          <motion.div
            className="relative mb-12"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
          >
            <motion.div
              className="text-4xl md:text-6xl font-serif gold-text"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0% 0 0)' }}
              transition={{ duration: 1, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
            >
              AMDIR
            </motion.div>
            
            {/* Decorative line */}
            <motion.div
              className="absolute -bottom-4 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.76, 0, 0.24, 1] }}
            />
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 md:w-64 h-[2px] bg-primary/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-primary to-primary/50"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Progress number */}
          <motion.div
            className="mt-6 text-sm font-mono text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(progress)}%
          </motion.div>

          {/* Decorative orbs */}
          <motion.div
            className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
