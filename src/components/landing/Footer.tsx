import { Link } from 'react-router-dom';
import { Sparkles, ArrowUp, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'תכונות', href: '#features' },
      { label: 'תבניות', href: '#' },
      { label: 'מחירים', href: '#pricing' },
      { label: 'שאלות נפוצות', href: '#' },
    ],
    company: [
      { label: 'אודותינו', href: '#' },
      { label: 'בלוג', href: '#' },
      { label: 'קריירה', href: '#' },
      { label: 'צור קשר', href: '#' },
    ],
    legal: [
      { label: 'תנאי שימוש', href: '#' },
      { label: 'מדיניות פרטיות', href: '#' },
      { label: 'נגישות', href: '#' },
    ],
  };

  return (
    <footer className="relative bg-sidebar border-t border-border overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="floating-orb w-64 h-64 -bottom-32 -right-32 from-primary/10 to-accent/10" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-border/50">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-3">הישארו מעודכנים</h3>
            <p className="text-muted-foreground mb-6">
              קבלו טיפים, עדכונים והצעות מיוחדות ישירות למייל
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="הזינו את המייל שלכם"
                className="flex-1 bg-background/50 border-border/50"
              />
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                <Mail className="w-4 h-4 ml-2" />
                הרשמה
              </Button>
            </form>
          </div>
        </div>

        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">AMDIR</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-xs">
              הפלטפורמה המובילה לבניית אתרים בישראל. פשוט, מהיר, מקצועי.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                support@amdir.co.il
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                03-1234567
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                תל אביב, ישראל
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">מוצר</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">חברה</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4">משפטי</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} AMDIR. כל הזכויות שמורות.
          </p>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToTop}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            חזרה למעלה
            <ArrowUp className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
