import { useEffect, useRef, useState } from 'react';
import { 
  MousePointer2, 
  LayoutTemplate, 
  Smartphone, 
  Zap, 
  Users, 
  Languages 
} from 'lucide-react';

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const FeaturesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features: Feature[] = [
    {
      icon: MousePointer2,
      title: 'בנייה ויזואלית',
      description: 'גררו ושחררו אלמנטים בקלות. ללא קוד, ללא מאמץ.',
    },
    {
      icon: LayoutTemplate,
      title: 'תבניות פרימיום',
      description: 'עשרות תבניות מעוצבות מקצועית מוכנות לשימוש.',
    },
    {
      icon: Smartphone,
      title: 'רספונסיביות מלאה',
      description: 'האתר שלכם נראה מושלם בכל מכשיר ובכל גודל מסך.',
    },
    {
      icon: Zap,
      title: 'מהירות בזק',
      description: 'ביצועים מותאמים וטעינה מהירה לחוויית משתמש מעולה.',
    },
    {
      icon: Users,
      title: 'ניהול צוותים',
      description: 'נהלו מספר משתמשים וארגונים במקום אחד.',
    },
    {
      icon: Languages,
      title: 'תמיכה בעברית',
      description: 'RTL מלא, ממשק בעברית ותמיכה מקומית 24/7.',
    },
  ];

  return (
    <section
      id="features"
      ref={sectionRef}
      dir="rtl"
      className="relative py-24 bg-card/30"
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p
            className={`text-xs tracking-wider text-primary mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            השירותים שלנו
          </p>
          <h2
            className={`font-serif text-3xl md:text-4xl lg:text-5xl text-foreground transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            מה אנחנו מציעים
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group relative p-8 rounded-lg bg-background border border-primary/10 hover:border-primary/30 transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-full border border-primary/30 flex items-center justify-center mb-6 group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
                  <Icon className="w-6 h-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-serif text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {feature.description}
                </p>

                {/* Hover Line */}
                <div className="absolute bottom-0 right-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-500" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
