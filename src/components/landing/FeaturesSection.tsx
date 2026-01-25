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
      title: 'Visual Builder',
      description: 'Drag and drop elements with ease. No code required.',
    },
    {
      icon: LayoutTemplate,
      title: 'Premium Templates',
      description: 'Dozens of professionally designed templates ready to use.',
    },
    {
      icon: Smartphone,
      title: 'Fully Responsive',
      description: 'Your site looks perfect on every device and screen size.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance and fast loading for great UX.',
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Manage multiple users and organizations in one place.',
    },
    {
      icon: Languages,
      title: 'Multi-Language',
      description: 'Full RTL support, Hebrew interface and 24/7 local support.',
    },
  ];

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-24 bg-card/30"
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p
            className={`text-xs uppercase tracking-[0.3em] text-primary mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Our Services
          </p>
          <h2
            className={`font-serif text-3xl md:text-4xl lg:text-5xl text-foreground transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            What We Offer
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
                <div className="absolute bottom-0 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-500" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
