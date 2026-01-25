import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}

// Animation variants for different effects
export const animationVariants = {
  fadeIn: 'opacity-0 translate-y-0',
  fadeInUp: 'opacity-0 translate-y-8',
  fadeInDown: 'opacity-0 -translate-y-8',
  fadeInLeft: 'opacity-0 translate-x-8',
  fadeInRight: 'opacity-0 -translate-x-8',
  scaleIn: 'opacity-0 scale-95',
  visible: 'opacity-100 translate-y-0 translate-x-0 scale-100',
};

export function getAnimationClasses(isVisible: boolean, variant: keyof typeof animationVariants = 'fadeInUp') {
  return `transition-all duration-700 ease-out ${isVisible ? animationVariants.visible : animationVariants[variant]}`;
}

// Stagger delay helper
export function getStaggerDelay(index: number, baseDelay: number = 100) {
  return { transitionDelay: `${index * baseDelay}ms` };
}
