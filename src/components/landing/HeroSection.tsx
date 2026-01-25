import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Sparkles, CheckCircle2, ChevronDown } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const trustIndicators = [
    'ללא כרטיס אשראי',
    'התחילו תוך 30 שניות',
    'תמיכה בעברית מלאה',
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 animated-gradient-bg opacity-50" />
      
      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 noise-texture" />

      {/* Floating Orbs */}
      <div className="floating-orb w-96 h-96 -top-48 -right-48 from-primary/30 to-accent/30" />
      <div className="floating-orb w-80 h-80 top-1/3 -left-40 from-accent/20 to-primary/20" style={{ animationDelay: '2s' }} />
      <div className="floating-orb w-64 h-64 bottom-20 right-1/4 from-primary/25 to-accent/25" style={{ animationDelay: '4s' }} />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`mb-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm border-primary/50 bg-primary/10 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 ml-2 text-primary" />
              הפלטפורמה המובילה לבניית אתרים בישראל
            </Badge>
          </div>

          {/* Main Headline */}
          <h1
            className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="block">בנו אתרים</span>
            <span className="gradient-text">מדהימים בלחיצת כפתור</span>
          </h1>

          {/* Sub-headline */}
          <p
            className={`text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            AMDIR מאפשר לכם ליצור אתרים מקצועיים ויפהפיים בדקות ספורות,
            ללא צורך בקוד או ידע טכני. פשוט, מהיר, מרשים.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="group relative px-8 py-6 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                התחילו בחינם
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </span>
              {/* Shimmer effect */}
              <div className="absolute inset-0 rounded-md overflow-hidden">
                <div className="shimmer" />
              </div>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg border-border/50 hover:bg-muted/50 backdrop-blur-sm group"
            >
              <Play className="w-5 h-5 ml-2 transition-transform group-hover:scale-110" />
              צפו בדמו
            </Button>
          </div>

          {/* Trust Indicators */}
          <div
            className={`flex flex-wrap items-center justify-center gap-6 transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {trustIndicators.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="w-4 h-4 text-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => {
          document.querySelector('#logos')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors animate-bounce"
      >
        <span className="text-xs">גללו למטה</span>
        <ChevronDown className="w-5 h-5" />
      </button>
    </section>
  );
};

export default HeroSection;
