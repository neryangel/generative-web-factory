import { useRef } from 'react';
import { LayoutTemplate, Pencil, Rocket } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

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
      dir="rtl"
      className="relative py-24 bg-background overflow-hidden"
    >
      {/* Decorative Lines */}
      <svg 
        className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" 
        viewBox="0 0 1200 600"
      >
        <motion.path 
          d="M0 300 Q 300 100, 600 300 T 1200 300" 
          stroke="hsl(var(--primary))" 
          strokeWidth="1" 
          fill="none"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            className="text-xs tracking-wider text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            איך זה עובד
          </motion.p>
          <motion.h2
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            שלושה צעדים פשוטים
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            מהרעיון לאתר מושלם בכמה דקות
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line - Desktop */}
          <div className="absolute top-32 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  className="relative text-center"
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                >
                  {/* Number Badge */}
                  <motion.div 
                    className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground text-xl font-serif font-bold mb-6 shadow-lg shadow-primary/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {step.number}
                  </motion.div>

                  {/* Card */}
                  <motion.div 
                    className="relative p-8 rounded-xl bg-card border border-primary/10 hover:border-primary/30 transition-all duration-300 group"
                    whileHover={{ y: -8, boxShadow: "0 20px 40px -20px hsl(var(--primary) / 0.2)" }}
                  >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Icon */}
                    <motion.div 
                      className="relative w-14 h-14 mx-auto rounded-full border border-primary/30 flex items-center justify-center mb-6 group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="w-6 h-6 text-primary" />
                    </motion.div>
                    
                    <h3 className="relative font-serif text-xl text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="relative text-muted-foreground leading-relaxed text-sm">
                      {step.description}
                    </p>

                    {/* Corner Decorations */}
                    <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-primary/20 group-hover:border-primary/50 transition-colors duration-300" />
                    <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-primary/20 group-hover:border-primary/50 transition-colors duration-300" />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
