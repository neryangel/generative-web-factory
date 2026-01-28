import { SectionProps } from '../SectionRenderer';
import { EditableText } from '../EditableText';
import { Building2, Facebook, Instagram, Twitter, Linkedin, Youtube, Mail, ArrowUp, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';

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

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
};

const defaultSocial: SocialLink[] = [
  { platform: 'facebook', url: '#' },
  { platform: 'instagram', url: '#' },
  { platform: 'twitter', url: '#' },
  { platform: 'linkedin', url: '#' },
];

export function FooterSection({
  content,
  variant,
  isEditing,
  onContentChange,
  onSelect,
  isSelected,
}: SectionProps) {
  const footerContent = content as FooterContent;
  const { colors, fonts, getButtonRadius, getCardRadius } = useTheme();

  const updateContent = (key: keyof FooterContent, value: unknown) => {
    onContentChange?.({ ...content, [key]: value });
  };

  const social = footerContent.social?.length ? footerContent.social : defaultSocial;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSocialIcon = (item: SocialLink, index: number, size = 'w-5 h-5', containerClass = '') => {
    const Icon = socialIcons[item.platform || 'facebook'] || Facebook;
    return (
      <a
        key={index}
        href={item.url || '#'}
        className={`group flex items-center justify-center transition-all duration-300 hover:scale-110 ${containerClass}`}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = colors.primary;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = '';
        }}
      >
        <Icon className={`${size} text-sidebar-foreground/70 group-hover:text-white transition-colors`} />
      </a>
    );
  };

  const selectedRing = isSelected ? 'ring-2 ring-primary ring-offset-2' : '';

  // ─── VARIANT: simple ───────────────────────────────────────────────
  if (variant === 'simple') {
    return (
      <footer
        className={`relative transition-all ${selectedRing}`}
        onClick={onSelect}
        style={{ fontFamily: fonts.body }}
      >
        <div
          className="border-t"
          style={{ borderColor: `${colors.primary}20`, backgroundColor: colors.secondary }}
        >
          {/* Single compact row */}
          <div className="max-w-7xl mx-auto px-4 py-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Social icons - left side */}
              <div className="flex items-center gap-2 order-2 md:order-1">
                {social.map((item, index) => {
                  const Icon = socialIcons[item.platform || 'facebook'] || Facebook;
                  return (
                    <a
                      key={index}
                      href={item.url || '#'}
                      className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110"
                      style={{ backgroundColor: `${colors.primary}15` }}
                      onClick={(e) => e.stopPropagation()}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = colors.primary;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = `${colors.primary}15`;
                      }}
                    >
                      <Icon className="w-4 h-4 text-sidebar-foreground/70 group-hover:text-white transition-colors" />
                    </a>
                  );
                })}
              </div>

              {/* Links - center */}
              <nav className="flex items-center gap-6 order-1 md:order-2">
                {['דף הבית', 'אודות', 'שירותים', 'צור קשר'].map((link, i) => (
                  <a
                    key={i}
                    href="#"
                    className="text-sm text-sidebar-foreground/60 hover:text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {link}
                  </a>
                ))}
              </nav>

              {/* Logo - right side */}
              <div className="flex items-center gap-2 order-3">
                <span className="font-bold text-lg text-white" style={{ fontFamily: fonts.heading }}>
                  {footerContent.logo || 'העסק שלי'}
                </span>
                <div
                  className="w-8 h-8 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                    borderRadius: getButtonRadius(),
                  }}
                >
                  <Building2 className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Copyright row */}
            <div className="mt-4 pt-3 border-t text-center" style={{ borderColor: `${colors.primary}10` }}>
              <EditableText
                value={footerContent.copyright || `© ${new Date().getFullYear()} כל הזכויות שמורות.`}
                onChange={(value) => updateContent('copyright', value)}
                isEditing={isEditing}
                className="text-xs text-sidebar-foreground/30"
                as="p"
              />
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // ─── VARIANT: minimal ──────────────────────────────────────────────
  if (variant === 'minimal') {
    return (
      <footer
        className={`relative transition-all ${selectedRing}`}
        onClick={onSelect}
        style={{ fontFamily: fonts.body }}
      >
        <div className="py-16 px-4" style={{ backgroundColor: colors.secondary }}>
          <div className="max-w-md mx-auto text-center">
            {/* Centered logo */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div
                className="w-12 h-12 flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                  borderRadius: getCardRadius(),
                }}
              >
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <EditableText
              value={footerContent.logo || 'העסק שלי'}
              onChange={(value) => updateContent('logo', value)}
              isEditing={isEditing}
              className="text-2xl font-bold text-white mb-3 block"
              as="h3"
              style={{ fontFamily: fonts.heading }}
            />

            {/* Tagline */}
            <EditableText
              value={footerContent.tagline || 'מובילים חדשנות, מספקים מצוינות.'}
              onChange={(value) => updateContent('tagline', value)}
              isEditing={isEditing}
              className="text-sidebar-foreground/50 leading-relaxed mb-8 block"
              as="p"
            />

            {/* Divider */}
            <div
              className="w-16 h-0.5 mx-auto mb-8"
              style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})` }}
            />

            {/* Social icons row */}
            <div className="flex items-center justify-center gap-4 mb-10">
              {social.map((item, index) => {
                const Icon = socialIcons[item.platform || 'facebook'] || Facebook;
                return (
                  <a
                    key={index}
                    href={item.url || '#'}
                    className="w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                    style={{ borderColor: `${colors.primary}30` }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.backgroundColor = colors.primary;
                      el.style.borderColor = colors.primary;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.backgroundColor = '';
                      el.style.borderColor = `${colors.primary}30`;
                    }}
                  >
                    <Icon className="w-4 h-4 text-sidebar-foreground/60 group-hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div>

            {/* Copyright at bottom */}
            <EditableText
              value={footerContent.copyright || `© ${new Date().getFullYear()} כל הזכויות שמורות.`}
              onChange={(value) => updateContent('copyright', value)}
              isEditing={isEditing}
              className="text-xs text-sidebar-foreground/30"
              as="p"
            />
          </div>
        </div>
      </footer>
    );
  }

  // ─── VARIANT: mega ─────────────────────────────────────────────────
  if (variant === 'mega') {
    const linkGroups = footerContent.links?.length
      ? footerContent.links
      : [
          { title: 'קישורים מהירים', items: [{ text: 'דף הבית' }, { text: 'אודות' }, { text: 'בלוג' }, { text: 'קריירה' }] },
          { title: 'שירותים', items: [{ text: 'עיצוב אתרים' }, { text: 'פיתוח אפליקציות' }, { text: 'שיווק דיגיטלי' }, { text: 'קידום אורגני' }] },
          { title: 'תמיכה', items: [{ text: 'צור קשר' }, { text: 'שאלות נפוצות' }, { text: 'תנאי שימוש' }, { text: 'מדיניות פרטיות' }] },
          { title: 'משאבים', items: [{ text: 'מדריכים' }, { text: 'מאמרים' }, { text: 'סרטונים' }, { text: 'פודקאסט' }] },
        ];

    return (
      <footer
        className={`relative transition-all ${selectedRing}`}
        onClick={onSelect}
        style={{ fontFamily: fonts.body }}
      >
        {/* Newsletter - full-width colored banner */}
        <div
          className="relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` }}
        >
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
              }}
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 py-14">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-right lg:max-w-md">
                <EditableText
                  value={footerContent.newsletter_title || 'הצטרפו לקהילה שלנו'}
                  onChange={(value) => updateContent('newsletter_title', value)}
                  isEditing={isEditing}
                  className="text-3xl md:text-4xl font-bold text-white mb-3"
                  as="h3"
                  style={{ fontFamily: fonts.heading }}
                />
                <EditableText
                  value={footerContent.newsletter_description || 'קבלו תוכן בלעדי, טיפים מקצועיים ועדכונים ישירות לתיבת המייל שלכם.'}
                  onChange={(value) => updateContent('newsletter_description', value)}
                  isEditing={isEditing}
                  className="text-white/80 text-lg"
                  as="p"
                />
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <Input
                  placeholder="הזינו את האימייל שלכם"
                  className="h-14 bg-white/20 border-white/30 text-white placeholder:text-white/60 w-full lg:w-80 text-base"
                  style={{ borderRadius: getButtonRadius() }}
                  onClick={(e) => e.stopPropagation()}
                />
                <Button
                  className="h-14 px-8 bg-white hover:bg-white/90 text-base font-semibold"
                  style={{
                    color: colors.primary,
                    borderRadius: getButtonRadius(),
                  }}
                >
                  <Send className="w-5 h-5 ml-2" />
                  הרשמה
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-column links */}
        <div className="bg-gradient-to-b from-sidebar via-sidebar to-black">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
              {/* Brand column */}
              <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-11 h-11 flex items-center justify-center shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                      borderRadius: getCardRadius(),
                    }}
                  >
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-xl text-white" style={{ fontFamily: fonts.heading }}>
                    {footerContent.logo || 'העסק שלי'}
                  </span>
                </div>
                <EditableText
                  value={footerContent.tagline || 'אנחנו מובילים את התעשייה עם פתרונות חדשניים ושירות מעולה.'}
                  onChange={(value) => updateContent('tagline', value)}
                  isEditing={isEditing}
                  className="text-sidebar-foreground/50 text-sm leading-relaxed mb-6"
                  as="p"
                />
                <div className="flex items-center gap-2 text-sm text-sidebar-foreground/40">
                  <Mail className="w-4 h-4" style={{ color: colors.primary }} />
                  <span>hello@example.com</span>
                </div>
              </div>

              {/* Link groups */}
              {linkGroups.map((group, gi) => (
                <div key={gi}>
                  <h4 className="font-semibold text-white mb-5 text-base" style={{ fontFamily: fonts.heading }}>
                    {group.title}
                  </h4>
                  <ul className="space-y-3">
                    {group.items?.map((link, li) => (
                      <li key={li}>
                        <a
                          href={link.url || '#'}
                          className="text-sm text-sidebar-foreground/50 hover:text-white transition-colors inline-flex items-center gap-2 group"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span
                            className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ backgroundColor: colors.primary }}
                          />
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-sidebar-border">
            <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Logo + copyright */}
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                    borderRadius: '6px',
                  }}
                >
                  <Building2 className="w-3.5 h-3.5 text-white" />
                </div>
                <EditableText
                  value={footerContent.copyright || `© ${new Date().getFullYear()} כל הזכויות שמורות.`}
                  onChange={(value) => updateContent('copyright', value)}
                  isEditing={isEditing}
                  className="text-sm text-sidebar-foreground/40"
                  as="p"
                />
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-2">
                {social.map((item, index) => {
                  const Icon = socialIcons[item.platform || 'facebook'] || Facebook;
                  return (
                    <a
                      key={index}
                      href={item.url || '#'}
                      className="w-9 h-9 flex items-center justify-center bg-sidebar-accent transition-all duration-300 hover:scale-110"
                      style={{ borderRadius: getButtonRadius() }}
                      onClick={(e) => e.stopPropagation()}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = colors.primary;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = '';
                      }}
                    >
                      <Icon className="w-4 h-4 text-sidebar-foreground/70 group-hover:text-white transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // ─── VARIANT: default (columns) ────────────────────────────────────
  return (
    <footer
      className={`relative overflow-hidden transition-all ${selectedRing}`}
      onClick={onSelect}
      style={{ fontFamily: fonts.body }}
    >
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sidebar via-sidebar to-black" />

      {/* Decorative grid */}
      <div className="absolute inset-0 grid-pattern opacity-5" />

      {/* Decorative gradient orbs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: `${colors.primary}15` }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: `${colors.accent}10` }}
      />

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
                style={{ fontFamily: fonts.heading }}
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
                style={{ borderRadius: getButtonRadius() }}
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                className="h-12 px-6"
                style={{
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
                  borderRadius: getButtonRadius(),
                }}
              >
                <span className="relative z-10 flex items-center gap-2 text-white">
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
              <div
                className="w-12 h-12 flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
                  borderRadius: getCardRadius(),
                }}
              >
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-2xl text-white" style={{ fontFamily: fonts.heading }}>
                {footerContent.logo || 'העסק שלי'}
              </span>
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
                return (
                  <a
                    key={index}
                    href={item.url || '#'}
                    className="group w-11 h-11 bg-sidebar-accent flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    style={{ borderRadius: getCardRadius() }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = colors.primary;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '';
                    }}
                  >
                    <Icon className="w-5 h-5 text-sidebar-foreground/70 group-hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg" style={{ fontFamily: fonts.heading }}>קישורים מהירים</h4>
            <ul className="space-y-4">
              {['דף הבית', 'אודות', 'שירותים', 'בלוג', 'צור קשר'].map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-sidebar-foreground/60 hover:text-white transition-colors inline-flex items-center gap-2 group"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span
                      className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: colors.primary }}
                    />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg" style={{ fontFamily: fonts.heading }}>שירותים</h4>
            <ul className="space-y-4">
              {['עיצוב אתרים', 'פיתוח אפליקציות', 'שיווק דיגיטלי', 'קידום אורגני', 'ניהול רשתות'].map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-sidebar-foreground/60 hover:text-white transition-colors inline-flex items-center gap-2 group"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span
                      className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: colors.primary }}
                    />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg" style={{ fontFamily: fonts.heading }}>יצירת קשר</h4>
            <ul className="space-y-4 text-sidebar-foreground/60">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5" style={{ color: colors.primary }} />
                <span>hello@example.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Building2 className="w-5 h-5 mt-0.5" style={{ color: colors.primary }} />
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
            value={footerContent.copyright || `© ${new Date().getFullYear()} כל הזכויות שמורות. עוצב באהבה`}
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
            style={{ borderRadius: getButtonRadius() }}
          >
            <span>חזרה למעלה</span>
            <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-1" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
