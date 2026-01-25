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
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const contactInfo = [
    { icon: Phone, label: 'Phone', value: '+972 3-123-4567' },
    { icon: Mail, label: 'Email', value: 'hello@amdir.co.il' },
    { icon: MapPin, label: 'Address', value: 'Tel Aviv, Israel' },
    { icon: Clock, label: 'Hours', value: 'Sun-Thu 9:00 - 18:00' },
  ];

  return (
    <section id="contact" className="py-24 bg-card/30 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Get in Touch</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
            Let's Create Something Amazing
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="order-2 lg:order-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                    Full Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="bg-background border-primary/20 focus:border-primary h-12"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="bg-background border-primary/20 focus:border-primary h-12"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+972 50-000-0000"
                  className="bg-background border-primary/20 focus:border-primary h-12"
                />
              </div>
              
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                  Your Message
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your project..."
                  className="bg-background border-primary/20 focus:border-primary min-h-[150px] resize-none"
                  required
                />
              </div>
              
              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 uppercase tracking-wider text-sm py-6"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="order-1 lg:order-2">
            <div className="bg-card border border-primary/20 rounded-lg p-8 h-full">
              <h3 className="font-serif text-2xl text-foreground mb-8">Contact Information</h3>
              
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{item.label}</p>
                      <p className="text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-12 pt-8 border-t border-primary/10">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">Follow Us</p>
                <div className="flex gap-4">
                  {['Facebook', 'Instagram', 'LinkedIn'].map((social) => (
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
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
