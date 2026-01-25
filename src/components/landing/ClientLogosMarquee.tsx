import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Building2, Briefcase, Store, Landmark, Warehouse, ShoppingBag, Laptop, Camera, Utensils, Home, Plane, Heart } from 'lucide-react';
import { Marquee } from '@/components/effects/Marquee';

interface ClientLogo {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
}

const ClientLogosMarquee = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  const logosRow1: ClientLogo[] = [
    { icon: Building2, name: 'חברות טכנולוגיה' },
    { icon: Briefcase, name: 'עסקים קטנים' },
    { icon: Store, name: 'חנויות' },
    { icon: Landmark, name: 'מוסדות' },
    { icon: Warehouse, name: 'יצרנים' },
    { icon: ShoppingBag, name: 'מסחר' },
  ];

  const logosRow2: ClientLogo[] = [
    { icon: Laptop, name: 'סטארטאפים' },
    { icon: Camera, name: 'סטודיואים' },
    { icon: Utensils, name: 'מסעדות' },
    { icon: Home, name: 'נדל"ן' },
    { icon: Plane, name: 'תיירות' },
    { icon: Heart, name: 'בריאות' },
  ];

  const LogoItem = ({ logo, index }: { logo: ClientLogo; index: number }) => {
    const Icon = logo.icon;
    return (
      <motion.div
        className="flex flex-col items-center gap-3 px-8 group cursor-pointer"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-primary/20 flex items-center justify-center bg-card/50 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
        </motion.div>
        <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          {logo.name}
        </span>
      </motion.div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="clients"
      dir="rtl"
      className="relative py-16 md:py-20 bg-background overflow-hidden"
    >
      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* Header */}
      <div className="container mx-auto px-6 mb-10">
        <motion.p
          className="text-center text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          אלפי עסקים מכל הסוגים כבר סומכים עלינו
        </motion.p>
      </div>

      {/* Marquee Row 1 - Right to Left */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Marquee
          speed={30}
          pauseOnHover
          className="py-4"
        >
          {logosRow1.map((logo, index) => (
            <LogoItem key={index} logo={logo} index={index} />
          ))}
        </Marquee>
      </motion.div>

      {/* Marquee Row 2 - Left to Right (Reverse) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Marquee
          speed={25}
          pauseOnHover
          reverse
          className="py-4"
        >
          {logosRow2.map((logo, index) => (
            <LogoItem key={index} logo={logo} index={index} />
          ))}
        </Marquee>
      </motion.div>

      {/* Gradient Fade Edges */}
      <div className="absolute top-0 bottom-0 left-0 w-20 md:w-40 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 bottom-0 right-0 w-20 md:w-40 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
};

export default ClientLogosMarquee;
