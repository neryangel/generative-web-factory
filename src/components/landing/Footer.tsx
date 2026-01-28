import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

const Footer = React.forwardRef<HTMLElement>((_, ref) => {
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setShowCookieConsent(true), 1500);
      return () => clearTimeout(timer);
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
    <footer 
      ref={ref} 
      className="bg-card border-t border-primary/10 py-8 sm:py-12" 
      dir="rtl"
      role="contentinfo"
      aria-label="פוטר האתר"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          {/* Logo */}
          <motion.div 
            className="text-xl sm:text-2xl font-serif font-bold gold-text"
            whileHover={{ scale: 1.05 }}
          >
            AMDIR
          </motion.div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-4 sm:gap-8" aria-label="ניווט פוטר">
            {footerLinks.map((link, index) => (
              <motion.button
                key={index}
                onClick={link.action}
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 min-h-[44px] flex items-center"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.label}
              </motion.button>
            ))}
          </nav>

          {/* Back to Top */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={scrollToTop}
              className="border-primary/30 hover:border-primary hover:bg-primary/10 rounded-full w-10 h-10 min-w-[44px] min-h-[44px] transition-all duration-300"
              aria-label="חזרה לראש העמוד"
            >
              <ArrowUp className="w-4 h-4 text-primary" />
            </Button>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} AMDIR. כל הזכויות שמורות.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <motion.button 
              onClick={() => scrollToSection('contact')} 
              className="hover:text-primary transition-colors duration-300"
              whileHover={{ x: -3 }}
            >
              מדיניות פרטיות
            </motion.button>
            <motion.button 
              onClick={() => scrollToSection('contact')} 
              className="hover:text-primary transition-colors duration-300"
              whileHover={{ x: -3 }}
            >
              תנאי שימוש
            </motion.button>
          </div>
        </div>
      </div>

      {/* Cookie Consent */}
      <AnimatePresence>
        {showCookieConsent && (
          <motion.div 
            className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-primary/20 p-4 z-50"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-muted-foreground text-sm text-center sm:text-right">
                אנחנו משתמשים בעוגיות כדי לשפר את חווית הגלישה שלך באתר.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleAcceptCookies}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
                >
                  אישור
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
