import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

const CTASection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

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

  const benefits = [
    'ללא כרטיס אשראי',
    'התחילו תוך 30 שניות',
    'ביטול בכל עת',
  ];

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 animated-gradient-bg opacity-70" />
      
      {/* Mesh Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />

      {/* Floating Orbs */}
      <div className="floating-orb w-80 h-80 top-0 left-1/4 from-primary/30 to-accent/30" />
      <div className="floating-orb w-64 h-64 bottom-0 right-1/3 from-accent/25 to-primary/25" style={{ animationDelay: '2s' }} />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/40 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`mb-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">הצטרפו עכשיו</span>
            </div>
          </div>

          {/* Headline */}
          <h2
            className={`text-3xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            מוכנים <span className="gradient-text">להתחיל?</span>
          </h2>

          {/* Description */}
          <p
            className={`text-lg md:text-xl text-muted-foreground mb-8 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            הצטרפו לאלפי העסקים שכבר בנו את הנוכחות הדיגיטלית שלהם עם AMDIR
          </p>

          {/* CTA Button */}
          <div
            className={`mb-8 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="group relative px-10 py-7 text-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-3">
                התחילו בחינם עכשיו
                <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
              </span>
              
              {/* Shimmer */}
              <div className="absolute inset-0 rounded-md overflow-hidden">
                <div className="shimmer" />
              </div>

              {/* Pulse Ring */}
              <div className="absolute inset-0 rounded-md animate-ping bg-primary/20 opacity-75" style={{ animationDuration: '2s' }} />
            </Button>
          </div>

          {/* Benefits */}
          <div
            className={`flex flex-wrap items-center justify-center gap-6 transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="w-4 h-4 text-primary" />
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
