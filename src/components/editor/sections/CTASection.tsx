import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Zap, Star, Rocket, ChevronLeft } from 'lucide-react';
import { useRef, useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface CTAContent {
  headline?: string;
  description?: string;
  button_text?: string;
  button_url?: string;
  secondary_text?: string;
  background_color?: string;
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function useVisibility() {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

/** Deterministic pseudo-random particles so they don't shift on re-render */
function useParticles(count: number) {
  return useMemo(() => {
    const items: { left: string; top: string; delay: string; duration: string }[] = [];
    let seed = 42;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < count; i++) {
      items.push({
        left: `${rand() * 100}%`,
        top: `${rand() * 100}%`,
        delay: `${rand() * 5}s`,
        duration: `${4 + rand() * 4}s`,
      });
    }
    return items;
  }, [count]);
}

// ---------------------------------------------------------------------------
// Variant: default  --  full-width gradient, floating particles, centered CTA
// ---------------------------------------------------------------------------

function DefaultVariant({
  ctaContent,
  isEditing,
  updateContent,
}: {
  ctaContent: CTAContent;
  isEditing?: boolean;
  updateContent: (key: keyof CTAContent, value: unknown) => void;
}) {
  const { colors, fonts, getButtonRadius } = useTheme();
  const { ref, isVisible } = useVisibility();
  const particles = useParticles(20);

  return (
    <section ref={ref} className="relative py-32 px-4 overflow-hidden" style={{ fontFamily: fonts.body }}>
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent}, ${colors.primary})`,
          backgroundSize: '200% 200%',
        }}
      />

      {/* Mesh overlay */}
      <div className="absolute inset-0 opacity-50" style={{ background: 'var(--gradient-mesh)' }} />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{ left: p.left, top: p.top, animationDelay: p.delay, animationDuration: p.duration }}
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
        <div
          className={`inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
          style={{ borderRadius: getButtonRadius() }}
        >
          <Sparkles className="w-4 h-4" style={{ color: colors.accent }} />
          <span className="text-white/90 text-sm font-medium">הצטרפו עכשיו וקבלו 30% הנחה</span>
        </div>

        {/* Headline */}
        <div
          className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '100ms' }}
        >
          <EditableText
            value={ctaContent.headline || 'מוכנים להתחיל את המסע?'}
            onChange={(v) => updateContent('headline', v)}
            isEditing={isEditing}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight"
            as="h2"
            style={{ fontFamily: fonts.heading }}
          />
        </div>

        {/* Description */}
        <div
          className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '200ms' }}
        >
          <EditableText
            value={ctaContent.description || 'הצטרפו לאלפי העסקים שכבר משתמשים בפלטפורמה שלנו ומגדילים את ההכנסות שלהם'}
            onChange={(v) => updateContent('description', v)}
            isEditing={isEditing}
            className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed"
            as="p"
          />
        </div>

        {/* CTA Button */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          <Button
            size="lg"
            className="group relative overflow-hidden bg-white text-lg px-12 py-8 font-bold shadow-2xl shadow-black/30 transition-all duration-300 hover:scale-105"
            style={{ borderRadius: getButtonRadius(), color: colors.primary }}
          >
            <span className="relative z-10 flex items-center gap-3">
              <EditableText
                value={ctaContent.button_text || 'התחילו בחינם עכשיו'}
                onChange={(v) => updateContent('button_text', v)}
                isEditing={isEditing}
                as="span"
              />
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
            </span>
            <div
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
              style={{ background: `linear-gradient(to right, transparent, ${colors.primary}30, transparent)` }}
            />
            <div
              className="absolute inset-0 animate-ping opacity-20 bg-white"
              style={{ animationDuration: '2s', borderRadius: getButtonRadius() }}
            />
          </Button>

          <EditableText
            value={ctaContent.secondary_text || 'ללא כרטיס אשראי • התחילו תוך 30 שניות'}
            onChange={(v) => updateContent('secondary_text', v)}
            isEditing={isEditing}
            className="text-white/60 text-sm"
            as="p"
          />
        </div>

        {/* Trust badges */}
        <div
          className={`flex items-center justify-center gap-8 mt-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <div className="flex items-center gap-2 text-white/60">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    zIndex: 3 - i,
                    background: `linear-gradient(to bottom right, ${colors.accent}, ${colors.primary})`,
                    borderColor: colors.primary,
                  }}
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span className="text-sm">הצטרפו ל-5,000+ משתמשים</span>
          </div>

          <div className="flex items-center gap-1 text-white/60">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-4 h-4" style={{ fill: colors.accent, color: colors.accent }} />
            ))}
            <span className="text-sm mr-2">4.9/5</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Variant: split  --  two-column layout with decorative right panel
// ---------------------------------------------------------------------------

function SplitVariant({
  ctaContent,
  isEditing,
  updateContent,
}: {
  ctaContent: CTAContent;
  isEditing?: boolean;
  updateContent: (key: keyof CTAContent, value: unknown) => void;
}) {
  const { colors, fonts, getButtonRadius, getCardRadius } = useTheme();
  const { ref, isVisible } = useVisibility();

  return (
    <section ref={ref} className="relative py-20 px-4 overflow-hidden bg-white dark:bg-slate-950" style={{ fontFamily: fonts.body }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left column -- text + CTA */}
        <div className="order-2 md:order-1 text-right">
          <div
            className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
          >
            <div
              className="inline-block px-4 py-1.5 text-sm font-semibold mb-6"
              style={{
                backgroundColor: `${colors.primary}15`,
                color: colors.primary,
                borderRadius: getButtonRadius(),
              }}
            >
              <Rocket className="inline w-4 h-4 ml-1 -mt-0.5" />
              הזדמנות מיוחדת
            </div>
          </div>

          <div
            className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
            style={{ transitionDelay: '100ms' }}
          >
            <EditableText
              value={ctaContent.headline || 'הגיע הזמן לקחת את העסק שלכם צעד אחד קדימה'}
              onChange={(v) => updateContent('headline', v)}
              isEditing={isEditing}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-slate-900 dark:text-white"
              as="h2"
              style={{ fontFamily: fonts.heading }}
            />
          </div>

          <div
            className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <EditableText
              value={ctaContent.description || 'הפלטפורמה שלנו עוזרת לעסקים בכל גודל לצמוח, עם כלים חכמים ותמיכה אישית'}
              onChange={(v) => updateContent('description', v)}
              isEditing={isEditing}
              className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed"
              as="p"
            />
          </div>

          <div
            className={`flex flex-wrap items-center gap-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <Button
              size="lg"
              className="group text-white text-lg px-10 py-7 font-bold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              style={{ backgroundColor: colors.primary, borderRadius: getButtonRadius() }}
            >
              <span className="flex items-center gap-2">
                <EditableText
                  value={ctaContent.button_text || 'התחילו עכשיו'}
                  onChange={(v) => updateContent('button_text', v)}
                  isEditing={isEditing}
                  as="span"
                />
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </span>
            </Button>

            <EditableText
              value={ctaContent.secondary_text || 'ללא התחייבות • ביטול בכל עת'}
              onChange={(v) => updateContent('secondary_text', v)}
              isEditing={isEditing}
              className="text-sm text-slate-500 dark:text-slate-400"
              as="p"
            />
          </div>
        </div>

        {/* Right column -- decorative illustration / pattern */}
        <div
          className={`order-1 md:order-2 relative transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
          }`}
        >
          <div
            className="relative w-full aspect-square max-w-md mx-auto"
            style={{ borderRadius: getCardRadius() }}
          >
            {/* Background circle */}
            <div
              className="absolute inset-4 rounded-full"
              style={{ background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}20)` }}
            />
            {/* Concentric rings */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute rounded-full border-2 animate-pulse"
                style={{
                  inset: `${20 + i * 30}px`,
                  borderColor: `${colors.primary}${20 + i * 10}`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '3s',
                }}
              />
            ))}
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl"
                style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` }}
              >
                <Rocket className="w-12 h-12 text-white" />
              </div>
            </div>
            {/* Floating badges */}
            <div
              className="absolute top-8 right-4 px-3 py-1.5 bg-white dark:bg-slate-800 shadow-lg text-xs font-bold animate-bounce"
              style={{ borderRadius: getButtonRadius(), color: colors.primary, animationDuration: '3s' }}
            >
              +58% צמיחה
            </div>
            <div
              className="absolute bottom-12 left-4 px-3 py-1.5 bg-white dark:bg-slate-800 shadow-lg text-xs font-bold animate-bounce"
              style={{ borderRadius: getButtonRadius(), color: colors.accent, animationDelay: '1s', animationDuration: '3.5s' }}
            >
              5,000+ לקוחות
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Variant: banner  --  thin horizontal compact banner
// ---------------------------------------------------------------------------

