import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, User } from 'lucide-react';

interface Testimonial {
  quote?: string;
  author?: string;
  role?: string;
  avatar?: string;
}

interface TestimonialsContent {
  title?: string;
  items?: Testimonial[];
}

export function TestimonialsSection({ 
  content, 
  isEditing, 
  onContentChange,
  onSelect,
  isSelected 
}: SectionProps) {
  const testimonialsContent = content as TestimonialsContent;
  const items = testimonialsContent.items || [];

  const updateContent = (key: keyof TestimonialsContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  const updateItem = (index: number, key: keyof Testimonial, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: value };
    updateContent('items', newItems);
  };

  // Default testimonials
  const displayItems = items.length > 0 ? items : [
    { 
      quote: 'שירות מעולה! ממליץ בחום לכל מי שמחפש איכות ומקצועיות.',
      author: 'ישראל ישראלי',
      role: 'לקוח מרוצה'
    },
    { 
      quote: 'חוויה נפלאה מהתחלה ועד הסוף. צוות אדיב ומקצועי.',
      author: 'רחל כהן',
      role: 'לקוחה קבועה'
    },
    { 
      quote: 'התוצאות מדברות בעד עצמן. תודה על העבודה המצוינת!',
      author: 'דוד לוי',
      role: 'בעל עסק'
    },
  ];

  return (
    <section 
      className={`py-20 px-4 bg-muted/30 transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <EditableText
            value={testimonialsContent.title || 'מה הלקוחות אומרים'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className="text-3xl md:text-4xl font-bold"
            as="h2"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayItems.map((item, index) => (
            <Card key={index} className="relative">
              <CardContent className="pt-8 pb-6">
                <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
                
                <EditableText
                  value={item.quote || 'ציטוט מלקוח'}
                  onChange={(value) => updateItem(index, 'quote', value)}
                  isEditing={isEditing}
                  className="text-muted-foreground mb-6 italic"
                  as="p"
                />
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {item.avatar ? (
                      <img src={item.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <EditableText
                      value={item.author || 'שם הלקוח'}
                      onChange={(value) => updateItem(index, 'author', value)}
                      isEditing={isEditing}
                      className="font-semibold"
                      as="p"
                    />
                    <EditableText
                      value={item.role || 'תפקיד'}
                      onChange={(value) => updateItem(index, 'role', value)}
                      isEditing={isEditing}
                      className="text-sm text-muted-foreground"
                      as="p"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
