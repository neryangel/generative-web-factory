import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Card, CardContent } from '@/components/ui/card';
import * as Icons from 'lucide-react';

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
  const items = featuresContent.items || [];

  const updateContent = (key: keyof FeaturesContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  const updateItem = (index: number, key: keyof FeatureItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: value };
    updateContent('items', newItems);
  };

  const getIcon = (iconName?: string) => {
    if (!iconName) return Icons.Star;
    const IconComponent = (Icons as Record<string, unknown>)[iconName] as React.ComponentType<{ className?: string }>;
    return IconComponent || Icons.Star;
  };

  // Default items if empty
  const displayItems = items.length > 0 ? items : [
    { icon: 'Zap', title: 'מהיר ויעיל', description: 'תיאור קצר של התכונה' },
    { icon: 'Shield', title: 'מאובטח', description: 'תיאור קצר של התכונה' },
    { icon: 'Heart', title: 'אהוב', description: 'תיאור קצר של התכונה' },
  ];

  return (
    <section 
      className={`py-20 px-4 bg-muted/30 transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <EditableText
            value={featuresContent.title || 'השירותים שלנו'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className="text-3xl md:text-4xl font-bold mb-4"
            as="h2"
          />
          <EditableText
            value={featuresContent.subtitle || 'מה אנחנו מציעים ללקוחותינו'}
            onChange={(value) => updateContent('subtitle', value)}
            isEditing={isEditing}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            as="p"
          />
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {displayItems.map((item, index) => {
            const Icon = getIcon(item.icon);
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <EditableText
                    value={item.title || 'כותרת'}
                    onChange={(value) => updateItem(index, 'title', value)}
                    isEditing={isEditing}
                    className="text-xl font-semibold mb-3"
                    as="h3"
                  />
                  <EditableText
                    value={item.description || 'תיאור קצר'}
                    onChange={(value) => updateItem(index, 'description', value)}
                    isEditing={isEditing}
                    className="text-muted-foreground"
                    as="p"
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
