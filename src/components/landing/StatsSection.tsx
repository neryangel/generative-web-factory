import { useRef } from 'react';
import { Clock, Globe, Headphones, Users } from 'lucide-react';
import { animate, motion, useInView } from 'framer-motion';
import { useEffect, useState } from 'react';

interface StatItemProps {
  value: number;
  suffix: string;
  decimals?: number;
  isInView: boolean;
}

const AnimatedCounter = ({ value, suffix, decimals = 0, isInView }: StatItemProps) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isInView) return;
    
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (latest) => setCount(latest)
    });
    
    return () => controls.stop();
  }, [isInView, value]);
  
  return (
    <span className="gold-text font-serif">
      {decimals ? count.toFixed(decimals) : Math.floor(count)}
      {suffix}
    </span>
  );
};

const StatsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const stats = [
    {
      icon: Globe,
      value: 5000,
      suffix: '+',
      label: 'אתרים נוצרו',
    },
    {
      icon: Users,
      value: 500,
      suffix: '+',
      label: 'לקוחות מרוצים',
    },
    {
      icon: Clock,
      value: 99.9,
      suffix: '%',
      label: 'זמינות המערכת',
      decimals: 1,
    },
    {
      icon: Headphones,
      value: 24,
      suffix: '/7',
      label: 'תמיכה זמינה',
    },
  ];

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      className="relative py-20 bg-card/50 overflow-hidden"
    >
      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      {/* Background Glow */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                aria-label={`${stat.label}: ${stat.decimals ? stat.value.toFixed(stat.decimals) : stat.value}${stat.suffix}`}
              >
                <motion.div
                  className="relative p-6 md:p-8 rounded-xl bg-background/50 border border-primary/10 hover:border-primary/30 transition-all duration-300 group"
                  whileHover={{ y: -5, boxShadow: "0 20px 40px -20px hsl(var(--primary) / 0.15)" }}
                >
                  {/* Icon */}
                  <motion.div
                    className="inline-flex w-12 h-12 rounded-full border border-primary/30 items-center justify-center mb-4 group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon aria-hidden="true" className="w-5 h-5 text-primary" />
                  </motion.div>

                  {/* Value */}
                  <div className="text-3xl md:text-4xl font-bold mb-2" aria-hidden="true">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                      isInView={isInView}
                    />
                  </div>
                  <span className="sr-only">{stat.decimals ? stat.value.toFixed(stat.decimals) : stat.value}{stat.suffix}</span>

                  {/* Label */}
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  );
};

export default StatsSection;
