import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Card, CardContent } from '@/components/ui/card';
import * as LucideIcons from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface FeatureItem {
  icon?: string;
  title?: string;
  description?: string;
}

interface FeaturesContent {
  title?: string;
  subtitle?: string;
  items?: FeatureItem[];
}

export function FeaturesSection({ 
  content, 
  isEditing, 
  onContentChange,
  onSelect,
  isSelected 
}: SectionProps) {
  const featuresContent = content as FeaturesContent;
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { colors, fonts, getCardRadius, getButtonRadius } = useTheme();

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

  const updateContent = (key: keyof FeaturesContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  const updateItem = (index: number, field: keyof FeatureItem, value: string) => {
    const items = [...(featuresContent.items || defaultFeatures)];
    items[index] = { ...items[index], [field]: value };
    updateContent('items', items);
  };

  const getIcon = (iconName?: string) => {
    if (!iconName) return LucideIcons.Sparkles;
    const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
    const Icon = icons[iconName];
    return Icon || LucideIcons.Sparkles;
  };

  const defaultFeatures: FeatureItem[] = [
    { icon: 'Zap', title: 'מהירות בזק', description: 'טכנולוגיה מתקדמת לטעינה מיידית וחוויה חלקה' },
    { icon: 'Shield', title: 'אבטחה מתקדמת', description: 'הגנה מלאה על הנתונים שלכם עם תקני אבטחה מחמירים' },
    { icon: 'Palette', title: 'עיצוב מרהיב', description: 'תבניות יפהפיות שמותאמות בדיוק לצרכים שלכם' },
    { icon: 'Smartphone', title: 'רספונסיבי מושלם', description: 'נראה מדהים בכל מכשיר - מובייל, טאבלט ומחשב' },
    { icon: 'BarChart3', title: 'אנליטיקס מתקדם', description: 'נתונים בזמן אמת להבנת הקהל והשיפור המתמיד' },
    { icon: 'Headphones', title: 'תמיכה 24/7', description: 'צוות מומחים זמין בכל שעה לעזור לכם להצליח' },
  ];

  const features = featuresContent.items?.length ? featuresContent.items : defaultFeatures;

  // Generate gradient colors based on theme
  const getGradientForIndex = (index: number) => {
    const gradients = [
      `linear-gradient(to bottom right, ${colors.primary}, ${colors.accent})`,
      `linear-gradient(to bottom right, ${colors.accent}, ${colors.primary})`,
      `linear-gradient(to bottom right, ${colors.secondary}, ${colors.primary})`,
      `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary})`,
      `linear-gradient(to bottom right, ${colors.accent}, ${colors.secondary})`,
      `linear-gradient(to bottom right, ${colors.secondary}, ${colors.accent})`,
    ];
    return gradients[index % gradients.length];
  };

  return (
    <section 
      ref={sectionRef}
      className={`relative py-32 px-4 overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
      style={{ fontFamily: fonts.body }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      {/* Decorative elements */}
      <div 
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" 
        style={{ backgroundColor: `${colors.primary}10` }}
      />
      <div 
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl" 
        style={{ backgroundColor: `${colors.accent}10` }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium mb-6"
            style={{ 
              backgroundColor: `${colors.primary}15`,
              color: colors.primary,
              borderRadius: getButtonRadius(),
            }}
          >
            <LucideIcons.Sparkles className="w-4 h-4" />
            <span>למה לבחור בנו</span>
          </div>
          <EditableText
            value={featuresContent.title || 'כל מה שצריך בפלטפורמה אחת'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            as="h2"
            style={{ fontFamily: fonts.heading }}
          />
          <EditableText
            value={featuresContent.subtitle || 'הכלים המתקדמים ביותר ליצירת נוכחות דיגיטלית מרשימה'}
            onChange={(value) => updateContent('subtitle', value)}
            isEditing={isEditing}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            as="p"
          />
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = getIcon(feature.icon);
            const gradient = getGradientForIndex(index);
            
            return (
              <Card 
                key={index}
                className={`group relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  boxShadow: `0 4px 20px -5px ${colors.primary}20`,
                  borderRadius: getCardRadius(),
                }}
              >
                {/* Gradient glow on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                  style={{ background: gradient }}
                />
                
                {/* Top gradient line */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: gradient }}
                />
                
                <CardContent className="p-8">
                  {/* Icon with gradient background */}
                  <div 
                    className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg"
                    style={{ background: gradient }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                    {/* Glow effect */}
                    <div 
                      className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                      style={{ background: gradient }}
                    />
                  </div>

                  {/* Title */}
                  <EditableText
                    value={feature.title || `תכונה ${index + 1}`}
                    onChange={(value) => updateItem(index, 'title', value)}
                    isEditing={isEditing}
                    className="text-xl font-bold mb-3 transition-colors"
                    as="h3"
                    style={{ fontFamily: fonts.heading }}
                  />

                  {/* Description */}
                  <EditableText
                    value={feature.description || 'תיאור קצר של התכונה'}
                    onChange={(value) => updateItem(index, 'description', value)}
                    isEditing={isEditing}
                    className="text-muted-foreground leading-relaxed"
                    as="p"
                  />

                  {/* Arrow indicator on hover */}
                  <div 
                    className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0"
                    style={{ color: colors.primary }}
                  >
                    <span className="text-sm font-medium">למידע נוסף</span>
                    <LucideIcons.ArrowLeft className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
