import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const navLinks = ['בית', 'שירותים', 'עבודות', 'צור קשר', 'מדיניות פרטיות'];
  const socialLinks = ['פייסבוק', 'אינסטגרם', 'לינקדאין'];

  return (
    <footer dir="rtl" className="bg-card border-t border-primary/10">
      <div className="container mx-auto px-6">
        {/* Main Footer */}
        <div className="py-16 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Logo */}
          <div className="flex flex-col items-center lg:items-start">
            <Link to="/" className="flex flex-col items-center lg:items-start">
              <span className="text-3xl font-serif font-bold gold-text tracking-wider">AMDIR</span>
              <span className="text-xs text-muted-foreground mt-1">
                סוכנות דיגיטלית
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
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

        {/* Bottom Bar */}
        <div className="py-6 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} AMDIR. כל הזכויות שמורות.
          </p>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToTop}
            className="text-muted-foreground hover:text-primary flex items-center gap-2"
          >
            <ArrowUp className="w-4 h-4" />
            חזרה למעלה
          </Button>
        </div>
      </div>

      {/* Cookie Consent Bar */}
      <div className="bg-background border-t border-primary/10 py-4">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            אנחנו משתמשים בעוגיות לשיפור החוויה שלכם. בהמשך הגלישה אתם מסכימים לשימוש בעוגיות.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground text-xs"
          >
            אישור
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
