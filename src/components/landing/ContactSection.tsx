import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('ההודעה נשלחה בהצלחה! נחזור אליכם בהקדם.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const contactInfo = [
    { icon: Phone, label: 'טלפון', value: '03-123-4567' },
    { icon: Mail, label: 'אימייל', value: 'hello@amdir.co.il' },
    { icon: MapPin, label: 'כתובת', value: 'תל אביב, ישראל' },
    { icon: Clock, label: 'שעות פעילות', value: 'א׳-ה׳ 9:00 - 18:00' },
  ];

  return (
    <section id="contact" dir="rtl" className="py-24 bg-card/30 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-wider text-primary mb-4">צרו קשר</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
            בואו ניצור משהו מדהים ביחד
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div>
            <div className="bg-card border border-primary/20 rounded-lg p-8 h-full">
              <h3 className="font-serif text-2xl text-foreground mb-8">פרטי התקשרות</h3>
              
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                      <p className="text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-12 pt-8 border-t border-primary/10">
                <p className="text-xs text-muted-foreground mb-4">עקבו אחרינו</p>
                <div className="flex gap-4">
                  {['פייסבוק', 'אינסטגרם', 'לינקדאין'].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    שם מלא
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ישראל ישראלי"
                    className="bg-background border-primary/20 focus:border-primary h-12"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    אימייל
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="israel@example.com"
                    className="bg-background border-primary/20 focus:border-primary h-12"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">
                  מספר טלפון
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="050-000-0000"
                  className="bg-background border-primary/20 focus:border-primary h-12"
                />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">
                  ההודעה שלכם
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="ספרו לנו על הפרויקט שלכם..."
                  className="bg-background border-primary/20 focus:border-primary min-h-[150px] resize-none"
                  required
                />
              </div>
              
              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 text-sm py-6"
              >
                <Send className="w-4 h-4 ml-2" />
                שליחת הודעה
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
