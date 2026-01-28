import type { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { ImagePickerDialog } from '../ImagePickerDialog';
import { Button } from '@/components/ui/button';
import { Award, CheckCircle2, Clock, Image as ImageIcon, Star, Target, TrendingUp, Users } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

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

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Award,
  TrendingUp,
  Target,
  Clock,
  Star,
};

function getStatIcon(iconName?: string) {
  return iconMap[iconName || 'Users'] || Users;
}

function useAnimatedStats(stats: Stat[], isVisible: boolean) {
  const count0 = useCountUp(parseInt(stats[0]?.value || '0', 10), 2000, isVisible);
  const count1 = useCountUp(parseInt(stats[1]?.value || '0', 10), 2000, isVisible);
  const count2 = useCountUp(parseInt(stats[2]?.value || '0', 10), 2000, isVisible);
  const count3 = useCountUp(parseInt(stats[3]?.value || '0', 10), 2000, isVisible);
  return [count0, count1, count2, count3];
}

function getStatSuffix(value?: string) {
  if (!value) return '';
  if (value.includes('%')) return '%';
  if (value.includes('+')) return '+';
  return '';
}

// ─── Shared variant props type ───────────────────────────────────────────────

interface VariantProps {
  aboutContent: AboutContent;
  stats: Stat[];
  features: string[];
  animatedStats: number[];
  isVisible: boolean;
  isEditing?: boolean;
  updateContent: (key: keyof AboutContent, value: unknown) => void;
  updateStat: (index: number, field: keyof Stat, value: string) => void;
  colors: { primary: string; secondary: string; accent: string };
  fonts: { heading: string; body: string };
  getButtonRadius: () => string;
  getCardRadius: () => string;
}

// ─── Default (Story) Variant ─────────────────────────────────────────────────

