import { useEffect, useRef, useState } from 'react';
import { Globe, Users, Clock, Headphones } from 'lucide-react';

const useCountUp = (end: number, duration: number = 2000, startCounting: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startCounting]);

  return count;
};

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
      className="relative py-24 bg-gradient-to-b from-sidebar to-sidebar-foreground/5 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="floating-orb w-96 h-96 -top-48 left-1/4 from-primary/20 to-accent/20" />
      <div className="floating-orb w-72 h-72 -bottom-36 right-1/3 from-accent/15 to-primary/15" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const count = useCountUp(stat.value, 2000, isVisible);
            
            return (
              <div
                key={index}
                className={`text-center transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="glass-card p-6 md:p-8 rounded-3xl hover:border-primary/50 transition-all group">
                  {/* Icon */}
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Value */}
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                    {stat.decimals ? count.toFixed(stat.decimals) : count}
                    {stat.suffix}
                  </div>

                  {/* Label */}
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
