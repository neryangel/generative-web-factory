import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Button } from '@/components/ui/button';

interface CTAContent {
  headline?: string;
  description?: string;
  button?: { text: string; url: string };
  background_color?: string;
}

export function CTASection({ 
  content, 
  isEditing, 
  onContentChange,
  onSelect,
  isSelected 
}: SectionProps) {
  const ctaContent = content as CTAContent;

  const updateContent = (key: keyof CTAContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  return (
    <section 
      className={`py-20 px-4 transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      style={{ background: ctaContent.background_color || 'var(--gradient-primary)' }}
      onClick={onSelect}
    >
      <div className="max-w-4xl mx-auto text-center">
        <EditableText
          value={ctaContent.headline || 'מוכנים להתחיל?'}
          onChange={(value) => updateContent('headline', value)}
          isEditing={isEditing}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          as="h2"
        />
        
        <EditableText
          value={ctaContent.description || 'צרו איתנו קשר עוד היום ונשמח לעזור לכם'}
          onChange={(value) => updateContent('description', value)}
          isEditing={isEditing}
          className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
          as="p"
        />

        <Button 
          size="lg" 
          variant="secondary"
          className="text-lg px-8"
        >
          <EditableText
            value={ctaContent.button?.text || 'צרו קשר'}
            onChange={(value) => updateContent('button', { 
              ...ctaContent.button, 
              text: value 
            })}
            isEditing={isEditing}
            className="text-inherit"
          />
        </Button>
      </div>
    </section>
  );
}