function DefaultVariant({
  aboutContent,
  stats,
  features,
  animatedStats,
  isVisible,
  isEditing,
  updateContent,
  updateStat,
  colors,
  fonts,
  getButtonRadius,
  getCardRadius,
}: VariantProps) {
  return (
    <>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30" />

      {/* Decorative shapes */}
      <div
        className="absolute top-20 right-0 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: `${colors.primary}10` }}
      />
      <div
        className="absolute bottom-20 left-0 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: `${colors.accent}10` }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl blur-2xl opacity-20"
                style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.accent}, ${colors.primary})` }}
              />
              <div
                className="absolute -inset-1 rounded-2xl"
                style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.accent}, ${colors.primary})` }}
              />

              <div
                className="relative overflow-hidden bg-muted aspect-[4/3]"
                style={{ borderRadius: getCardRadius() }}
              >
                {aboutContent.image ? (
                  <img src={aboutContent.image} alt="אודות" className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: `linear-gradient(to bottom right, ${colors.primary}15, ${colors.accent}15)` }}
                  >
                    <ImageIcon className="w-20 h-20 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            </div>

            {/* Floating stats card */}
            <div
              className="absolute -bottom-8 -left-8 p-6 shadow-2xl bg-card/90 backdrop-blur-xl border border-border/50"
              style={{ borderRadius: getCardRadius() }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.accent})` }}
                >
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
                  <Button size="sm" variant="secondary" className="glass" style={{ borderRadius: getButtonRadius() }}>
                    <ImageIcon className="h-4 w-4 ml-2" />
                    {aboutContent.image ? 'החלף תמונה' : 'הוסף תמונה'}
                  </Button>
                </ImagePickerDialog>
              </div>
            )}
          </div>

          {/* Content Side */}
          <div
            className={`space-y-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
            style={{ transitionDelay: '200ms' }}
          >
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
              style={{
                backgroundColor: `${colors.primary}15`,
                color: colors.primary,
                borderRadius: getButtonRadius(),
              }}
            >
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
              style={{ fontFamily: fonts.heading }}
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
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primary}15` }}
                  >
                    <CheckCircle2 className="w-4 h-4" style={{ color: colors.primary }} />
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
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `linear-gradient(to bottom right, ${colors.primary}25, ${colors.accent}25)` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: colors.primary }} />
                      </div>
                      <div className="text-3xl font-bold">
                        {animatedStats[index]}
                        {getStatSuffix(stat.value)}
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
    </>
  );
}

// ─── Team Variant ────────────────────────────────────────────────────────────

function TeamVariant({
  aboutContent,
  stats,
  animatedStats,
  isVisible,
  isEditing,
  updateContent,
  updateStat,
  colors,
  fonts,
  getButtonRadius,
  getCardRadius,
}: VariantProps) {
  return (
    <>
      {/* Clean subtle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/10 to-background" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-10"
        style={{ backgroundColor: colors.primary }}
      />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Top tag */}
        <div
          className={`inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}
          style={{
            backgroundColor: `${colors.primary}12`,
            color: colors.primary,
            borderRadius: getButtonRadius(),
            border: `1px solid ${colors.primary}25`,
          }}
        >
          <Users className="w-4 h-4" />
          <span>הצוות שלנו</span>
        </div>

        {/* Large centered headline */}
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <EditableText
            value={aboutContent.title || 'הצוות שמאחורי ההצלחה'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight"
            as="h2"
            style={{ fontFamily: fonts.heading }}
          />
        </div>

        {/* Description */}
        <div
          className={`max-w-2xl mx-auto mt-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '150ms' }}
        >
          <EditableText
            value={aboutContent.content || 'אנחנו צוות של אנשי מקצוע שמחויבים ליצירתיות, חדשנות ומצוינות. כל חבר צוות מביא ניסיון ייחודי שתורם להצלחה המשותפת.'}
            onChange={(value) => updateContent('content', value)}
            isEditing={isEditing}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed"
            as="p"
          />
        </div>

        {/* Image */}
        <div
          className={`relative mt-12 mx-auto max-w-3xl overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          style={{ transitionDelay: '250ms', borderRadius: getCardRadius() }}
        >
          {aboutContent.image ? (
            <img
              src={aboutContent.image}
              alt="הצוות"
              className="w-full aspect-[21/9] object-cover"
            />
          ) : (
            <div
              className="w-full aspect-[21/9] flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.accent}08)` }}
            >
              <ImageIcon className="w-16 h-16 text-muted-foreground/20" />
            </div>
          )}

          {isEditing && (
            <div className="absolute top-4 right-4 z-10">
              <ImagePickerDialog
                onSelect={(url) => updateContent('image', url)}
                currentImage={aboutContent.image}
              >
                <Button size="sm" variant="secondary" className="glass" style={{ borderRadius: getButtonRadius() }}>
                  <ImageIcon className="h-4 w-4 ml-2" />
                  {aboutContent.image ? 'החלף תמונה' : 'הוסף תמונה'}
                </Button>
              </ImagePickerDialog>
            </div>
          )}
        </div>

        {/* Horizontal stat cards strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14">
          {stats.map((stat, index) => {
            const Icon = getStatIcon(stat.icon);
            return (
              <div
                key={index}
                className={`group relative p-6 border border-border/60 backdrop-blur-sm transition-all duration-500 hover:border-transparent hover:shadow-lg ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{
                  transitionDelay: `${350 + index * 80}ms`,
                  borderRadius: getCardRadius(),
                  background: 'var(--card)',
                }}
              >
                {/* Hover gradient border effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 -z-10 blur-sm transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}30, ${colors.accent}30)`,
                    borderRadius: getCardRadius(),
                  }}
                />
                <Icon className="w-6 h-6 mx-auto mb-3" style={{ color: colors.primary }} />
                <div className="text-4xl font-bold mb-1" style={{ fontFamily: fonts.heading }}>
                  {animatedStats[index]}
                  {getStatSuffix(stat.value)}
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
    </>
  );
}

// ─── Timeline Variant ────────────────────────────────────────────────────────

function TimelineVariant({
  aboutContent,
  features,
  stats,
  animatedStats,
  isVisible,
  isEditing,
  updateContent,
  updateStat,
  colors,
  fonts,
  getButtonRadius,
  getCardRadius,
}: VariantProps) {
  return (
    <>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div
        className="absolute top-1/4 left-0 w-72 h-72 rounded-full blur-[100px] opacity-15"
        style={{ backgroundColor: colors.accent }}
      />
      <div
        className="absolute bottom-1/4 right-0 w-72 h-72 rounded-full blur-[100px] opacity-15"
        style={{ backgroundColor: colors.primary }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium mb-6"
            style={{
              backgroundColor: `${colors.primary}15`,
              color: colors.primary,
              borderRadius: getButtonRadius(),
            }}
          >
            <Clock className="w-4 h-4" />
            <span>הסיפור שלנו</span>
          </div>

          <EditableText
            value={aboutContent.title || 'המסע שלנו לאורך השנים'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className="text-4xl md:text-5xl font-bold leading-tight"
            as="h2"
            style={{ fontFamily: fonts.heading }}
          />

          <div className="max-w-2xl mx-auto mt-6">
            <EditableText
              value={aboutContent.content || 'מההתחלה הצנועה ועד היום, עברנו דרך ארוכה של צמיחה, למידה וחדשנות. כל אבן דרך סיפרה פרק חדש בסיפור שלנו.'}
              onChange={(value) => updateContent('content', value)}
              isEditing={isEditing}
              className="text-lg text-muted-foreground leading-relaxed"
              as="p"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-0 items-start">
          {/* Left: Image */}
          <div className={`lg:sticky lg:top-32 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative overflow-hidden" style={{ borderRadius: getCardRadius() }}>
              {aboutContent.image ? (
                <img src={aboutContent.image} alt="אודות" className="w-full aspect-square object-cover" />
              ) : (
                <div
                  className="w-full aspect-square flex items-center justify-center"
                  style={{ background: `linear-gradient(to bottom right, ${colors.primary}10, ${colors.accent}10)` }}
                >
                  <ImageIcon className="w-16 h-16 text-muted-foreground/20" />
                </div>
              )}

              {isEditing && (
                <div className="absolute top-4 right-4 z-10">
                  <ImagePickerDialog
                    onSelect={(url) => updateContent('image', url)}
                    currentImage={aboutContent.image}
                  >
                    <Button size="sm" variant="secondary" className="glass" style={{ borderRadius: getButtonRadius() }}>
                      <ImageIcon className="h-4 w-4 ml-2" />
                      {aboutContent.image ? 'החלף תמונה' : 'הוסף תמונה'}
                    </Button>
                  </ImagePickerDialog>
                </div>
              )}
            </div>

            {/* Small stats row under image */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {stats.slice(0, 2).map((stat, index) => {
                const Icon = getStatIcon(stat.icon);
                return (
                  <div
                    key={index}
                    className="p-4 border border-border/60 text-center"
                    style={{ borderRadius: getCardRadius(), background: 'var(--card)' }}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: colors.primary }} />
                    <div className="text-2xl font-bold" style={{ fontFamily: fonts.heading }}>
                      {animatedStats[index]}{getStatSuffix(stat.value)}
                    </div>
                    <EditableText
                      value={stat.label || 'תיאור'}
                      onChange={(value) => updateStat(index, 'label', value)}
                      isEditing={isEditing}
                      className="text-xs text-muted-foreground"
                      as="p"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center: Timeline line (visible on lg) */}
          <div className="hidden lg:flex flex-col items-center mx-8">
            <div
              className="w-3 h-3 rounded-full mb-2"
              style={{ backgroundColor: colors.primary }}
            />
            <div
              className="w-0.5 flex-1 min-h-[400px]"
              style={{ background: `linear-gradient(to bottom, ${colors.primary}, ${colors.accent}40, transparent)` }}
            />
          </div>

          {/* Right: Timeline milestones */}
          <div className="space-y-8 pt-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`relative flex items-start gap-4 transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${300 + index * 150}ms` }}
              >
                {/* Dot */}
                <div className="flex-shrink-0 relative mt-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center border-2"
                    style={{
                      borderColor: colors.primary,
                      backgroundColor: `${colors.primary}15`,
                    }}
                  >
                    <span className="text-sm font-bold" style={{ color: colors.primary }}>
                      {index + 1}
                    </span>
                  </div>
                  {/* Connecting line between milestones (mobile/default) */}
                  {index < features.length - 1 && (
                    <div
                      className="lg:hidden absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8"
                      style={{ backgroundColor: `${colors.primary}30` }}
                    />
                  )}
                </div>

                {/* Content card */}
                <div
                  className="flex-1 p-5 border border-border/50 shadow-sm hover:shadow-md transition-shadow"
                  style={{ borderRadius: getCardRadius(), background: 'var(--card)' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4" style={{ color: colors.primary }} />
                    <span className="text-sm font-medium" style={{ color: colors.primary }}>
                      אבן דרך {index + 1}
                    </span>
                  </div>
                  <p className="text-foreground font-medium">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Stats Variant ───────────────────────────────────────────────────────────

function StatsVariant({
  aboutContent,
  stats,
  features,
  animatedStats,
  isVisible,
  isEditing,
  updateContent,
  updateStat,
  colors,
  fonts,
  getButtonRadius,
  getCardRadius,
}: VariantProps) {
  return (
    <>
      {/* Image as background with overlay */}
      <div className="absolute inset-0">
        {aboutContent.image ? (
          <>
            <img
              src={aboutContent.image}
              alt="רקע"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.95) 100%)`,
              }}
            />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}08 0%, ${colors.accent}05 50%, ${colors.primary}08 100%)`,
            }}
          />
        )}
        {/* Accent gradient orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[150px] opacity-20"
          style={{ backgroundColor: colors.primary }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[150px] opacity-15"
          style={{ backgroundColor: colors.accent }}
        />
      </div>

      {isEditing && (
        <div className="absolute top-4 right-4 z-10">
          <ImagePickerDialog
            onSelect={(url) => updateContent('image', url)}
            currentImage={aboutContent.image}
          >
            <Button size="sm" variant="secondary" className="glass" style={{ borderRadius: getButtonRadius() }}>
              <ImageIcon className="h-4 w-4 ml-2" />
              {aboutContent.image ? 'החלף רקע' : 'הוסף רקע'}
            </Button>
          </ImagePickerDialog>
        </div>
      )}

      <div className="relative max-w-6xl mx-auto text-center">
        {/* Header */}
        <div className={`mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium mb-6"
            style={{
              backgroundColor: `${colors.primary}20`,
              color: colors.primary,
              borderRadius: getButtonRadius(),
              border: `1px solid ${colors.primary}30`,
            }}
          >
            <TrendingUp className="w-4 h-4" />
            <span>המספרים מדברים</span>
          </div>

          <EditableText
            value={aboutContent.title || 'הישגים שמדברים בעד עצמם'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${aboutContent.image ? 'text-white' : ''}`}
            as="h2"
            style={{ fontFamily: fonts.heading }}
          />
        </div>

        <div
          className={`max-w-2xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '100ms' }}
        >
          <EditableText
            value={aboutContent.content || 'המספרים הבאים משקפים את המחויבות שלנו למצוינות ואת האמון שלקוחותינו נותנים בנו מדי יום.'}
            onChange={(value) => updateContent('content', value)}
            isEditing={isEditing}
            className={`text-lg leading-relaxed ${aboutContent.image ? 'text-white/70' : 'text-muted-foreground'}`}
            as="p"
          />
        </div>

        {/* Large stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = getStatIcon(stat.icon);
            return (
              <div
                key={index}
                className={`relative p-8 overflow-hidden transition-all duration-600 group ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                style={{
                  transitionDelay: `${200 + index * 100}ms`,
                  borderRadius: getCardRadius(),
                  background: aboutContent.image
                    ? 'rgba(255,255,255,0.05)'
                    : 'var(--card)',
                  border: aboutContent.image
                    ? '1px solid rgba(255,255,255,0.1)'
                    : '1px solid var(--border)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* Hover highlight */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}15, transparent)`,
                  }}
                />
                <div className="relative">
                  <Icon
                    className="w-8 h-8 mx-auto mb-4"
                    style={{ color: colors.primary }}
                  />
                  <div
                    className={`text-5xl md:text-6xl font-extrabold mb-2 ${aboutContent.image ? 'text-white' : ''}`}
                    style={{ fontFamily: fonts.heading }}
                  >
                    {animatedStats[index]}
                    <span style={{ color: colors.primary }}>
                      {getStatSuffix(stat.value)}
                    </span>
                  </div>
                  <EditableText
                    value={stat.label || 'תיאור'}
                    onChange={(value) => updateStat(index, 'label', value)}
                    isEditing={isEditing}
                    className={`text-sm ${aboutContent.image ? 'text-white/60' : 'text-muted-foreground'}`}
                    as="p"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Features as horizontal pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 px-5 py-3 text-sm transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{
                transitionDelay: `${600 + index * 80}ms`,
                borderRadius: getButtonRadius(),
                background: aboutContent.image
                  ? 'rgba(255,255,255,0.06)'
                  : `${colors.primary}08`,
                border: aboutContent.image
                  ? '1px solid rgba(255,255,255,0.1)'
                  : `1px solid ${colors.primary}20`,
                color: aboutContent.image ? 'rgba(255,255,255,0.8)' : undefined,
              }}
            >
              <Star className="w-3.5 h-3.5" style={{ color: colors.accent }} />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function AboutSection({
  content,
  variant,
  isEditing,
  onContentChange,
  onSelect,
  isSelected,
}: SectionProps) {
  const aboutContent = content as AboutContent;
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { colors, fonts, getButtonRadius, getCardRadius } = useTheme();

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

  const updateContent = useCallback(
    (key: keyof AboutContent, value: unknown) => {
      onContentChange?.({ ...content, [key]: value });
    },
    [content, onContentChange]
  );

  const updateStat = useCallback(
    (index: number, field: keyof Stat, value: string) => {
      const currentStats = [...((aboutContent.stats?.length ? aboutContent.stats : defaultStats))];
      currentStats[index] = { ...currentStats[index], [field]: value };
      updateContent('stats', currentStats);
    },
    [aboutContent.stats, updateContent]
  );

  const stats = aboutContent.stats?.length ? aboutContent.stats : defaultStats;
  const features = aboutContent.features?.length ? aboutContent.features : defaultFeatures;
  const animatedStats = useAnimatedStats(stats, isVisible);

  const variantProps: VariantProps = {
    aboutContent,
    stats,
    features,
    animatedStats,
    isVisible,
    isEditing,
    updateContent,
    updateStat,
    colors,
    fonts,
    getButtonRadius,
    getCardRadius,
  };

  const renderVariant = () => {
    switch (variant) {
      case 'team':
        return <TeamVariant {...variantProps} />;
      case 'timeline':
        return <TimelineVariant {...variantProps} />;
      case 'stats':
        return <StatsVariant {...variantProps} />;
      default:
        return <DefaultVariant {...variantProps} />;
    }
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
      {renderVariant()}
    </section>
  );
}
