import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Image as ImageIcon } from 'lucide-react';

interface Stat {
  value?: string;
  label?: string;
}

interface AboutContent {
  title?: string;
  content?: string;
  image?: string;
  stats?: Stat[];
}

export function AboutSection({ 
  content, 
  isEditing, 
  onContentChange,
  onSelect,
  isSelected 
}: SectionProps) {
  const aboutContent = content as AboutContent;
  const stats = aboutContent.stats || [];

  const updateContent = (key: keyof AboutContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  const updateStat = (index: number, key: keyof Stat, value: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [key]: value };
    updateContent('stats', newStats);
  };

  const displayStats = stats.length > 0 ? stats : [
    { value: '10+', label: 'שנות ניסיון' },
    { value: '500+', label: 'לקוחות מרוצים' },
    { value: '100%', label: 'שביעות רצון' },
  ];

  return (
    <section 
      className={`py-20 px-4 transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="aspect-video rounded-2xl overflow-hidden bg-muted">
            {aboutContent.image ? (
              <img 
                src={aboutContent.image} 
                alt="" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <EditableText
              value={aboutContent.title || 'אודותינו'}
              onChange={(value) => updateContent('title', value)}
              isEditing={isEditing}
              className="text-3xl md:text-4xl font-bold mb-6"
              as="h2"
            />
            
            <EditableText
              value={aboutContent.content || 'כאן תוכלו לספר את הסיפור שלכם. מי אתם, מה אתם עושים, ולמה הלקוחות צריכים לבחור בכם. תנו לאישיות שלכם לבוא לידי ביטוי.'}
              onChange={(value) => updateContent('content', value)}
              isEditing={isEditing}
              className="text-lg text-muted-foreground leading-relaxed mb-8"
              as="p"
            />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {displayStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <EditableText
                    value={stat.value || '0'}
                    onChange={(value) => updateStat(index, 'value', value)}
                    isEditing={isEditing}
                    className="text-3xl font-bold text-primary"
                    as="p"
                  />
                  <EditableText
                    value={stat.label || 'תווית'}
                    onChange={(value) => updateStat(index, 'label', value)}
                    isEditing={isEditing}
                    className="text-sm text-muted-foreground"
                    as="p"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
