import { useCallback, useEffect, useRef, useState } from 'react';
import type { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Plus, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: string;
}

interface StatsContent {
  title?: string;
  subtitle?: string;
  stats?: StatItem[];
}

const defaultStats: StatItem[] = [
  { value: 10000, suffix: '+', label: 'לקוחות מרוצים', icon: 'Users' },
  { value: 50, suffix: '+', label: 'מדינות', icon: 'Globe' },
  { value: 99, suffix: '%', label: 'שביעות רצון', icon: 'Award' },
  { value: 500, suffix: 'M+', label: 'ביקורים בחודש', icon: 'TrendingUp' },
];

const iconOptions = [
  'Users', 'Globe', 'Award', 'TrendingUp', 'Heart', 'Star', 'Zap', 'Target', 'Rocket', 'Crown',
];

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Users: LucideIcons.Users,
  Globe: LucideIcons.Globe,
  Award: LucideIcons.Award,
  TrendingUp: LucideIcons.TrendingUp,
  Heart: LucideIcons.Heart,
  Star: LucideIcons.Star,
  Zap: LucideIcons.Zap,
  Target: LucideIcons.Target,
  Rocket: LucideIcons.Rocket,
  Crown: LucideIcons.Crown,
};

function getIcon(iconName: string, className?: string, style?: React.CSSProperties) {
  const IconComponent = iconMap[iconName] || LucideIcons.Sparkles;
  return <IconComponent className={className} style={style} />;
}

// ---------------------------------------------------------------------------
// Custom hook for count-up animation
// ---------------------------------------------------------------------------
function useCountUp(end: number, duration: number = 2000, isVisible: boolean) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);

      if (currentCount !== countRef.current) {
        countRef.current = currentCount;
        setCount(currentCount);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      startTimeRef.current = null;
    };
  }, [end, duration, isVisible]);

  return count;
}

