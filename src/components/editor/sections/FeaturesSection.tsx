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

const defaultFeatures: FeatureItem[] = [
  { icon: 'Zap', title: 'מהירות בזק', description: 'טכנולוגיה מתקדמת לטעינה מיידית וחוויה חלקה' },
  { icon: 'Shield', title: 'אבטחה מתקדמת', description: 'הגנה מלאה על הנתונים שלכם עם תקני אבטחה מחמירים' },
  { icon: 'Palette', title: 'עיצוב מרהיב', description: 'תבניות יפהפיות שמותאמות בדיוק לצרכים שלכם' },
  { icon: 'Smartphone', title: 'רספונסיבי מושלם', description: 'נראה מדהים בכל מכשיר - מובייל, טאבלט ומחשב' },
  { icon: 'BarChart3', title: 'אנליטיקס מתקדם', description: 'נתונים בזמן אמת להבנת הקהל והשיפור המתמיד' },
  { icon: 'Headphones', title: 'תמיכה 24/7', description: 'צוות מומחים זמין בכל שעה לעזור לכם להצליח' },
];

function getIcon(iconName?: string): React.ComponentType<{ className?: string }> {
  if (!iconName) return LucideIcons.Sparkles;
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  return icons[iconName] || LucideIcons.Sparkles;
}

function getGradientForIndex(index: number, primary: string, accent: string, secondary: string) {
  const gradients = [
    `linear-gradient(to bottom right, ${primary}, ${accent})`,
    `linear-gradient(to bottom right, ${accent}, ${primary})`,
    `linear-gradient(to bottom right, ${secondary}, ${primary})`,
    `linear-gradient(to bottom right, ${primary}, ${secondary})`,
    `linear-gradient(to bottom right, ${accent}, ${secondary})`,
    `linear-gradient(to bottom right, ${secondary}, ${accent})`,
  ];
  return gradients[index % gradients.length];
}

// ─── ADD / REMOVE HELPERS ────────────────────────────────────────────────────

interface ItemControlsProps {
  index: number;
  total: number;
  isEditing?: boolean;
  onAdd: () => void;
  onRemove: () => void;
  primaryColor: string;
}

