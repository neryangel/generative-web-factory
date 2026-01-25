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
  gradient: string;
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
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: LayoutTemplate,
      title: 'תבניות מקצועיות',
      description: 'עשרות תבניות מעוצבות מוכנות לשימוש מיידי.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Smartphone,
      title: 'רספונסיביות מלאה',
      description: 'האתר שלכם נראה מושלם בכל מכשיר ובכל גודל מסך.',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Zap,
      title: 'מהירות בזק',
      description: 'ביצועים אופטימליים וטעינה מהירה לחוויה מעולה.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Users,
      title: 'ניהול צוותים',
      description: 'נהלו מספר משתמשים וארגונים במקום אחד.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Languages,
      title: 'תמיכה בעברית',
      description: 'RTL מלא, ממשק בעברית ותמיכה מקומית 24/7.',
      gradient: 'from-primary to-accent',
    },
  ];

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="floating-orb w-72 h-72 top-20 -right-36 from-primary/20 to-accent/20" />
      <div className="floating-orb w-64 h-64 bottom-20 -left-32 from-accent/15 to-primary/15" style={{ animationDelay: '3s' }} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-3xl md:text-5xl font-bold mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="gradient-text">כל מה שצריך</span> לאתר מושלם
          </h2>
          <p
            className={`text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            כלים מתקדמים שהופכים את בניית האתר לפשוטה ומהנה
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group relative p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Gradient Top Line on Hover */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-3xl" />

                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
