import { useEffect, useRef, useState } from 'react';
import { Building2, Briefcase, Store, Landmark, Warehouse, ShoppingBag } from 'lucide-react';

const LogosSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const logos = [
    { icon: Building2, name: 'חברות טכנולוגיה' },
    { icon: Briefcase, name: 'עסקים קטנים' },
    { icon: Store, name: 'חנויות' },
    { icon: Landmark, name: 'מוסדות' },
    { icon: Warehouse, name: 'יצרנים' },
    { icon: ShoppingBag, name: 'מסחר' },
  ];

  return (
    <section
      id="logos"
      ref={sectionRef}
      className="relative py-16 bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 grid-pattern opacity-10" />

      <div className="container mx-auto px-4 relative z-10">
        <p
          className={`text-center text-sm text-muted-foreground mb-10 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          אלפי עסקים מכל הסוגים כבר סומכים עלינו
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {logos.map((logo, index) => {
            const Icon = logo.icon;
            return (
              <div
                key={index}
                className={`flex flex-col items-center gap-2 group transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="p-4 rounded-2xl bg-muted/50 backdrop-blur-sm border border-border/50 transition-all group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:scale-110">
                  <Icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {logo.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LogosSection;