function BannerVariant({
  ctaContent,
  isEditing,
  updateContent,
}: {
  ctaContent: CTAContent;
  isEditing?: boolean;
  updateContent: (key: keyof CTAContent, value: unknown) => void;
}) {
  const { colors, fonts, getButtonRadius } = useTheme();
  const { ref, isVisible } = useVisibility();

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ fontFamily: fonts.body }}>
      <div
        className="relative py-5 px-4 md:px-8"
        style={{ backgroundColor: colors.primary }}
      >
        {/* Subtle diagonal stripes */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.1) 10px,
              rgba(255,255,255,0.1) 20px
            )`,
          }}
        />

        <div
          className={`relative z-10 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Headline -- single line */}
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-white/80 shrink-0" />
            <EditableText
              value={ctaContent.headline || 'מבצע מיוחד לזמן מוגבל — 30% הנחה על כל התוכניות!'}
              onChange={(v) => updateContent('headline', v)}
              isEditing={isEditing}
              className="text-white font-semibold text-base md:text-lg whitespace-nowrap"
              as="p"
              style={{ fontFamily: fonts.heading }}
            />
          </div>

          {/* Button */}
          <Button
            size="sm"
            className="shrink-0 group bg-white font-bold text-sm px-6 py-5 shadow-md transition-all duration-300 hover:scale-105"
            style={{ borderRadius: getButtonRadius(), color: colors.primary }}
          >
            <span className="flex items-center gap-2">
              <EditableText
                value={ctaContent.button_text || 'לפרטים נוספים'}
                onChange={(v) => updateContent('button_text', v)}
                isEditing={isEditing}
                as="span"
              />
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Variant: floating  --  glass-morphism card floating above plain bg
// ---------------------------------------------------------------------------

