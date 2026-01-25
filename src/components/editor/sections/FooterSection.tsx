import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Building2, Facebook, Instagram, Twitter, Linkedin, Youtube, Mail, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SocialLink {
  platform?: string;
  url?: string;
}

interface FooterLink {
  text?: string;
  url?: string;
}

interface LinkGroup {
  title?: string;
  items?: FooterLink[];
}

interface FooterContent {
  logo?: string;
  tagline?: string;
  links?: LinkGroup[];
  social?: SocialLink[];
  copyright?: string;
  newsletter_title?: string;
  newsletter_description?: string;
}

export function FooterSection({ 
  content, 
  isEditing, 
  onContentChange,
  onSelect,
  isSelected 
}: SectionProps) {
  const footerContent = content as FooterContent;

  const updateContent = (key: keyof FooterContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    youtube: Youtube,
  };

  const socialColors: Record<string, string> = {
    facebook: 'hover:bg-blue-500',
    instagram: 'hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-400',
    twitter: 'hover:bg-sky-500',
    linkedin: 'hover:bg-blue-600',
    youtube: 'hover:bg-red-600',
  };

  const defaultSocial = [
    { platform: 'facebook', url: '#' },
    { platform: 'instagram', url: '#' },
    { platform: 'twitter', url: '#' },
    { platform: 'linkedin', url: '#' },
  ];

  const social = footerContent.social?.length ? footerContent.social : defaultSocial;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      className={`relative overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
    >
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sidebar via-sidebar to-black" />
      
      {/* Decorative grid */}
      <div className="absolute inset-0 grid-pattern opacity-5" />
      
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      {/* Newsletter Section */}
      <div className="relative border-b border-sidebar-border">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-right">
              <EditableText
                value={footerContent.newsletter_title || 'הישארו מעודכנים'}
                onChange={(value) => updateContent('newsletter_title', value)}
                isEditing={isEditing}
                className="text-2xl md:text-3xl font-bold text-white mb-2"
                as="h3"
              />
              <EditableText
                value={footerContent.newsletter_description || 'הירשמו לניוזלטר שלנו וקבלו עדכונים ישירות למייל'}
                onChange={(value) => updateContent('newsletter_description', value)}
                isEditing={isEditing}
                className="text-sidebar-foreground/60"
                as="p"
              />
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <Input 
                placeholder="הזינו את האימייל שלכם" 
                className="h-12 bg-white/5 border-sidebar-border text-white placeholder:text-white/40 w-full md:w-72"
                onClick={(e) => e.stopPropagation()}
              />
              <Button className="h-12 px-6 btn-premium">
                <span className="relative z-10 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  הרשמה
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Tagline */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                   style={{ background: 'var(--gradient-primary)' }}>
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-2xl text-white">העסק שלי</span>
            </div>
            <EditableText
              value={footerContent.tagline || 'אנחנו מובילים את התעשייה עם פתרונות חדשניים ושירות מעולה. הצטרפו אלינו למסע להצלחה.'}
              onChange={(value) => updateContent('tagline', value)}
              isEditing={isEditing}
              className="text-sidebar-foreground/60 leading-relaxed mb-6"
              as="p"
            />
            
            {/* Social icons */}
            <div className="flex gap-3">
              {social.map((item, index) => {
                const Icon = socialIcons[item.platform || 'facebook'] || Facebook;
                const hoverColor = socialColors[item.platform || 'facebook'] || 'hover:bg-primary';
                return (
                  <a 
                    key={index}
                    href={item.url || '#'}
                    className={`group w-11 h-11 rounded-xl bg-sidebar-accent flex items-center justify-center transition-all duration-300 ${hoverColor} hover:scale-110 hover:shadow-lg`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Icon className="w-5 h-5 text-sidebar-foreground/70 group-hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg">קישורים מהירים</h4>
            <ul className="space-y-4">
              {['דף הבית', 'אודות', 'שירותים', 'בלוג', 'צור קשר'].map((link, i) => (
                <li key={i}>
                  <a 
                    href="#" 
                    className="text-sidebar-foreground/60 hover:text-white transition-colors inline-flex items-center gap-2 group"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg">שירותים</h4>
            <ul className="space-y-4">
              {['עיצוב אתרים', 'פיתוח אפליקציות', 'שיווק דיגיטלי', 'קידום אורגני', 'ניהול רשתות'].map((link, i) => (
                <li key={i}>
                  <a 
                    href="#" 
                    className="text-sidebar-foreground/60 hover:text-white transition-colors inline-flex items-center gap-2 group"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg">יצירת קשר</h4>
            <ul className="space-y-4 text-sidebar-foreground/60">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 text-primary" />
                <span>hello@example.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Building2 className="w-5 h-5 mt-0.5 text-primary" />
                <span>תל אביב, ישראל</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-sidebar-border">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <EditableText
            value={footerContent.copyright || `© ${new Date().getFullYear()} כל הזכויות שמורות. עוצב באהבה 💜`}
            onChange={(value) => updateContent('copyright', value)}
            isEditing={isEditing}
            className="text-sm text-sidebar-foreground/40"
            as="p"
          />
          
          {/* Scroll to top button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); scrollToTop(); }}
            className="group flex items-center gap-2 text-sidebar-foreground/40 hover:text-white hover:bg-white/10"
          >
            <span>חזרה למעלה</span>
            <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-1" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
