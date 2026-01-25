import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Button } from '@/components/ui/button';

interface HeroContent {
  headline?: string;
  subheadline?: string;
  cta_primary?: { text: string; url: string };
  cta_secondary?: { text: string; url: string };
  background_image?: string;
  overlay_opacity?: number;
}

export function HeroSection({ 
  content, 
  isEditing, 
  onContentChange,
  onSelect,
  isSelected 
}: SectionProps) {
  const heroContent = content as HeroContent;
  
  const updateContent = (key: keyof HeroContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  return (
    <section 
      className={`relative min-h-[500px] flex items-center justify-center overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
      style={{
        backgroundImage: heroContent.background_image 
          ? `url(${heroContent.background_image})` 
          : 'var(--gradient-primary)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-foreground/60"
        style={{ opacity: heroContent.overlay_opacity ?? 0.5 }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <EditableText
          value={heroContent.headline || 'כותרת ראשית'}
          onChange={(value) => updateContent('headline', value)}
          isEditing={isEditing}
          className="text-4xl md:text-6xl font-bold text-white mb-6"
          as="h1"
        />
        
        <EditableText
          value={heroContent.subheadline || 'תיאור משני שמסביר את הערך שלך'}
          onChange={(value) => updateContent('subheadline', value)}
          isEditing={isEditing}
          className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto"
          as="p"
        />

        <div className="flex flex-wrap gap-4 justify-center">
          {heroContent.cta_primary && (
            <Button size="lg" className="text-lg px-8">
              <EditableText
                value={heroContent.cta_primary.text || 'לחצו כאן'}
                onChange={(value) => updateContent('cta_primary', { 
                  ...heroContent.cta_primary, 
                  text: value 
                })}
                isEditing={isEditing}
                className="text-inherit"
              />
            </Button>
          )}
          
          {heroContent.cta_secondary && (
            <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 border-white text-white hover:bg-white/20">
              <EditableText
                value={heroContent.cta_secondary.text || 'למידע נוסף'}
                onChange={(value) => updateContent('cta_secondary', { 
                  ...heroContent.cta_secondary, 
                  text: value 
                })}
                isEditing={isEditing}
                className="text-inherit"
              />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
