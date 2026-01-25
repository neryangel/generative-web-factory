import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'יעל כהן',
      role: 'מנכ"לית',
      company: 'סטארטאפ טק',
      content: 'האתר שנבנה עבורנו הפך את הנוכחות הדיגיטלית שלנו לחוויה יוקרתית. העיצוב המדהים והביצועים המעולים הביאו לעלייה של 300% בלידים.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 2,
      name: 'דוד לוי',
      role: 'בעלים',
      company: 'מסעדת שף',
      content: 'שירות מקצועי ברמה הגבוהה ביותר. הצוות הבין בדיוק את הצרכים שלנו ויצר אתר שמשקף את האיכות של המסעדה. ממליץ בחום!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 3,
      name: 'מיכל ברקוביץ',
      role: 'מנהלת שיווק',
      company: 'בוטיק אופנה',
      content: 'החנות האונליין שלנו עלתה לאוויר בזמן שיא והתוצאות מדברות בעד עצמן. המכירות הוכפלו תוך חודשיים. עבודה מקצועית מהמדרגה הראשונה.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 4,
      name: 'אורי שמש',
      role: 'מייסד',
      company: 'נדל"ן יוקרה',
      content: 'כל פרויקט שעשינו ביחד היה מושלם. התקשורת מעולה, העיצוב יוקרתי, והתמיכה הטכנית זמינה תמיד. שותפות אמיתית.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * i, duration: 0.3 }}
        >
          <Star
            className={`w-4 h-4 ${i < rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`}
          />
        </motion.div>
      ))}
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      dir="rtl"
      className="relative py-20 md:py-32 bg-card/30 overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      {/* Decorative Quote Mark */}
      <motion.div
        className="absolute top-10 right-10 text-[200px] md:text-[300px] font-serif text-primary/5 leading-none pointer-events-none select-none"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        aria-hidden="true"
      >
        "
      </motion.div>

      {/* Background Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.p
            className="text-xs tracking-wider text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            המלצות
          </motion.p>
          <motion.h2
            id="testimonials-heading"
            className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            מה הלקוחות אומרים
          </motion.h2>
        </div>

        {/* 3D Carousel */}
        <div className="relative max-w-4xl mx-auto perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="relative"
              initial={{ opacity: 0, rotateY: -15, scale: 0.95 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: 15, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="relative p-8 md:p-12 rounded-2xl bg-background/80 backdrop-blur-sm border border-primary/20 shadow-2xl">
                {/* Quote Icon */}
                <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />

                {/* Content */}
                <div className="text-center">
                  {/* Avatar */}
                  <motion.div
                    className="relative w-20 h-20 mx-auto mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <img
                      src={testimonials[activeIndex].avatar}
                      alt={testimonials[activeIndex].name}
                      className="w-full h-full rounded-full object-cover border-2 border-primary/30"
                    />
                    <motion.div
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Star className="w-3 h-3 text-primary-foreground fill-primary-foreground" />
                    </motion.div>
                  </motion.div>

                  {/* Rating */}
                  <div className="flex justify-center mb-6">
                    <StarRating rating={testimonials[activeIndex].rating} />
                  </div>

                  {/* Quote */}
                  <motion.p
                    className="text-lg md:text-xl text-foreground leading-relaxed mb-6 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    "{testimonials[activeIndex].content}"
                  </motion.p>

                  {/* Author */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p className="font-serif text-xl text-primary mb-1">
                      {testimonials[activeIndex].name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonials[activeIndex].role}, {testimonials[activeIndex].company}
                    </p>
                  </motion.div>
                </div>

                {/* Corner Decorations */}
                <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-primary/30" />
                <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-primary/30" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-0 md:-px-4 pointer-events-none">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="pointer-events-auto -translate-x-4 md:-translate-x-12 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground rounded-full w-10 h-10 md:w-12 md:h-12 transition-all duration-300 hover:scale-110"
              aria-label="ביקורת קודמת"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="pointer-events-auto translate-x-4 md:translate-x-12 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground rounded-full w-10 h-10 md:w-12 md:h-12 transition-all duration-300 hover:scale-110"
              aria-label="ביקורת הבאה"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setActiveIndex(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'bg-primary w-8' : 'bg-primary/30 w-2'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`עבור לביקורת ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
};

export default TestimonialsSection;
