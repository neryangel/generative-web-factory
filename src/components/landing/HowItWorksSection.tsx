import { useEffect, useRef, useState } from 'react';
import { LayoutTemplate, Pencil, Rocket } from 'lucide-react';

const HowItWorksSection = () => {
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

  const steps = [
    {
      number: '01',
      icon: LayoutTemplate,
      title: 'בחרו תבנית',
      description: 'התחילו עם אחת מעשרות התבניות המעוצבות שלנו שמתאימות לכל סוג עסק.',
    },
    {
      number: '02',
      icon: Pencil,
      title: 'התאימו את התוכן',
      description: 'ערכו טקסטים, העלו תמונות והתאימו צבעים בקליקים בודדים.',
    },
    {
      number: '03',
      icon: Rocket,
      title: 'פרסמו ותיהנו',
      description: 'בלחיצת כפתור האתר שלכם באוויר ומוכן לקבל גולשים.',
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-3xl md:text-5xl font-bold mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            איך זה <span className="gradient-text">עובד?</span>
          </h2>
          <p
            className={`text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            שלושה צעדים פשוטים לאתר המושלם שלכם
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-px h-[calc(100%-120px)] bg-gradient-to-b from-primary via-accent to-primary/20 hidden md:block" />
          <div className="absolute top-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent md:hidden" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className={`relative text-center transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  {/* Number */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent text-white text-2xl font-bold mb-6 shadow-xl shadow-primary/30">
                    {step.number}
                  </div>

                  {/* Icon Card */}
                  <div className="relative p-8 rounded-3xl glass-card mb-6 group hover:border-primary/50 transition-all">
                    <div className="absolute inset-x-0 -top-8 flex justify-center">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/30 group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <div className="pt-8">
                      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
