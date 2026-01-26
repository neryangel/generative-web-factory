'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const router = useRouter();

  const benefits = [
    'ללא כרטיס אשראי',
    'התחילו תוך 30 שניות',
    'ביטול בכל עת',
  ];

  const navigateToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <section
      id="pricing"
      ref={sectionRef}
      dir="rtl"
      className="relative py-24 overflow-hidden"
    >
      {/* Animated Background Orbs */}
      <motion.div
        className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0]
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Decorative Lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        viewBox="0 0 1200 400"
      >
        <motion.path
          d="M0 200 Q 300 50, 600 200 T 1200 200"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M0 220 Q 300 70, 600 220 T 1200 220"
          stroke="hsl(var(--primary))"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
        />
      </svg>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">הצטרפו עכשיו</span>
            </motion.div>
          </motion.div>

          {/* Headline */}
          <motion.h2
            className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            מוכנים <span className="gold-text">להתחיל?</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-10"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            הצטרפו לאלפי העסקים שכבר בנו את הנוכחות הדיגיטלית שלהם עם AMDIR
          </motion.p>

          {/* CTA Button */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                onClick={navigateToDashboard}
                className="relative px-12 py-7 text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-3">
                  התחילו בחינם עכשיו
                  <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                </span>

                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                  animate={{ translateX: ["100%", "-100%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
              </Button>
            </motion.div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 text-sm text-muted-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <CheckCircle2 className="w-4 h-4 text-primary" />
                {benefit}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