// ---------------------------------------------------------------------------
// Shared stat editing controls (value input, suffix input, icon selector, remove)
// ---------------------------------------------------------------------------
function StatEditControls({
  stat,
  onUpdate,
  onRemove,
  compact = false,
}: {
  stat: StatItem;
  onUpdate: (key: keyof StatItem, value: unknown) => void;
  onRemove: () => void;
  compact?: boolean;
}) {
  return (
    <>
      {/* Value input */}
      <input
        type="number"
        value={stat.value}
        onChange={(e) => onUpdate('value', parseInt(e.target.value) || 0)}
        className={`bg-transparent text-center outline-none border-b border-white/20 focus:border-cyan-400 ${
          compact ? 'w-20 text-sm' : 'w-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      />
      {/* Suffix input */}
      <input
        type="text"
        value={stat.suffix}
        onChange={(e) => onUpdate('suffix', e.target.value)}
        className="w-16 bg-white/10 text-white text-center rounded-lg px-2 py-1 text-sm mt-1"
        placeholder="סיומת"
        onClick={(e) => e.stopPropagation()}
      />
      {/* Icon selector */}
      <select
        value={stat.icon}
        onChange={(e) => onUpdate('icon', e.target.value)}
        className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm w-full mt-2"
        onClick={(e) => e.stopPropagation()}
      >
        {iconOptions.map((icon) => (
          <option key={icon} value={icon} className="bg-gray-800">
            {icon}
          </option>
        ))}
      </select>
      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="mt-2 p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
        title="הסר"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </>
  );
}

// ===========================================================================
// VARIANT: default (grid)
// Dark background with gradient orbs, glass-dark cards, gradient icons.
// ===========================================================================
function DefaultStatDisplay({
  stat,
  isVisible,
  isEditing,
  onUpdate,
  onRemove,
  primaryColor,
}: {
  stat: StatItem;
  isVisible: boolean;
  isEditing?: boolean;
  onUpdate: (key: keyof StatItem, value: unknown) => void;
  onRemove: () => void;
  primaryColor: string;
}) {
  const count = useCountUp(stat.value, 2500, isVisible);

  return (
    <div className="group relative text-center">
      {/* Glow Effect */}
      <div
        className="absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}33, rgba(6,182,212,0.2))`,
        }}
      />

      {/* Card */}
      <div className="relative glass-dark rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-2">
        {/* Icon */}
        <div
          className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, rgb(6,182,212))`,
            boxShadow: `0 10px 25px -5px ${primaryColor}4D`,
          }}
        >
          {getIcon(stat.icon, 'w-8 h-8')}
        </div>

        {/* Number */}
        <div className="text-5xl md:text-6xl font-extrabold text-white mb-3">
          {isEditing ? (
            <div className="flex flex-col items-center gap-2">
              <StatEditControls stat={stat} onUpdate={onUpdate} onRemove={onRemove} />
            </div>
          ) : (
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/80">
              {count.toLocaleString()}
              {stat.suffix}
            </span>
          )}
        </div>

        {/* Label */}
        <EditableText
          value={stat.label}
          onChange={(value) => onUpdate('label', value)}
          isEditing={isEditing}
          className="text-lg text-white/70 font-medium"
          as="p"
        />

        {/* Remove button overlay (non-edit controls variant) */}
        {isEditing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-2 right-2 p-2 rounded-lg hover:bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function DefaultVariant({
  statsContent,
  stats,
  isVisible,
  isEditing,
  updateContent,
  updateStat,
  addStat,
  removeStat,
  primaryColor,
}: VariantRenderProps) {
  return (
    <>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-gray-900" />

      {/* Animated Gradient */}
      <div className="absolute inset-0 animated-gradient-bg opacity-30" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Floating Orbs */}
      <div
        className="floating-orb w-[500px] h-[500px] -top-40 left-1/3"
        style={{ background: `${primaryColor}33` }}
      />
      <div className="floating-orb w-[400px] h-[400px] -bottom-40 right-1/4 bg-cyan-500/15" />

      {/* Noise */}
      <div className="absolute inset-0 noise-texture" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/20 mb-6">
            <LucideIcons.TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-white/80">המספרים מדברים</span>
          </div>

          <EditableText
            value={statsContent.title || 'הישגים שמדברים בעד עצמם'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            as="h2"
          />

          <EditableText
            value={statsContent.subtitle || 'אנחנו גאים בהישגים שלנו ובקהילה שבנינו לאורך השנים'}
            onChange={(value) => updateContent('subtitle', value)}
            isEditing={isEditing}
            className="text-xl text-white/60 max-w-2xl mx-auto"
            as="p"
          />
        </div>

        {/* Stats Grid */}
        <div
          className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-8 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          {stats.map((stat, index) => (
            <DefaultStatDisplay
              key={index}
              stat={stat}
              isVisible={isVisible}
              isEditing={isEditing}
              onUpdate={(key, value) => updateStat(index, key, value)}
              onRemove={() => removeStat(index)}
              primaryColor={primaryColor}
            />
          ))}

          {/* Add Stat Button */}
          {isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addStat();
              }}
              className="rounded-3xl border-2 border-dashed border-white/20 hover:border-cyan-500/50 flex flex-col items-center justify-center min-h-[250px] text-white/40 hover:text-cyan-400 transition-all"
            >
              <Plus className="w-12 h-12 mb-2" />
              <span>הוסף סטטיסטיקה</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ===========================================================================
// VARIANT: inline
// Single horizontal bar with dividers. Compact, minimal, suitable for
// embedding between other sections.
// ===========================================================================
function InlineStatItem({
  stat,
  isVisible,
  isEditing,
  onUpdate,
  onRemove,
  primaryColor,
}: {
  stat: StatItem;
  isVisible: boolean;
  isEditing?: boolean;
  onUpdate: (key: keyof StatItem, value: unknown) => void;
  onRemove: () => void;
  primaryColor: string;
}) {
  const count = useCountUp(stat.value, 2000, isVisible);

  return (
    <div className="flex items-center gap-3 group relative">
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: `${primaryColor}1A` }}
      >
        {getIcon(stat.icon, 'w-5 h-5', { color: primaryColor })}
      </div>

      <div className="flex flex-col items-start">
        {isEditing ? (
          <div className="flex flex-col items-start gap-1">
            <StatEditControls stat={stat} onUpdate={onUpdate} onRemove={onRemove} compact />
          </div>
        ) : (
          <span className="text-2xl md:text-3xl font-bold text-white">
            {count.toLocaleString()}
            {stat.suffix}
          </span>
        )}
        <EditableText
          value={stat.label}
          onChange={(value) => onUpdate('label', value)}
          isEditing={isEditing}
          className="text-sm text-white/50"
          as="span"
        />
      </div>
    </div>
  );
}

function InlineVariant({
  statsContent,
  stats,
  isVisible,
  isEditing,
  updateContent,
  updateStat,
  addStat,
  removeStat,
  primaryColor,
}: VariantRenderProps) {
  return (
    <>
      {/* Background - subtle gradient bar */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, rgba(15,23,42,0.95), rgba(15,23,42,0.85), rgba(15,23,42,0.95))`,
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${primaryColor}66, transparent)`,
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${primaryColor}66, transparent)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Optional compact title */}
        {(statsContent.title || isEditing) && (
          <div className="text-center mb-6">
            <EditableText
              value={statsContent.title || 'הישגים שמדברים בעד עצמם'}
              onChange={(value) => updateContent('title', value)}
              isEditing={isEditing}
              className="text-lg font-semibold text-white/80"
              as="h2"
            />
          </div>
        )}

        {/* Inline stats row */}
        <div
          className={`flex flex-wrap items-center justify-center gap-6 md:gap-0 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && (
                <div
                  className="hidden md:block w-px h-10 mx-8 flex-shrink-0"
                  style={{ background: `${primaryColor}33` }}
                />
              )}
              <InlineStatItem
                stat={stat}
                isVisible={isVisible}
                isEditing={isEditing}
                onUpdate={(key, value) => updateStat(index, key, value)}
                onRemove={() => removeStat(index)}
                primaryColor={primaryColor}
              />
            </div>
          ))}

          {/* Add Button */}
          {isEditing && (
            <div className="flex items-center">
              <div
                className="hidden md:block w-px h-10 mx-8 flex-shrink-0"
                style={{ background: `${primaryColor}33` }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addStat();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-white/20 hover:border-cyan-500/50 text-white/40 hover:text-cyan-400 transition-all text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>הוסף</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ===========================================================================
// VARIANT: minimal
// Clean large numbers centered. No cards, no backgrounds. Stacked vertically
// with generous whitespace. Plain background.
// ===========================================================================
function MinimalStatItem({
  stat,
  isVisible,
  isEditing,
  onUpdate,
  onRemove,
  primaryColor,
}: {
  stat: StatItem;
  isVisible: boolean;
  isEditing?: boolean;
  onUpdate: (key: keyof StatItem, value: unknown) => void;
  onRemove: () => void;
  primaryColor: string;
}) {
  const count = useCountUp(stat.value, 2200, isVisible);

  return (
    <div className="flex flex-col items-center py-10 group relative">
      {isEditing ? (
        <div className="flex flex-col items-center gap-2">
          <StatEditControls stat={stat} onUpdate={onUpdate} onRemove={onRemove} />
        </div>
      ) : (
        <span
          className="text-6xl md:text-8xl font-extrabold tracking-tight"
          style={{ color: primaryColor }}
        >
          {count.toLocaleString()}
          {stat.suffix}
        </span>
      )}
      <EditableText
        value={stat.label}
        onChange={(value) => onUpdate('label', value)}
        isEditing={isEditing}
        className="text-lg md:text-xl text-white/50 mt-3 font-light"
        as="p"
      />
    </div>
  );
}

function MinimalVariant({
  statsContent,
  stats,
  isVisible,
  isEditing,
  updateContent,
  updateStat,
  addStat,
  removeStat,
  primaryColor,
}: VariantRenderProps) {
  return (
    <>
      {/* Plain background */}
      <div className="absolute inset-0 bg-gray-950" />

      <div className="relative z-10 max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <EditableText
            value={statsContent.title || 'הישגים שמדברים בעד עצמם'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className="text-3xl md:text-4xl font-light text-white/90 mb-4"
            as="h2"
          />
          <EditableText
            value={statsContent.subtitle || 'אנחנו גאים בהישגים שלנו ובקהילה שבנינו לאורך השנים'}
            onChange={(value) => updateContent('subtitle', value)}
            isEditing={isEditing}
            className="text-base text-white/40 max-w-xl mx-auto"
            as="p"
          />
        </div>

        {/* Stats stacked vertically */}
        <div
          className={`flex flex-col items-center divide-y divide-white/10 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          {stats.map((stat, index) => (
            <MinimalStatItem
              key={index}
              stat={stat}
              isVisible={isVisible}
              isEditing={isEditing}
              onUpdate={(key, value) => updateStat(index, key, value)}
              onRemove={() => removeStat(index)}
              primaryColor={primaryColor}
            />
          ))}
        </div>

        {/* Add button */}
        {isEditing && (
          <div className="flex justify-center mt-8">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addStat();
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-dashed border-white/15 hover:border-white/30 text-white/30 hover:text-white/60 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>הוסף סטטיסטיקה</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ===========================================================================
// Shared props interface for variant render functions
// ===========================================================================
interface VariantRenderProps {
  statsContent: StatsContent;
  stats: StatItem[];
  isVisible: boolean;
  isEditing?: boolean;
  updateContent: (key: keyof StatsContent, value: unknown) => void;
  updateStat: (index: number, key: keyof StatItem, value: unknown) => void;
  addStat: () => void;
  removeStat: (index: number) => void;
  primaryColor: string;
}

// ===========================================================================
// Main exported component
// ===========================================================================
export function StatsSection({
  variant,
  content,
  isEditing,
  onContentChange,
  onSelect,
  isSelected,
}: SectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const theme = useTheme();

  const primaryColor = theme.colors.primary;
  const statsContent = content as StatsContent;
  const stats = statsContent.stats || defaultStats;

  // Intersection observer for scroll-based count-up trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const updateContent = useCallback(
    (key: keyof StatsContent, value: unknown) => {
      onContentChange?.({ ...content, [key]: value });
    },
    [content, onContentChange],
  );

  const updateStat = useCallback(
    (index: number, key: keyof StatItem, value: unknown) => {
      const newStats = [...stats];
      newStats[index] = { ...newStats[index], [key]: value };
      updateContent('stats', newStats);
    },
    [stats, updateContent],
  );

  const addStat = useCallback(() => {
    const newStats = [
      ...stats,
      {
        value: 100,
        suffix: '+',
        label: 'סטטיסטיקה חדשה',
        icon: 'Star',
      },
    ];
    updateContent('stats', newStats);
  }, [stats, updateContent]);

  const removeStat = useCallback(
    (index: number) => {
      const newStats = stats.filter((_, i) => i !== index);
      updateContent('stats', newStats);
    },
    [stats, updateContent],
  );

  const variantProps: VariantRenderProps = {
    statsContent,
    stats,
    isVisible,
    isEditing,
    updateContent,
    updateStat,
    addStat,
    removeStat,
    primaryColor,
  };

  // Determine padding based on variant
  const sectionPadding = variant === 'inline' ? 'py-12' : 'py-24';

  return (
    <section
      ref={sectionRef}
      className={`relative ${sectionPadding} overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-offset-2' : ''
      }`}
      style={{
        fontFamily: theme.fonts.body,
        ...(isSelected ? { ringColor: primaryColor } as unknown as React.CSSProperties : {}),
      }}
      onClick={onSelect}
    >
      {variant === 'inline' ? (
        <InlineVariant {...variantProps} />
      ) : variant === 'minimal' ? (
        <MinimalVariant {...variantProps} />
      ) : (
        <DefaultVariant {...variantProps} />
      )}
    </section>
  );
}
