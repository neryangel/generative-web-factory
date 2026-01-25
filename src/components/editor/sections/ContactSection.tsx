import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

interface ContactContent {
  title?: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  address?: string;
  show_form?: boolean;
  show_map?: boolean;
  hours?: string;
}

export function ContactSection({ 
  content, 
  isEditing, 
  onContentChange,
  onSelect,
  isSelected 
}: SectionProps) {
  const contactContent = content as ContactContent;
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  const updateContent = (key: keyof ContactContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  const contactMethods = [
    { 
      icon: Mail, 
      label: 'אימייל', 
      value: contactContent.email || 'hello@example.com',
      key: 'email' as const,
      color: 'from-blue-500 to-cyan-500',
    },
    { 
      icon: Phone, 
      label: 'טלפון', 
      value: contactContent.phone || '054-1234567',
      key: 'phone' as const,
      color: 'from-green-500 to-emerald-500',
    },
    { 
      icon: MapPin, 
      label: 'כתובת', 
      value: contactContent.address || 'תל אביב, ישראל',
      key: 'address' as const,
      color: 'from-purple-500 to-pink-500',
    },
    { 
      icon: Clock, 
      label: 'שעות פעילות', 
      value: contactContent.hours || 'א-ה: 09:00-18:00',
      key: 'hours' as const,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className={`relative py-32 px-4 overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <MessageCircle className="w-4 h-4" />
            <span>בואו נדבר</span>
          </div>
          <EditableText
            value={contactContent.title || 'צרו איתנו קשר'}
            onChange={(value) => updateContent('title', value)}
            isEditing={isEditing}
            className="text-4xl md:text-5xl font-bold mb-4"
            as="h2"
          />
          <EditableText
            value={contactContent.subtitle || 'נשמח לשמוע מכם ולעזור בכל שאלה'}
            onChange={(value) => updateContent('subtitle', value)}
            isEditing={isEditing}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            as="p"
          />
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Methods */}
          <div className={`lg:col-span-2 space-y-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} style={{ transitionDelay: '200ms' }}>
            {contactMethods.map((method, index) => (
              <Card 
                key={method.key}
                className={`group overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <CardContent className="p-6 flex items-center gap-5">
                  {/* Icon */}
                  <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <method.icon className="w-6 h-6 text-white" />
                    {/* Glow */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${method.color} blur-xl opacity-0 group-hover:opacity-40 transition-opacity`} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{method.label}</p>
                    <EditableText
                      value={method.value}
                      onChange={(value) => updateContent(method.key, value)}
                      isEditing={isEditing}
                      className="font-semibold group-hover:text-primary transition-colors"
                      as="p"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          {(contactContent.show_form !== false) && (
            <div className={`lg:col-span-3 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ transitionDelay: '400ms' }}>
              <Card className="overflow-hidden border-0 bg-card/80 backdrop-blur-sm shadow-2xl">
                {/* Gradient top border */}
                <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                
                <CardContent className="p-8 md:p-10">
                  <h3 className="text-2xl font-bold mb-6">שלחו לנו הודעה</h3>
                  
                  <form className="space-y-6" onClick={(e) => e.stopPropagation()}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">שם מלא</label>
                        <Input 
                          placeholder="ישראל ישראלי" 
                          className="h-12 bg-muted/50 border-border/50 focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">טלפון</label>
                        <Input 
                          placeholder="054-1234567" 
                          className="h-12 bg-muted/50 border-border/50 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">אימייל</label>
                      <Input 
                        type="email" 
                        placeholder="example@email.com" 
                        className="h-12 bg-muted/50 border-border/50 focus:border-primary transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">הודעה</label>
                      <Textarea 
                        placeholder="ספרו לנו איך נוכל לעזור..." 
                        rows={5}
                        className="bg-muted/50 border-border/50 focus:border-primary transition-colors resize-none"
                      />
                    </div>
                    
                    <Button 
                      type="submit"
                      size="lg"
                      className="w-full h-14 text-lg btn-premium group"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        שליחה
                        <Send className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                      </span>
                    </Button>
                  </form>

                  {/* Trust message */}
                  <p className="text-center text-sm text-muted-foreground mt-6">
                    🔒 המידע שלכם מאובטח ולא ישותף עם צד שלישי
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
