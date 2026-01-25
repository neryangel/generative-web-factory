import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Briefcase } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      id="hero"
      dir="rtl"
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Decorative Gold Line */}
      <svg 
        className="absolute top-1/2 left-0 w-full h-auto opacity-10 pointer-events-none" 
        viewBox="0 0 1200 200" 
        fill="none"
      >
        <path 
          d="M0 100 Q 300 20, 600 100 T 1200 100" 
          stroke="hsl(40 55% 50%)" 
          strokeWidth="1" 
          fill="none"
        />
        <path 
          d="M0 120 Q 300 40, 600 120 T 1200 120" 
          stroke="hsl(40 55% 50%)" 
          strokeWidth="0.5" 
          fill="none"
        />
      </svg>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Right - Content (First in RTL) */}
          <div
            className={`text-center lg:text-right transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            {/* Main Headline */}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium leading-[1.1] mb-6">
              <span className="block text-foreground">הרימו את</span>
              <span className="gold-text">המותג שלכם לגבהים.</span>
            </h1>

            {/* Description */}
            <p className="text-muted-foreground text-lg max-w-md mx-auto lg:mx-0 lg:mr-0 mb-10">
              אנחנו יוצרים חוויות דיגיטליות מרהיבות שמושכות קהלים ומניעות תוצאות.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-serif gold-text">+500</p>
                  <p className="text-xs text-muted-foreground">לקוחות מרוצים</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-serif gold-text">+100</p>
                  <p className="text-xs text-muted-foreground">פרויקטים בחודש</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Button
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 text-sm px-10 py-6 shadow-lg shadow-primary/20"
            >
              התחילו את הפרויקט שלכם
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </div>

          {/* Left - Portfolio Card */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="relative group">
              {/* Card Glow */}
              <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Card */}
              <div className="relative bg-card border border-primary/20 rounded-lg overflow-hidden">
                {/* Image Placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-muted to-background flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-10 h-10 text-primary" />
                    </div>
                    <p className="text-muted-foreground text-sm">פרויקט מוביל</p>
                  </div>
                </div>
                
                {/* Card Info */}
                <div className="p-6 border-t border-primary/10">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                      <ArrowLeft className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div className="text-right">
                      <h3 className="font-serif text-lg text-foreground">אתר פרימיום</h3>
                      <p className="text-xs text-muted-foreground mt-1">עיצוב אתרים</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