function ItemControls({ index, total, isEditing, onAdd, onRemove, primaryColor }: ItemControlsProps) {
  if (!isEditing) return null;
  return (
    <div className="flex items-center gap-1 mt-2">
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
        title="הסר פריט"
        disabled={total <= 1}
        style={{ opacity: total <= 1 ? 0.3 : 1 }}
      >
        <LucideIcons.Trash2 className="w-4 h-4" />
      </button>
      {index === total - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(); }}
          className="p-1 rounded transition-colors"
          style={{ color: primaryColor }}
          title="הוסף פריט"
        >
          <LucideIcons.PlusCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ─── DEFAULT VARIANT (GRID) ──────────────────────────────────────────────────

function DefaultVariant({
  featuresContent,
  features,
  isEditing,
  isVisible,
  updateContent,
  updateItem,
  addItem,
  removeItem,
}: VariantProps) {
  const { colors, fonts, getCardRadius, getButtonRadius } = useTheme();

  return (
    <>
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
            const gradient = getGradientForIndex(index, colors.primary, colors.accent, colors.secondary);

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
                    <div
                      className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                      style={{ background: gradient }}
                    />
                  </div>

                  <EditableText
                    value={feature.title || `תכונה ${index + 1}`}
                    onChange={(value) => updateItem(index, 'title', value)}
                    isEditing={isEditing}
                    className="text-xl font-bold mb-3 transition-colors"
                    as="h3"
                    style={{ fontFamily: fonts.heading }}
                  />

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

                  <ItemControls
                    index={index}
                    total={features.length}
                    isEditing={isEditing}
                    onAdd={addItem}
                    onRemove={() => removeItem(index)}
                    primaryColor={colors.primary}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── CARDS VARIANT ───────────────────────────────────────────────────────────

function CardsVariant({
  featuresContent,
  features,
  isEditing,
  isVisible,
  updateContent,
  updateItem,
  addItem,
  removeItem,
}: VariantProps) {
  const { colors, fonts, getCardRadius } = useTheme();

  return (
    <div className="relative max-w-7xl mx-auto">
      {/* Section Header */}
      <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <EditableText
          value={featuresContent.title || 'כל מה שצריך בפלטפורמה אחת'}
          onChange={(value) => updateContent('title', value)}
          isEditing={isEditing}
          className="text-4xl md:text-5xl font-bold mb-4"
          as="h2"
          style={{ fontFamily: fonts.heading }}
        />
        <EditableText
          value={featuresContent.subtitle || 'הכלים המתקדמים ביותר ליצירת נוכחות דיגיטלית מרשימה'}
          onChange={(value) => updateContent('subtitle', value)}
          isEditing={isEditing}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
          as="p"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = getIcon(feature.icon);

          return (
            <div
              key={index}
              className={`group flex flex-col border bg-card transition-all duration-500 hover:-translate-y-1 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${index * 80}ms`,
                borderRadius: getCardRadius(),
                borderColor: `${colors.primary}20`,
                boxShadow: `0 8px 30px -10px ${colors.secondary}30`,
              }}
            >
              {/* Large icon area */}
              <div
                className="flex items-center justify-center py-10 transition-colors duration-300"
                style={{
                  backgroundColor: `${colors.primary}08`,
                  borderTopLeftRadius: getCardRadius(),
                  borderTopRightRadius: getCardRadius(),
                }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <Icon className="w-10 h-10" style={{ color: colors.primary }} />
                </div>
              </div>

              {/* Text content */}
              <div className="flex flex-col flex-1 p-6 text-center">
                <EditableText
                  value={feature.title || `תכונה ${index + 1}`}
                  onChange={(value) => updateItem(index, 'title', value)}
                  isEditing={isEditing}
                  className="text-xl font-bold mb-3"
                  as="h3"
                  style={{ fontFamily: fonts.heading }}
                />

                <EditableText
                  value={feature.description || 'תיאור קצר של התכונה'}
                  onChange={(value) => updateItem(index, 'description', value)}
                  isEditing={isEditing}
                  className="text-muted-foreground leading-relaxed"
                  as="p"
                />

                <ItemControls
                  index={index}
                  total={features.length}
                  isEditing={isEditing}
                  onAdd={addItem}
                  onRemove={() => removeItem(index)}
                  primaryColor={colors.primary}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MINIMAL VARIANT ─────────────────────────────────────────────────────────

function MinimalVariant({
  featuresContent,
  features,
  isEditing,
  isVisible,
  updateContent,
  updateItem,
  addItem,
  removeItem,
}: VariantProps) {
  const { colors, fonts } = useTheme();

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Section Header */}
      <div className={`mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <EditableText
          value={featuresContent.title || 'כל מה שצריך בפלטפורמה אחת'}
          onChange={(value) => updateContent('title', value)}
          isEditing={isEditing}
          className="text-3xl md:text-4xl font-semibold mb-4"
          as="h2"
          style={{ fontFamily: fonts.heading }}
        />
        <EditableText
          value={featuresContent.subtitle || 'הכלים המתקדמים ביותר ליצירת נוכחות דיגיטלית מרשימה'}
          onChange={(value) => updateContent('subtitle', value)}
          isEditing={isEditing}
          className="text-lg text-muted-foreground max-w-xl"
          as="p"
        />
      </div>

      {/* Feature Rows */}
      <div className="flex flex-col gap-0">
        {features.map((feature, index) => {
          const Icon = getIcon(feature.icon);

          return (
            <div
              key={index}
              className={`group flex items-start gap-8 py-10 transition-all duration-500 ${
                index < features.length - 1 ? 'border-b border-border/40' : ''
              } ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg transition-colors duration-300"
                style={{ color: colors.primary }}
              >
                <Icon className="w-7 h-7" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <EditableText
                  value={feature.title || `תכונה ${index + 1}`}
                  onChange={(value) => updateItem(index, 'title', value)}
                  isEditing={isEditing}
                  className="text-xl font-semibold mb-2"
                  as="h3"
                  style={{ fontFamily: fonts.heading }}
                />
                <EditableText
                  value={feature.description || 'תיאור קצר של התכונה'}
                  onChange={(value) => updateItem(index, 'description', value)}
                  isEditing={isEditing}
                  className="text-muted-foreground leading-relaxed"
                  as="p"
                />

                <ItemControls
                  index={index}
                  total={features.length}
                  isEditing={isEditing}
                  onAdd={addItem}
                  onRemove={() => removeItem(index)}
                  primaryColor={colors.primary}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── LIST VARIANT ────────────────────────────────────────────────────────────

function ListVariant({
  featuresContent,
  features,
  isEditing,
  isVisible,
  updateContent,
  updateItem,
  addItem,
  removeItem,
}: VariantProps) {
  const { colors, fonts } = useTheme();

  const formatNumber = (n: number) => String(n + 1).padStart(2, '0');

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Section Header */}
      <div className={`mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <EditableText
          value={featuresContent.title || 'כל מה שצריך בפלטפורמה אחת'}
          onChange={(value) => updateContent('title', value)}
          isEditing={isEditing}
          className="text-3xl md:text-4xl font-bold mb-4"
          as="h2"
          style={{ fontFamily: fonts.heading }}
        />
        <EditableText
          value={featuresContent.subtitle || 'הכלים המתקדמים ביותר ליצירת נוכחות דיגיטלית מרשימה'}
          onChange={(value) => updateContent('subtitle', value)}
          isEditing={isEditing}
          className="text-lg text-muted-foreground"
          as="p"
        />
      </div>

      {/* Numbered list */}
      <div className="flex flex-col gap-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`group transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: `${index * 120}ms` }}
          >
            {/* Number + Title row */}
            <div className="flex items-baseline gap-5 mb-3">
              <span
                className="text-5xl md:text-6xl font-black leading-none select-none"
                style={{
                  fontFamily: fonts.heading,
                  color: `${colors.primary}25`,
                }}
              >
                {formatNumber(index)}
              </span>
              <EditableText
                value={feature.title || `תכונה ${index + 1}`}
                onChange={(value) => updateItem(index, 'title', value)}
                isEditing={isEditing}
                className="text-2xl font-bold"
                as="h3"
                style={{ fontFamily: fonts.heading }}
              />
            </div>

            {/* Description */}
            <div className="pr-0 md:pr-[calc(theme(spacing.5)+3.75rem)]">
              <EditableText
                value={feature.description || 'תיאור קצר של התכונה'}
                onChange={(value) => updateItem(index, 'description', value)}
                isEditing={isEditing}
                className="text-muted-foreground leading-relaxed text-lg"
                as="p"
              />

              <ItemControls
                index={index}
                total={features.length}
                isEditing={isEditing}
                onAdd={addItem}
                onRemove={() => removeItem(index)}
                primaryColor={colors.primary}
              />
            </div>

            {/* Divider */}
            {index < features.length - 1 && (
              <div
                className="mt-12 h-px w-full"
                style={{ backgroundColor: `${colors.primary}15` }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SHARED VARIANT PROPS ────────────────────────────────────────────────────

interface VariantProps {
  featuresContent: FeaturesContent;
  features: FeatureItem[];
  isEditing?: boolean;
  isVisible: boolean;
  updateContent: (key: keyof FeaturesContent, value: unknown) => void;
  updateItem: (index: number, field: keyof FeatureItem, value: string) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export function FeaturesSection({
  variant,
  content,
  isEditing,
  onContentChange,
  onSelect,
  isSelected,
}: SectionProps) {
  const featuresContent = content as FeaturesContent;
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { fonts } = useTheme();

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const updateContent = (key: keyof FeaturesContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  const features = featuresContent.items?.length ? featuresContent.items : defaultFeatures;

  const updateItem = (index: number, field: keyof FeatureItem, value: string) => {
    const items = [...features];
    items[index] = { ...items[index], [field]: value };
    updateContent('items', items);
  };

  const addItem = () => {
    const items = [...features];
    items.push({ icon: 'Sparkles', title: 'תכונה חדשה', description: 'תיאור של התכונה החדשה' });
    updateContent('items', items);
  };

  const removeItem = (index: number) => {
    if (features.length <= 1) return;
    const items = features.filter((_, i) => i !== index);
    updateContent('items', items);
  };

  const variantProps: VariantProps = {
    featuresContent,
    features,
    isEditing,
    isVisible,
    updateContent,
    updateItem,
    addItem,
    removeItem,
  };

  // Determine padding based on variant
  const isCompact = variant === 'minimal' || variant === 'list';
  const sectionPadding = isCompact ? 'py-24 px-6' : 'py-32 px-4';

  const renderVariant = () => {
    switch (variant) {
      case 'cards':
        return <CardsVariant {...variantProps} />;
      case 'minimal':
        return <MinimalVariant {...variantProps} />;
      case 'list':
        return <ListVariant {...variantProps} />;
      default:
        return <DefaultVariant {...variantProps} />;
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`relative ${sectionPadding} overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
      style={{ fontFamily: fonts.body }}
    >
      {renderVariant()}
    </section>
  );
}
