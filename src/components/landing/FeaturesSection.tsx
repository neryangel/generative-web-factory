import { useRef } from 'react';
import { 
  MousePointer2, 
  LayoutTemplate, 
  Smartphone, 
  Zap, 
  Users, 
  Languages 
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
      className="relative py-24 bg-card/30 overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            className="text-xs tracking-wider text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            השירותים שלנו
          </motion.p>
          <motion.h2
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="group relative p-8 rounded-xl bg-background border border-primary/10 hover:border-primary/30 transition-all duration-500"
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
                  className="relative w-14 h-14 rounded-full border border-primary/30 flex items-center justify-center mb-6 group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="w-6 h-6 text-primary" />
                </motion.div>

                {/* Content */}
                <h3 className="relative font-serif text-xl text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="relative text-muted-foreground leading-relaxed text-sm">
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
