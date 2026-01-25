import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, useState, useEffect } from 'react';

interface Testimonial {
  quote?: string;
  author?: string;
  role?: string;
  avatar?: string;
  rating?: number;
  company?: string;
}

interface TestimonialsContent {
  title?: string;
  subtitle?: string;
  items?: Testimonial[];
}

export function TestimonialsSection({ 
  content, 
  isEditing, 
  onContentChange,
  onSelect,
  isSelected 
}: SectionProps) {
  const testimonialsContent = content as TestimonialsContent;
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const defaultTestimonials: Testimonial[] = [
    {
      quote: 'הפלטפורמה הזו שינתה את הדרך שבה אנחנו מנהלים את הנוכחות הדיגיטלית שלנו. פשוט מדהים!',
      author: 'שרה כהן',
      role: 'מנכ"לית',
      company: 'חברת טכנולוגיה',
      rating: 5,
    },
    {
      quote: 'בזכות הכלים המתקדמים הצלחנו להכפיל את המכירות שלנו תוך חודשיים בלבד. ממליץ בחום!',
      author: 'דני לוי',
      role: 'בעל עסק',
      company: 'חנות אונליין',
      rating: 5,
    },
    {
      quote: 'השירות והתמיכה ברמה אחרת לגמרי. כל שאלה נענית במהירות ובמקצועיות.',
      author: 'מיכל אברהם',
      role: 'מעצבת גרפית',
      company: 'סטודיו עיצוב',
      rating: 5,
    },
  ];

  const testimonials = testimonialsContent.items?.length ? testimonialsContent.items : defaultTestimonials;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (isEditing) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isEditing, testimonials.length]);

  const updateContent = (key: keyof TestimonialsContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  const updateItem = (index: number, field: keyof Testimonial, value: string | number) => {
    const items = [...(testimonialsContent.items || defaultTestimonials)];
    items[index] = { ...items[index], [field]: value };
    updateContent('items', items);
  };

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section 
      ref={sectionRef}
      className={`relative py-32 px-4 overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sidebar via-sidebar/95 to-sidebar" />
      
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-10" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>מה הלקוחות אומרים</span>
          </div>
          <EditableText
            value={testimonialsContent.title || 'לקוחות מרוצים מספרים'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            as="h2"
          />
          <EditableText
            value={testimonialsContent.subtitle || 'הצטרפו לאלפי העסקים שכבר בחרו בנו'}
            onChange={(value) => updateContent('subtitle', value)}
            isEditing={isEditing}
            className="text-xl text-white/60 max-w-2xl mx-auto"
            as="p"
          />
        </div>

        {/* Testimonials Carousel */}
        <div className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
          {/* Main testimonial card */}
          <div className="relative max-w-4xl mx-auto">
            <Card className="relative overflow-hidden bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
              {/* Quote decoration */}
              <div className="absolute -top-6 -right-6 text-[150px] leading-none font-serif text-white/5">
                "
              </div>
              
              <CardContent className="relative p-10 md:p-14">
                <div className="flex flex-col md:flex-row gap-10 items-center">
                  {/* Avatar with animated ring */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 animate-spin-slow" style={{ animationDuration: '8s' }} />
                    <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-3xl font-bold border-4 border-sidebar">
                      {testimonials[activeIndex].author?.charAt(0) || 'A'}
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-right">
                    {/* Stars */}
                    <div className="flex justify-center md:justify-start gap-1 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`w-5 h-5 ${star <= (testimonials[activeIndex].rating || 5) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-white/20'}`}
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <EditableText
                      value={testimonials[activeIndex].quote || 'ביקורת מרשימה כאן'}
                      onChange={(value) => updateItem(activeIndex, 'quote', value)}
                      isEditing={isEditing}
                      className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 font-light"
                      as="p"
                    />

                    {/* Author info */}
                    <div>
                      <EditableText
                        value={testimonials[activeIndex].author || 'שם הלקוח'}
                        onChange={(value) => updateItem(activeIndex, 'author', value)}
                        isEditing={isEditing}
                        className="text-lg font-bold text-white"
                        as="p"
                      />
                      <div className="flex items-center justify-center md:justify-start gap-2 text-white/50">
                        <EditableText
                          value={testimonials[activeIndex].role || 'תפקיד'}
                          onChange={(value) => updateItem(activeIndex, 'role', value)}
                          isEditing={isEditing}
                          as="span"
                        />
                        <span>•</span>
                        <EditableText
                          value={testimonials[activeIndex].company || 'חברה'}
                          onChange={(value) => updateItem(activeIndex, 'company', value)}
                          isEditing={isEditing}
                          as="span"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setActiveIndex(index); }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'w-8 bg-white' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Mini testimonials preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {testimonials.map((testimonial, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setActiveIndex(index); }}
                className={`p-6 rounded-2xl text-right transition-all duration-300 ${
                  index === activeIndex
                    ? 'bg-white/15 border-2 border-white/30'
                    : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                }`}
              >
                <Quote className="w-6 h-6 text-white/30 mb-3" />
                <p className="text-white/60 text-sm line-clamp-2 mb-3">
                  {testimonial.quote?.substring(0, 60)}...
                </p>
                <p className="text-white text-sm font-medium">{testimonial.author}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
