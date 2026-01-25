import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { ImagePickerDialog } from '../ImagePickerDialog';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, ArrowLeft, Sparkles, ChevronDown } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface HeroContent {
  headline?: string;
  subheadline?: string;
  cta_text?: string;
  cta_url?: string;
  secondary_cta_text?: string;
  secondary_cta_url?: string;
  background_image?: string;
  overlay_opacity?: number;
  badge_text?: string;
}

export function HeroSection({ 
  content, 
  isEditing, 
  onContentChange,
  onSelect,
  isSelected 
}: SectionProps) {
  const heroContent = content as HeroContent;
  const { colors, fonts, getButtonRadius } = useTheme();

  const updateContent = (key: keyof HeroContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  return (
    <section 
      className={`relative min-h-[90vh] overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
      style={{ fontFamily: fonts.body }}
    >
      {/* Animated Gradient Background */}
      <div 
        className="absolute inset-0 animated-gradient-bg" 
        style={{ 
          background: `linear-gradient(135deg, ${colors.primary}40 0%, ${colors.secondary}60 50%, ${colors.accent}40 100%)`,
        }}
      />
      
      {/* Background Image (if exists) */}
      {heroContent.background_image && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroContent.background_image})` }}
        />
      )}

      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"
        style={{ opacity: heroContent.overlay_opacity ?? 0.7 }}
      />

      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0" style={{ background: 'var(--gradient-mesh)', opacity: 0.5 }} />

      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Floating Orbs - using theme colors */}
      <div 
        className="floating-orb w-[500px] h-[500px] -top-40 -right-40 animate-pulse-slow" 
        style={{ backgroundColor: `${colors.primary}30` }}
      />
      <div 
        className="floating-orb w-[600px] h-[600px] -bottom-60 -left-60 animate-pulse-slow" 
        style={{ backgroundColor: `${colors.accent}20`, animationDelay: '2s' }}
      />
      <div 
        className="floating-orb w-[300px] h-[300px] top-1/3 right-1/4 animate-pulse-slow" 
        style={{ backgroundColor: `${colors.secondary}15`, animationDelay: '4s' }}
      />

      {/* Noise Texture */}
      <div className="absolute inset-0 noise-texture" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          
          {/* Animated Badge */}
          <div 
            className="inline-flex items-center gap-2 px-5 py-2.5 glass-dark border border-white/20 animate-fade-in-down"
            style={{ borderRadius: getButtonRadius() }}
          >
            <Sparkles className="w-4 h-4" style={{ color: colors.accent }} />
            <EditableText
              value={heroContent.badge_text || 'חדש! הצטרפו אלינו היום'}
              onChange={(value) => updateContent('badge_text', value)}
              isEditing={isEditing}
              className="text-sm font-medium text-white/90"
              as="span"
            />
          </div>

          {/* Main Headline */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <EditableText
              value={heroContent.headline || 'צרו אתרים מדהימים בקלות'}
              onChange={(value) => updateContent('headline', value)}
              isEditing={isEditing}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight tracking-tight drop-shadow-2xl"
              as="h1"
              style={{ fontFamily: fonts.heading }}
            />
          </div>
          
          {/* Subheadline with gradient accent */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <EditableText
              value={heroContent.subheadline || 'פלטפורמה חכמה ליצירת אתרים מקצועיים. עיצוב מרהיב, ביצועים מושלמים, תוצאות מדהימות.'}
              onChange={(value) => updateContent('subheadline', value)}
              isEditing={isEditing}
              className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-light"
              as="p"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {/* Primary CTA - Glassmorphism Button */}
            <Button 
              size="lg"
              className="group relative overflow-hidden text-lg px-10 py-7 font-bold shadow-2xl shadow-black/30 transition-all duration-300 hover:scale-105 hover:shadow-white/20"
              style={{ 
                backgroundColor: colors.primary,
                color: '#ffffff',
                borderRadius: getButtonRadius(),
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <EditableText
                  value={heroContent.cta_text || 'התחילו בחינם'}
                  onChange={(value) => updateContent('cta_text', value)}
                  isEditing={isEditing}
                  as="span"
                />
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </span>
              {/* Animated gradient on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity"
                style={{ background: `linear-gradient(to right, ${colors.accent}, ${colors.primary})` }}
              />
            </Button>

            {/* Secondary CTA - Glass Button */}
            <Button 
              size="lg"
              variant="outline"
              className="group bg-white/5 backdrop-blur-md border-white/30 text-white hover:bg-white/15 hover:border-white/50 text-lg px-10 py-7 font-medium transition-all duration-300"
              style={{ borderRadius: getButtonRadius() }}
            >
              <EditableText
                value={heroContent.secondary_cta_text || 'צפו בדוגמאות'}
                onChange={(value) => updateContent('secondary_cta_text', value)}
                isEditing={isEditing}
                as="span"
              />
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 pt-12 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center text-white text-xs font-bold"
                  style={{ 
                    zIndex: 5 - i,
                    background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.accent})`,
                  }}
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-white/70 text-sm">
              <span className="text-white font-semibold">1,000+</span> עסקים כבר משתמשים
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <div className="flex flex-col items-center gap-2 text-white/50">
            <span className="text-xs font-medium">גללו למטה</span>
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Image Picker for Background */}
      {isEditing && (
        <div className="absolute top-4 right-4 z-20">
          <ImagePickerDialog
            onSelect={(url) => updateContent('background_image', url)}
            currentImage={heroContent.background_image}
          >
            <Button 
              size="sm" 
              variant="secondary" 
              className="glass-dark text-white border-white/20 hover:bg-white/20"
              style={{ borderRadius: getButtonRadius() }}
            >
              <ImageIcon className="h-4 w-4 ml-2" />
              {heroContent.background_image ? 'החלף רקע' : 'הוסף רקע'}
            </Button>
          </ImagePickerDialog>
        </div>
      )}
    </section>
  );
}
