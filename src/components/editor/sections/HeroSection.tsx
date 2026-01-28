import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { ImagePickerDialog } from '../ImagePickerDialog';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, ArrowLeft, Sparkles, ChevronDown, Play } from 'lucide-react';
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
  variant = 'default',
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

  const ImagePicker = isEditing ? (
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
  ) : null;

  // ─── VARIANT: SPLIT ─────────────────────────────────────
  if (variant === 'split') {
    return (
      <section
        className={`relative min-h-[85vh] overflow-hidden transition-all ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
        onClick={onSelect}
        style={{ fontFamily: fonts.body }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30" />
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20" style={{ backgroundColor: colors.primary }} />

        <div className="relative z-10 flex items-center min-h-[85vh] px-4">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Side */}
            <div className="space-y-8 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium animate-fade-in-down" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary, borderRadius: getButtonRadius() }}>
                <Sparkles className="w-4 h-4" />
                <EditableText value={heroContent.badge_text || 'חדש! הצטרפו אלינו היום'} onChange={(value) => updateContent('badge_text', value)} isEditing={isEditing} as="span" />
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <EditableText value={heroContent.headline || 'צרו חוויה דיגיטלית שמדברת אליכם'} onChange={(value) => updateContent('headline', value)} isEditing={isEditing} className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight" as="h1" style={{ fontFamily: fonts.heading }} />
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <EditableText value={heroContent.subheadline || 'פלטפורמה חכמה ליצירת אתרים מקצועיים. עיצוב מרהיב, ביצועים מושלמים.'} onChange={(value) => updateContent('subheadline', value)} isEditing={isEditing} className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed" as="p" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Button size="lg" className="group relative overflow-hidden text-lg px-8 py-6 font-bold transition-all duration-300 hover:scale-105" style={{ backgroundColor: colors.primary, color: '#ffffff', borderRadius: getButtonRadius() }}>
                  <span className="relative z-10 flex items-center gap-2">
                    <EditableText value={heroContent.cta_text || 'התחילו בחינם'} onChange={(value) => updateContent('cta_text', value)} isEditing={isEditing} as="span" />
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  </span>
                </Button>
                <Button size="lg" variant="outline" className="group text-lg px-8 py-6 font-medium transition-all duration-300" style={{ borderRadius: getButtonRadius() }}>
                  <EditableText value={heroContent.secondary_cta_text || 'צפו בדוגמאות'} onChange={(value) => updateContent('secondary_cta_text', value)} isEditing={isEditing} as="span" />
                </Button>
              </div>
            </div>

            {/* Image Side */}
            <div className="relative order-1 lg:order-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-30" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` }} />
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl" style={{ borderRadius: '16px' }}>
                {heroContent.background_image ? (
                  <img src={heroContent.background_image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}20)` }}>
                    <ImageIcon className="w-20 h-20 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              {ImagePicker}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── VARIANT: MINIMAL ───────────────────────────────────
  if (variant === 'minimal') {
    return (
      <section
        className={`relative min-h-[80vh] overflow-hidden transition-all ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
        onClick={onSelect}
        style={{ fontFamily: fonts.body }}
      >
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <div className="animate-fade-in-up">
              <EditableText value={heroContent.headline || 'פשוט. יפה. מקצועי.'} onChange={(value) => updateContent('headline', value)} isEditing={isEditing} className="text-5xl md:text-7xl lg:text-[6rem] font-extrabold leading-[1.05] tracking-tight" as="h1" style={{ fontFamily: fonts.heading }} />
            </div>
            <div className="w-20 h-0.5 mx-auto animate-fade-in" style={{ backgroundColor: colors.primary, animationDelay: '0.2s' }} />
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <EditableText value={heroContent.subheadline || 'אנחנו מאמינים שפחות זה יותר. עיצוב נקי, חוויה חלקה, תוצאות מדהימות.'} onChange={(value) => updateContent('subheadline', value)} isEditing={isEditing} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light" as="p" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" className="text-base px-10 py-6 font-semibold transition-all duration-300 hover:scale-105" style={{ backgroundColor: colors.primary, color: '#ffffff', borderRadius: getButtonRadius() }}>
                <EditableText value={heroContent.cta_text || 'בואו נתחיל'} onChange={(value) => updateContent('cta_text', value)} isEditing={isEditing} as="span" />
              </Button>
            </div>
          </div>
        </div>
        {ImagePicker}
      </section>
    );
  }

  // ─── VARIANT: GRADIENT / VIDEO ──────────────────────────
  if (variant === 'video' || variant === 'gradient') {
    return (
      <section
        className={`relative min-h-[95vh] overflow-hidden transition-all ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
        onClick={onSelect}
        style={{ fontFamily: fonts.body }}
      >
        <div className="absolute inset-0 bg-[length:400%_400%] animate-gradient" style={{ background: `linear-gradient(-45deg, ${colors.primary}, ${colors.secondary}, ${colors.accent}, ${colors.primary})`, backgroundSize: '400% 400%' }} />
        {heroContent.background_image && <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroContent.background_image})` }} />}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 noise-texture" />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[95vh] px-4">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="animate-fade-in-down">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-all">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <EditableText value={heroContent.headline || 'חוויה שלא תשכחו'} onChange={(value) => updateContent('headline', value)} isEditing={isEditing} className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight tracking-tight drop-shadow-2xl" as="h1" style={{ fontFamily: fonts.heading }} />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <EditableText value={heroContent.subheadline || 'צלילה לעולם של עיצוב, יצירתיות וחדשנות. הצטרפו למסע.'} onChange={(value) => updateContent('subheadline', value)} isEditing={isEditing} className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-light" as="p" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <Button size="lg" className="group text-lg px-10 py-7 font-bold bg-white text-black shadow-2xl transition-all duration-300 hover:scale-105" style={{ borderRadius: getButtonRadius() }}>
                <span className="flex items-center gap-2">
                  <EditableText value={heroContent.cta_text || 'גלו עוד'} onChange={(value) => updateContent('cta_text', value)} isEditing={isEditing} as="span" />
                  <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                </span>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 font-medium bg-white/5 backdrop-blur-md border-white/30 text-white hover:bg-white/15 transition-all" style={{ borderRadius: getButtonRadius() }}>
                <EditableText value={heroContent.secondary_cta_text || 'צרו קשר'} onChange={(value) => updateContent('secondary_cta_text', value)} isEditing={isEditing} as="span" />
              </Button>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
            <ChevronDown className="w-6 h-6 text-white/50" />
          </div>
        </div>
        {ImagePicker}
      </section>
    );
  }

  // ─── DEFAULT VARIANT (centered) ─────────────────────────
  return (
    <section
      className={`relative min-h-[90vh] overflow-hidden transition-all ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
      onClick={onSelect}
      style={{ fontFamily: fonts.body }}
    >
      <div className="absolute inset-0 animated-gradient-bg" style={{ background: `linear-gradient(135deg, ${colors.primary}40 0%, ${colors.secondary}60 50%, ${colors.accent}40 100%)` }} />
      {heroContent.background_image && <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroContent.background_image})` }} />}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" style={{ opacity: heroContent.overlay_opacity ?? 0.7 }} />
      <div className="absolute inset-0" style={{ background: 'var(--gradient-mesh)', opacity: 0.5 }} />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="floating-orb w-[500px] h-[500px] -top-40 -right-40 animate-pulse-slow" style={{ backgroundColor: `${colors.primary}30` }} />
      <div className="floating-orb w-[600px] h-[600px] -bottom-60 -left-60 animate-pulse-slow" style={{ backgroundColor: `${colors.accent}20`, animationDelay: '2s' }} />
      <div className="floating-orb w-[300px] h-[300px] top-1/3 right-1/4 animate-pulse-slow" style={{ backgroundColor: `${colors.secondary}15`, animationDelay: '4s' }} />
      <div className="absolute inset-0 noise-texture" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-dark border border-white/20 animate-fade-in-down" style={{ borderRadius: getButtonRadius() }}>
            <Sparkles className="w-4 h-4" style={{ color: colors.accent }} />
            <EditableText value={heroContent.badge_text || 'חדש! הצטרפו אלינו היום'} onChange={(value) => updateContent('badge_text', value)} isEditing={isEditing} className="text-sm font-medium text-white/90" as="span" />
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <EditableText value={heroContent.headline || 'צרו אתרים מדהימים בקלות'} onChange={(value) => updateContent('headline', value)} isEditing={isEditing} className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight tracking-tight drop-shadow-2xl" as="h1" style={{ fontFamily: fonts.heading }} />
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <EditableText value={heroContent.subheadline || 'פלטפורמה חכמה ליצירת אתרים מקצועיים. עיצוב מרהיב, ביצועים מושלמים, תוצאות מדהימות.'} onChange={(value) => updateContent('subheadline', value)} isEditing={isEditing} className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-light" as="p" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Button size="lg" className="group relative overflow-hidden text-lg px-10 py-7 font-bold shadow-2xl shadow-black/30 transition-all duration-300 hover:scale-105 hover:shadow-white/20" style={{ backgroundColor: colors.primary, color: '#ffffff', borderRadius: getButtonRadius() }}>
              <span className="relative z-10 flex items-center gap-2">
                <EditableText value={heroContent.cta_text || 'התחילו בחינם'} onChange={(value) => updateContent('cta_text', value)} isEditing={isEditing} as="span" />
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity" style={{ background: `linear-gradient(to right, ${colors.accent}, ${colors.primary})` }} />
            </Button>
            <Button size="lg" variant="outline" className="group bg-white/5 backdrop-blur-md border-white/30 text-white hover:bg-white/15 hover:border-white/50 text-lg px-10 py-7 font-medium transition-all duration-300" style={{ borderRadius: getButtonRadius() }}>
              <EditableText value={heroContent.secondary_cta_text || 'צפו בדוגמאות'} onChange={(value) => updateContent('secondary_cta_text', value)} isEditing={isEditing} as="span" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 pt-12 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center text-white text-xs font-bold" style={{ zIndex: 5 - i, background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.accent})` }}>
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-white/70 text-sm">
              <span className="text-white font-semibold">1,000+</span> עסקים כבר משתמשים
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <div className="flex flex-col items-center gap-2 text-white/50">
            <span className="text-xs font-medium">גללו למטה</span>
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {ImagePicker}
    </section>
  );
}
