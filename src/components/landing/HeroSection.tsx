import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import portfolioHotel from '@/assets/portfolio-hotel.jpg';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section
      id="hero"
      dir="rtl"
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-12 md:pt-20 md:pb-0"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Animated Gradient Orbs - Hidden on mobile for performance */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-48 md:w-96 h-48 md:h-96 bg-primary/5 rounded-full blur-3xl hidden sm:block"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-1/4 left-1/4 w-40 md:w-80 h-40 md:h-80 bg-primary/10 rounded-full blur-3xl hidden sm:block"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Decorative Gold Lines */}
      <svg 
        className="absolute top-1/2 left-0 w-full h-auto opacity-10 pointer-events-none" 
        viewBox="0 0 1200 200" 
        fill="none"
      >
        <motion.path 
          d="M0 100 Q 300 20, 600 100 T 1200 100" 
          stroke="hsl(40 55% 50%)" 
          strokeWidth="1" 
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path 
          d="M0 120 Q 300 40, 600 120 T 1200 120" 
          stroke="hsl(40 55% 50%)" 
          strokeWidth="0.5" 
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
        />
      </svg>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
          
          {/* Right - Content (First in RTL) */}
          <motion.div
            className="text-center lg:text-right"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Main Headline */}
            <motion.h1 
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium leading-[1.15] mb-4 md:mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="block text-foreground">הרימו את</span>
              <motion.span 
                className="gold-text block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                המותג שלכם לגבהים.
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="text-muted-foreground text-base md:text-lg max-w-md mx-auto lg:mx-0 lg:mr-0 mb-6 md:mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              אנחנו יוצרים חוויות דיגיטליות מרהיבות שמושכות קהלים ומניעות תוצאות.
            </motion.p>

            {/* Stats */}
            <motion.div 
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div 
                className="flex items-center gap-2 sm:gap-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-primary/30 flex items-center justify-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-xl sm:text-2xl font-serif gold-text">+500</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">לקוחות מרוצים</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-2 sm:gap-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-primary/30 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-xl sm:text-2xl font-serif gold-text">+100</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">פרויקטים בחודש</p>
                </div>
              </motion.div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Button
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 text-xs sm:text-sm px-6 sm:px-10 py-5 sm:py-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1"
              >
                התחילו את הפרויקט שלכם
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Left - Portfolio Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-first lg:order-last"
          >
            <motion.div 
              className="relative group max-w-sm mx-auto lg:max-w-none"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {/* Card Glow */}
              <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Card */}
              <div className="relative bg-card border border-primary/20 rounded-lg overflow-hidden shadow-2xl">
                {/* Image */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  <motion.img 
                    src={portfolioHotel}
                    alt="פרויקט מוביל - מלון יוקרה"
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                  
                  {/* Badge */}
                  <motion.div 
                    className="absolute top-4 right-4 px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, type: "spring" }}
                  >
                    <span className="text-xs text-primary-foreground font-medium">חדש</span>
                  </motion.div>
                </div>
                
                {/* Card Info */}
                <div className="p-6 border-t border-primary/10">
                  <div className="flex items-center justify-between">
                    <motion.div 
                      className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.1, rotate: -45 }}
                    >
                      <ArrowLeft className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
                    </motion.div>
                    <div className="text-right">
                      <h3 className="font-serif text-lg text-foreground">אתר פרימיום</h3>
                      <p className="text-xs text-muted-foreground mt-1">עיצוב אתרים</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div 
            className="w-1 h-2 bg-primary rounded-full"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
