import { useEffect, useState, useRef } from 'react';
import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Sparkles, Users, Globe, Award, TrendingUp, Plus, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

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
  { value: 500, suffix: 'M+', label: 'ביקורים בחודש', icon: 'TrendingUp' }
];

// Custom hook for count up animation
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

// Individual stat display component
function StatDisplay({ stat, isVisible, isEditing, onUpdate, onRemove }: { 
  stat: StatItem; 
  isVisible: boolean; 
  isEditing?: boolean;
  onUpdate: (key: keyof StatItem, value: unknown) => void;
  onRemove: () => void;
}) {
  const count = useCountUp(stat.value, 2500, isVisible);
  
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      Users, Globe, Award, TrendingUp,
      Heart: LucideIcons.Heart,
      Star: LucideIcons.Star,
      Zap: LucideIcons.Zap,
      Target: LucideIcons.Target,
      Rocket: LucideIcons.Rocket,
      Crown: LucideIcons.Crown,
    };
    const IconComponent = icons[iconName] || Sparkles;
    return <IconComponent className="w-8 h-8" />;
  };

  const iconOptions = ['Users', 'Globe', 'Award', 'TrendingUp', 'Heart', 'Star', 'Zap', 'Target', 'Rocket', 'Crown'];

  return (
    <div className="group relative text-center">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Card */}
      <div className="relative glass-dark rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-2">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
          {getIcon(stat.icon)}
        </div>

        {/* Number */}
        <div className="text-5xl md:text-6xl font-extrabold text-white mb-3">
          {isEditing ? (
            <input
              type="number"
              value={stat.value}
              onChange={(e) => onUpdate('value', parseInt(e.target.value) || 0)}
              className="w-full bg-transparent text-center outline-none border-b border-white/20 focus:border-cyan-400"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/80">
              {count.toLocaleString()}{stat.suffix}
            </span>
          )}
        </div>

        {/* Suffix (editable) */}
        {isEditing && (
          <div className="mb-3">
            <input
              type="text"
              value={stat.suffix}
              onChange={(e) => onUpdate('suffix', e.target.value)}
              className="w-16 bg-white/10 text-white text-center rounded-lg px-2 py-1 text-sm"
              placeholder="סיומת"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* Label */}
        <EditableText
          value={stat.label}
          onChange={(value) => onUpdate('label', value)}
          isEditing={isEditing}
          className="text-lg text-white/70 font-medium"
          as="p"
        />

        {/* Icon Selector (edit mode) */}
        {isEditing && (
          <div className="mt-4">
            <select
              value={stat.icon}
              onChange={(e) => onUpdate('icon', e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {iconOptions.map(icon => (
                <option key={icon} value={icon} className="bg-gray-800">{icon}</option>
              ))}
            </select>
          </div>
        )}

        {/* Remove Button */}
        {isEditing && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="absolute top-2 right-2 p-2 rounded-lg hover:bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export function StatsSection({ 
  content, 
  isEditing, 
  onContentChange,
  onSelect,
  isSelected 
}: SectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  const statsContent = content as StatsContent;
  const stats = statsContent.stats || defaultStats;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const updateContent = (key: keyof StatsContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  const updateStat = (index: number, key: keyof StatItem, value: unknown) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [key]: value };
    updateContent('stats', newStats);
  };

  const addStat = () => {
    const newStats = [...stats, {
      value: 100,
      suffix: '+',
      label: 'סטטיסטיקה חדשה',
      icon: 'Star'
    }];
    updateContent('stats', newStats);
  };

  const removeStat = (index: number) => {
    const newStats = stats.filter((_, i) => i !== index);
    updateContent('stats', newStats);
  };

  return (
    <section 
      ref={sectionRef}
      className={`relative py-24 overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-gray-900" />
      
      {/* Animated Gradient */}
      <div className="absolute inset-0 animated-gradient-bg opacity-30" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Floating Orbs */}
      <div className="floating-orb w-[500px] h-[500px] -top-40 left-1/3 bg-purple-500/20" />
      <div className="floating-orb w-[400px] h-[400px] -bottom-40 right-1/4 bg-cyan-500/15" />
      
      {/* Noise */}
      <div className="absolute inset-0 noise-texture" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/20 mb-6">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
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
        <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-8 ${
          isVisible ? 'animate-fade-in-up' : 'opacity-0'
        }`}>
          {stats.map((stat, index) => (
            <StatDisplay
              key={index}
              stat={stat}
              isVisible={isVisible}
              isEditing={isEditing}
              onUpdate={(key, value) => updateStat(index, key, value)}
              onRemove={() => removeStat(index)}
            />
          ))}

          {/* Add Stat Button */}
          {isEditing && (
            <button
              onClick={(e) => { e.stopPropagation(); addStat(); }}
              className="rounded-3xl border-2 border-dashed border-white/20 hover:border-cyan-500/50 flex flex-col items-center justify-center min-h-[250px] text-white/40 hover:text-cyan-400 transition-all"
            >
              <Plus className="w-12 h-12 mb-2" />
              <span>הוסף סטטיסטיקה</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
