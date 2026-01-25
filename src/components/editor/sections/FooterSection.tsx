import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Building2, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

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
  };

  const defaultSocial = [
    { platform: 'facebook', url: '#' },
    { platform: 'instagram', url: '#' },
    { platform: 'twitter', url: '#' },
  ];

  const social = footerContent.social?.length ? footerContent.social : defaultSocial;

  return (
    <footer 
      className={`py-12 px-4 bg-sidebar text-sidebar-foreground transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onSelect}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Tagline */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                   style={{ background: 'var(--gradient-primary)' }}>
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">העסק שלי</span>
            </div>
            <EditableText
              value={footerContent.tagline || 'תיאור קצר של העסק שלכם כאן. משפט או שניים שמסבירים מה אתם עושים.'}
              onChange={(value) => updateContent('tagline', value)}
              isEditing={isEditing}
              className="text-sidebar-foreground/70 max-w-sm"
              as="p"
            />
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">קישורים מהירים</h4>
            <ul className="space-y-2 text-sidebar-foreground/70">
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">דף הבית</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">אודות</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">שירותים</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">צור קשר</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">עקבו אחרינו</h4>
            <div className="flex gap-3">
              {social.map((item, index) => {
                const Icon = socialIcons[item.platform || 'facebook'] || Facebook;
                return (
                  <a 
                    key={index}
                    href={item.url || '#'}
                    className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-sidebar-border pt-8 text-center text-sidebar-foreground/50">
          <EditableText
            value={footerContent.copyright || `© ${new Date().getFullYear()} כל הזכויות שמורות`}
            onChange={(value) => updateContent('copyright', value)}
            isEditing={isEditing}
            className="text-sm"
            as="p"
          />
        </div>
      </div>
    </footer>
  );
}
