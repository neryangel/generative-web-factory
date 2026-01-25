import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ContactContent {
  title?: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  address?: string;
  show_form?: boolean;
  show_map?: boolean;
}

export function ContactSection({ 
  content, 
  isEditing, 
  onContentChange,
  onSelect,
  isSelected 
}: SectionProps) {
  const contactContent = content as ContactContent;

  const updateContent = (key: keyof ContactContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  return (
    <section 
      className={`py-20 px-4 transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <EditableText
            value={contactContent.title || 'צור קשר'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className="text-3xl md:text-4xl font-bold mb-4"
            as="h2"
          />
          <EditableText
            value={contactContent.subtitle || 'נשמח לשמוע ממך'}
            onChange={(value) => updateContent('subtitle', value)}
            isEditing={isEditing}
            className="text-lg text-muted-foreground"
            as="p"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-6">פרטי התקשרות</h3>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">אימייל</p>
                <EditableText
                  value={contactContent.email || 'email@example.com'}
                  onChange={(value) => updateContent('email', value)}
                  isEditing={isEditing}
                  className="font-medium"
                  as="p"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">טלפון</p>
                <EditableText
                  value={contactContent.phone || '050-1234567'}
                  onChange={(value) => updateContent('phone', value)}
                  isEditing={isEditing}
                  className="font-medium"
                  as="p"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">כתובת</p>
                <EditableText
                  value={contactContent.address || 'רחוב הראשי 1, תל אביב'}
                  onChange={(value) => updateContent('address', value)}
                  isEditing={isEditing}
                  className="font-medium"
                  as="p"
                />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          {contactContent.show_form !== false && (
            <Card>
              <CardContent className="p-6">
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">שם</label>
                      <Input placeholder="השם שלך" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">טלפון</label>
                      <Input placeholder="מספר טלפון" type="tel" dir="ltr" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">אימייל</label>
                    <Input placeholder="האימייל שלך" type="email" dir="ltr" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">הודעה</label>
                    <Textarea placeholder="כתוב את ההודעה שלך..." rows={4} />
                  </div>
                  <Button type="submit" className="w-full">שלח הודעה</Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