function FloatingVariant({
  ctaContent,
  isEditing,
  updateContent,
}: {
  ctaContent: CTAContent;
  isEditing?: boolean;
  updateContent: (key: keyof CTAContent, value: unknown) => void;
}) {
  const { colors, fonts, getButtonRadius, getCardRadius } = useTheme();
  const { ref, isVisible } = useVisibility();

  return (
    <section
      ref={ref}
      className="relative py-24 px-4 bg-slate-50 dark:bg-slate-900 overflow-hidden"
      style={{ fontFamily: fonts.body }}
    >
      {/* Subtle dot grid on outer section */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(${colors.primary} 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating card */}
      <div
        className={`relative z-10 max-w-3xl mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        <div
          className="relative p-10 md:p-14 text-center overflow-hidden"
          style={{
            borderRadius: getCardRadius(),
            background: `linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.6))`,
            boxShadow: `0 25px 60px -12px ${colors.primary}25, 0 0 0 1px rgba(255,255,255,0.3)`,
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Dark mode override for glass background */}
          <div
            className="absolute inset-0 hidden dark:block"
            style={{
              borderRadius: getCardRadius(),
              background: `linear-gradient(135deg, rgba(30,41,59,0.85), rgba(30,41,59,0.65))`,
            }}
          />

          {/* Glow blob top-right */}
          <div
            className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-30"
            style={{ background: colors.primary }}
          />
          {/* Glow blob bottom-left */}
          <div
            className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl opacity-20"
            style={{ background: colors.accent }}
          />

          {/* Card content */}
          <div className="relative z-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-medium border"
              style={{
                borderRadius: getButtonRadius(),
                borderColor: `${colors.primary}30`,
                color: colors.primary,
                backgroundColor: `${colors.primary}08`,
              }}
            >
              <Star className="w-3.5 h-3.5" style={{ fill: colors.accent, color: colors.accent }} />
              הצעה בלעדית
            </div>

            <EditableText
              value={ctaContent.headline || 'הצטרפו היום ותיהנו מגישה מלאה'}
              onChange={(v) => updateContent('headline', v)}
              isEditing={isEditing}
              className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-slate-900 dark:text-white"
              as="h2"
              style={{ fontFamily: fonts.heading }}
            />

            <EditableText
              value={ctaContent.description || 'תקופת ניסיון חינמית של 14 יום, ללא צורך בכרטיס אשראי. גלו את כל הכלים שיעזרו לכם לצמוח.'}
              onChange={(v) => updateContent('description', v)}
              isEditing={isEditing}
              className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed"
              as="p"
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="group text-white text-base px-10 py-7 font-bold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: getButtonRadius(),
                  boxShadow: `0 8px 24px ${colors.primary}40`,
                }}
              >
                <span className="flex items-center gap-2">
                  <EditableText
                    value={ctaContent.button_text || 'התנסו בחינם'}
                    onChange={(v) => updateContent('button_text', v)}
                    isEditing={isEditing}
                    as="span"
                  />
                  <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                </span>
              </Button>

              <EditableText
                value={ctaContent.secondary_text || 'ביטול בכל עת • ללא עלויות נסתרות'}
                onChange={(v) => updateContent('secondary_text', v)}
                isEditing={isEditing}
                className="text-sm text-slate-500 dark:text-slate-400"
                as="p"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main export -- dispatches to the correct variant
// ---------------------------------------------------------------------------

export function CTASection({
  content,
  variant,
  isEditing,
  onContentChange,
  onSelect,
  isSelected,
}: SectionProps) {
  const ctaContent = content as CTAContent;

  const updateContent = (key: keyof CTAContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  const sharedProps = { ctaContent, isEditing, updateContent };

  const renderVariant = () => {
    switch (variant) {
      case 'split':
        return <SplitVariant {...sharedProps} />;
      case 'banner':
        return <BannerVariant {...sharedProps} />;
      case 'floating':
        return <FloatingVariant {...sharedProps} />;
      default:
        return <DefaultVariant {...sharedProps} />;
    }
  };

  return (
    <div
      className={`relative transition-all ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
      onClick={onSelect}
    >
      {renderVariant()}
    </div>
  );
}
