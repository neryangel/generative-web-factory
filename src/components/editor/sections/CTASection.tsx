import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Zap, Star } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

interface CTAContent {
  headline?: string;
  description?: string;
  button_text?: string;
  button_url?: string;
  secondary_text?: string;
  background_color?: string;
}

export function CTASection({ 
  content, 
  isEditing, 
  onContentChange,
  onSelect,
  isSelected 
}: SectionProps) {
  const ctaContent = content as CTAContent;
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  const updateContent = (key: keyof CTAContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  return (
    <section 
      ref={sectionRef}
      className={`relative py-32 px-4 overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%] animate-gradient" />
      
      {/* Mesh overlay */}
      <div className="absolute inset-0 opacity-50" style={{ background: 'var(--gradient-mesh)' }} />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Decorative icons */}
      <div className="absolute top-20 left-20 text-white/10">
        <Zap className="w-24 h-24" />
      </div>
      <div className="absolute bottom-20 right-20 text-white/10">
        <Star className="w-32 h-32" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-10" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span className="text-white/90 text-sm font-medium">הצטרפו עכשיו וקבלו 30% הנחה</span>
        </div>

        {/* Headline */}
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '100ms' }}>
          <EditableText
            value={ctaContent.headline || 'מוכנים להתחיל את המסע?'}
            onChange={(value) => updateContent('headline', value)}
            isEditing={isEditing}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight"
            as="h2"
          />
        </div>

        {/* Description */}
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
          <EditableText
            value={ctaContent.description || 'הצטרפו לאלפי העסקים שכבר משתמשים בפלטפורמה שלנו ומגדילים את ההכנסות שלהם'}
            onChange={(value) => updateContent('description', value)}
            isEditing={isEditing}
            className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed"
            as="p"
          />
        </div>

        {/* CTA Button */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '300ms' }}>
          <Button 
            size="lg"
            className="group relative overflow-hidden bg-white text-purple-600 hover:bg-white/95 text-lg px-12 py-8 rounded-full font-bold shadow-2xl shadow-black/30 transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-3">
              <EditableText
                value={ctaContent.button_text || 'התחילו בחינם עכשיו'}
                onChange={(value) => updateContent('button_text', value)}
                isEditing={isEditing}
                as="span"
              />
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
            </span>
            
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white" style={{ animationDuration: '2s' }} />
          </Button>

          {/* Secondary text */}
          <EditableText
            value={ctaContent.secondary_text || 'ללא כרטיס אשראי • התחילו תוך 30 שניות'}
            onChange={(value) => updateContent('secondary_text', value)}
            isEditing={isEditing}
            className="text-white/60 text-sm"
            as="p"
          />
        </div>

        {/* Trust badges */}
        <div className={`flex items-center justify-center gap-8 mt-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
          <div className="flex items-center gap-2 text-white/60">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400 border-2 border-purple-600 flex items-center justify-center text-xs font-bold text-white"
                  style={{ zIndex: 3 - i }}
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span className="text-sm">הצטרפו ל-5,000+ משתמשים</span>
          </div>
          
          <div className="flex items-center gap-1 text-white/60">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-sm mr-2">4.9/5</span>
          </div>
        </div>
      </div>
    </section>
  );
}
