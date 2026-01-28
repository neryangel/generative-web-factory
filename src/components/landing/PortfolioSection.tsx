import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useInView } from 'framer-motion';

import portfolioHotel from '@/assets/portfolio-hotel.jpg';
import portfolioFashion from '@/assets/portfolio-fashion.jpg';
import portfolioTech from '@/assets/portfolio-tech.jpg';
import portfolioRestaurant from '@/assets/portfolio-restaurant.jpg';
import portfolioRealestate from '@/assets/portfolio-realestate.jpg';

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
}

const PortfolioSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const projects: Project[] = [
    { id: 1, title: 'מלון יוקרה', category: 'אירוח', image: portfolioHotel },
    { id: 2, title: 'מותג אופנה', category: 'מסחר אלקטרוני', image: portfolioFashion },
    { id: 3, title: 'סטארטאפ טכנולוגי', category: 'SaaS', image: portfolioTech },
    { id: 4, title: 'רשת מסעדות', category: 'מזון ומשקאות', image: portfolioRestaurant },
    { id: 5, title: 'נדל"ן', category: 'נכסים', image: portfolioRealestate },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'right' ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
      
      const newIndex = Math.round(Math.abs(newScrollLeft) / scrollAmount);
      setCurrentIndex(Math.max(0, Math.min(newIndex, projects.length - 1)));
    }
  };

  return (
    <section 
      ref={sectionRef} 
      id="portfolio" 
      dir="rtl" 
      className="py-16 md:py-24 bg-background relative overflow-hidden"
      aria-labelledby="portfolio-heading"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" aria-hidden="true" />
      {/* Section Header */}
      <div className="container mx-auto px-4 sm:px-6 mb-10 md:mb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
          <div>
            <motion.p 
              className="text-xs tracking-wider text-primary mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              העבודות שלנו
            </motion.p>
            <motion.h2 
              id="portfolio-heading"
              className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              תיק עבודות נבחר
            </motion.h2>
          </div>
          
          {/* Navigation Arrows */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            role="group"
            aria-label="ניווט בתיק עבודות"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground rounded-full w-10 h-10 md:w-12 md:h-12 transition-all duration-300 hover:scale-110 min-w-[44px] min-h-[44px]"
              aria-label="הפרויקט הקודם"
            >
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground rounded-full w-10 h-10 md:w-12 md:h-12 transition-all duration-300 hover:scale-110 min-w-[44px] min-h-[44px]"
              aria-label="הפרויקט הבא"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </motion.div>
        </div>

        <motion.p 
          className="text-muted-foreground mt-4 max-w-xl"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          אנחנו מתמחים ביצירת חוויות דיגיטליות יוקרתיות. הנה כמה מהפרויקטים שלנו.
        </motion.p>
      </div>

      {/* Portfolio Carousel */}
      <div 
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-6 pb-4"
        style={{ scrollSnapType: 'x mandatory' }}
        dir="ltr"
      >
        {/* Spacer for first item - Hidden on mobile */}
        <div className="flex-shrink-0 w-2 sm:w-4 lg:w-[calc((100vw-1280px)/2)]" />
        
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="flex-shrink-0 w-[280px] sm:w-80 md:w-96 group"
            style={{ scrollSnapAlign: 'start' }}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 * index }}
            whileHover={{ y: -10 }}
          >
            <div className="relative bg-card border border-primary/10 rounded-lg overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
              {/* Image with Clip-Path Reveal */}
              <motion.div 
                className="aspect-[4/3] bg-gradient-to-br from-muted to-background relative overflow-hidden"
                initial={{ clipPath: 'inset(100% 0 0 0)' }}
                whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.1 * index }}
              >
                <motion.img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:filter group-hover:saturate-[1.1]"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                
                {/* Project Number */}
                <motion.span 
                  className="absolute top-4 right-4 text-xs text-muted-foreground font-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  0{index + 1}
                </motion.span>
                
                {/* Link Icon */}
                <motion.div 
                  className="absolute top-4 left-4 w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center bg-background/80 backdrop-blur-sm cursor-pointer"
                  initial={{ opacity: 0, scale: 0 }}
                  whileHover={{ scale: 1.2, rotate: 45 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <ExternalLink className="w-4 h-4 text-primary" />
                </motion.div>
              </motion.div>
              
              {/* Info */}
              <div className="p-4 sm:p-6" dir="rtl">
                <p className="text-[10px] sm:text-xs text-primary mb-1 sm:mb-2 uppercase tracking-wider">{project.category}</p>
                <h3 className="font-serif text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h3>
              </div>

              {/* Bottom Line Animation */}
              <motion.div 
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-primary/50"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        ))}
        
        {/* Spacer for last item - Hidden on mobile */}
        <div className="flex-shrink-0 w-2 sm:w-4 lg:w-[calc((100vw-1280px)/2)]" />
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2 mt-8">
        {projects.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTo({ left: index * 400, behavior: 'smooth' });
                setCurrentIndex(index);
              }
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-primary w-8' : 'bg-primary/30 w-2'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </section>
  );
};

export default PortfolioSection;
