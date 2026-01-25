import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = React.forwardRef<HTMLElement>((_, ref) => {
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowCookieConsent(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowCookieConsent(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const footerLinks = [
    { label: 'בית', action: () => scrollToSection('hero') },
    { label: 'שירותים', action: () => scrollToSection('features') },
    { label: 'עבודות', action: () => scrollToSection('portfolio') },
    { label: 'צור קשר', action: () => scrollToSection('contact') },
  ];

  return (
    <footer ref={ref} className="bg-card border-t border-border py-12" dir="rtl">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo */}
          <div className="text-2xl font-serif font-bold gold-text">
            AMDIR
          </div>

          {/* Links */}
          <nav className="flex gap-8">
            {footerLinks.map((link, index) => (
              <button
                key={index}
                onClick={link.action}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Back to Top */}
          <Button
            variant="outline"
            size="icon"
            onClick={scrollToTop}
            className="gold-border hover:bg-[hsl(var(--gold))]/10"
            aria-label="חזרה למעלה"
          >
            <ArrowUp className="w-5 h-5 gold-text" />
          </Button>
        </div>

        {/* Divider */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} AMDIR. כל הזכויות שמורות.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <button onClick={() => scrollToSection('contact')} className="hover:text-foreground transition-colors">
              מדיניות פרטיות
            </button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-foreground transition-colors">
              תנאי שימוש
            </button>
          </div>
        </div>
      </div>

      {/* Cookie Consent */}
      {showCookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm text-center sm:text-right">
              אנחנו משתמשים בעוגיות כדי לשפר את חווית הגלישה שלך באתר.
            </p>
            <Button
              onClick={handleAcceptCookies}
              className="bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-light))] text-background hover:opacity-90"
            >
              אישור
            </Button>
          </div>
        </div>
      )}
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
