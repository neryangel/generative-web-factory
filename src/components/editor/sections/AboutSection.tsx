import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { ImagePickerDialog } from '../ImagePickerDialog';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Award, Users, TrendingUp, Target, CheckCircle2 } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

interface Stat {
  value?: string;
  label?: string;
  icon?: string;
}

interface AboutContent {
  title?: string;
  content?: string;
  image?: string;
  stats?: Stat[];
  features?: string[];
}

// Animated counter hook
function useCountUp(end: number, duration: number = 2000, isVisible: boolean) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);
  
  return count;
}

export function AboutSection({ 
  content, 
  isEditing, 
  onContentChange,
  onSelect,
  isSelected 
}: SectionProps) {
  const aboutContent = content as AboutContent;
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

  const updateContent = (key: keyof AboutContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  const updateStat = (index: number, field: keyof Stat, value: string) => {
    const stats = [...(aboutContent.stats || defaultStats)];
    stats[index] = { ...stats[index], [field]: value };
    updateContent('stats', stats);
  };

  const defaultStats: Stat[] = [
    { value: '500', label: 'לקוחות מרוצים', icon: 'Users' },
    { value: '98', label: 'אחוזי שביעות רצון', icon: 'Award' },
    { value: '50', label: 'פרויקטים הושלמו', icon: 'Target' },
    { value: '24', label: 'שעות תמיכה', icon: 'TrendingUp' },
  ];

  const defaultFeatures = [
    'צוות מומחים עם ניסיון של 10+ שנים',
    'פתרונות מותאמים אישית לכל לקוח',
    'תמיכה מלאה לאורך כל הדרך',
    'טכנולוגיות מתקדמות וחדשניות',
  ];

  const stats = aboutContent.stats?.length ? aboutContent.stats : defaultStats;
  const features = aboutContent.features?.length ? aboutContent.features : defaultFeatures;

  const getStatIcon = (iconName?: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      Users,
      Award,
      TrendingUp,
      Target,
    };
    return icons[iconName || 'Users'] || Users;
  };

  // Animated counters
  const count0 = useCountUp(parseInt(stats[0]?.value || '0', 10), 2000, isVisible);
  const count1 = useCountUp(parseInt(stats[1]?.value || '0', 10), 2000, isVisible);
  const count2 = useCountUp(parseInt(stats[2]?.value || '0', 10), 2000, isVisible);
  const count3 = useCountUp(parseInt(stats[3]?.value || '0', 10), 2000, isVisible);
  const animatedStats = [count0, count1, count2, count3];

  return (
    <section 
      ref={sectionRef}
      className={`relative py-32 px-4 overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30" />
      
      {/* Decorative shapes */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Side */}
          <div className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {/* Gradient border effect */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary via-accent to-primary rounded-3xl blur-2xl opacity-20" />
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl" />
              
              <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[4/3]">
                {aboutContent.image ? (
                  <img 
                    src={aboutContent.image} 
                    alt="אודות" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                    <ImageIcon className="w-20 h-20 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            </div>

            {/* Floating stats card */}
            <div className="absolute -bottom-8 -left-8 glass-card p-6 shadow-2xl bg-card/90 backdrop-blur-xl border border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{animatedStats[1]}%</div>
                  <div className="text-sm text-muted-foreground">שביעות רצון</div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="absolute top-4 right-4 z-10">
                <ImagePickerDialog
                  onSelect={(url) => updateContent('image', url)}
                  currentImage={aboutContent.image}
                >
                  <Button size="sm" variant="secondary" className="glass">
                    <ImageIcon className="h-4 w-4 ml-2" />
                    {aboutContent.image ? 'החלף תמונה' : 'הוסף תמונה'}
                  </Button>
                </ImagePickerDialog>
              </div>
            )}
          </div>

          {/* Content Side */}
          <div className={`space-y-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ transitionDelay: '200ms' }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Award className="w-4 h-4" />
              <span>אודות החברה</span>
            </div>

            {/* Title */}
            <EditableText
              value={aboutContent.title || 'אנחנו מאמינים בהצלחה שלכם'}
              onChange={(value) => updateContent('title', value)}
              isEditing={isEditing}
              className="text-4xl md:text-5xl font-bold leading-tight"
              as="h2"
            />

            {/* Description */}
            <EditableText
              value={aboutContent.content || 'עם ניסיון של למעלה מעשור בתעשייה, אנחנו מביאים את הידע והמומחיות שלנו לכל פרויקט. הצוות שלנו מורכב ממומחים מובילים שמחויבים להצלחה שלכם. אנחנו לא רק ספקים - אנחנו שותפים לדרך.'}
              onChange={(value) => updateContent('content', value)}
              isEditing={isEditing}
              className="text-lg text-muted-foreground leading-relaxed"
              as="p"
            />

            {/* Features list */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-border">
              {stats.map((stat, index) => {
                const Icon = getStatIcon(stat.icon);
                return (
                  <div 
                    key={index}
                    className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: `${400 + index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-3xl font-bold">
                        {animatedStats[index]}
                        {stat.value?.includes('%') ? '%' : stat.value?.includes('+') ? '+' : ''}
                      </div>
                    </div>
                    <EditableText
                      value={stat.label || 'תיאור'}
                      onChange={(value) => updateStat(index, 'label', value)}
                      isEditing={isEditing}
                      className="text-sm text-muted-foreground"
                      as="p"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
