import { useRef } from 'react';
import { 
  Languages, 
  LayoutTemplate, 
  MousePointer2, 
  Smartphone, 
  Users, 
  Zap 
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  return (
    <section
      id="features"
      ref={sectionRef}
      dir="rtl"
      className="relative py-16 md:py-24 bg-card/30 overflow-hidden"
      aria-labelledby="features-heading"
    >
      {/* Background Decorations - Hidden on mobile for performance */}
      <div className="absolute top-20 right-10 w-48 md:w-72 h-48 md:h-72 bg-primary/5 rounded-full blur-3xl hidden sm:block" />
      <div className="absolute bottom-20 left-10 w-64 md:w-96 h-64 md:h-96 bg-primary/5 rounded-full blur-3xl hidden sm:block" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <motion.p
            className="text-xs tracking-wider text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            השירותים שלנו
          </motion.p>
          <motion.h2
            id="features-heading"
            className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 md:mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            מה אנחנו מציעים
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            פתרונות דיגיטליים מקצה לקצה שיקחו את העסק שלכם לשלב הבא
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="group relative p-5 sm:p-6 md:p-8 rounded-xl bg-background border border-primary/10 hover:border-primary/30 transition-all duration-500"
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 20px 40px -20px hsl(var(--primary) / 0.2)"
                }}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon */}
                <motion.div 
                  className="relative w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border border-primary/30 flex items-center justify-center mb-4 md:mb-6 group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </motion.div>

                {/* Content */}
                <h3 className="relative font-serif text-lg sm:text-xl text-foreground mb-2 md:mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="relative text-muted-foreground leading-relaxed text-xs sm:text-sm">
                  {feature.description}
                </p>

                {/* Corner Decoration */}
                <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-primary/20 group-hover:border-primary/50 transition-colors duration-300" />
                <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-primary/20 group-hover:border-primary/50 transition-colors duration-300" />

                {/* Bottom Line */}
                <motion.div 
                  className="absolute bottom-0 right-0 h-0.5 bg-primary"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
