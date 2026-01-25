import { useRef } from 'react';
import { Building2, Briefcase, Store, Landmark, Warehouse, ShoppingBag } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const LogosSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

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
      dir="rtl"
      className="relative py-16 bg-background overflow-hidden"
    >
      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.p
          className="text-center text-sm text-muted-foreground mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          אלפי עסקים מכל הסוגים כבר סומכים עלינו
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logos.map((logo, index) => {
            const Icon = logo.icon;
            return (
              <motion.div
                key={index}
                className="flex flex-col items-center gap-2 group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className="w-16 h-16 rounded-full border border-primary/20 flex items-center justify-center bg-card/50 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </motion.div>
                <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {logo.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
};

export default LogosSection;
