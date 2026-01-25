import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Optimized scroll handler with throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          
          // Update active section based on scroll position
          const sections = ['hero', 'portfolio', 'features', 'faq', 'contact'];
          for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
              const rect = element.getBoundingClientRect();
              if (rect.top <= 150 && rect.bottom >= 150) {
                setActiveSection(section);
                break;
              }
            }
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'בית', href: '#hero', id: 'hero' },
    { label: 'עבודות', href: '#portfolio', id: 'portfolio' },
    { label: 'שירותים', href: '#features', id: 'features' },
    { label: 'שאלות נפוצות', href: '#faq', id: 'faq' },
    { label: 'צור קשר', href: '#contact', id: 'contact' },
  ];

  const scrollToSection = useCallback((href: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  }, []);

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-primary/10 shadow-lg shadow-black/5'
          : 'bg-transparent'
      }`}
    >
      <nav 
        className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between" 
        dir="rtl"
        role="navigation"
        aria-label="ניווט ראשי"
      >
        {/* Logo */}
        <Link 
          to="/" 
          className="flex flex-col items-start group flex-shrink-0"
          aria-label="AMDIR - דף הבית"
        >
          <motion.span 
            className="text-xl sm:text-2xl font-serif font-bold gold-text tracking-wider"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            AMDIR
          </motion.span>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground">סוכנות דיגיטלית</span>
        </Link>

        {/* Desktop Navigation - Center */}
        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center" role="menubar">
          {navLinks.map((link) => (
            <motion.button
              key={link.href}
              onClick={(e) => scrollToSection(link.href, e)}
              className={`relative px-4 py-2 text-sm transition-colors duration-300 whitespace-nowrap rounded-full ${
                activeSection === link.id 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              role="menuitem"
              aria-current={activeSection === link.id ? 'page' : undefined}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {link.label}
              {activeSection === link.id && (
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  layoutId="activeSection"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* CTA Button - Left side */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          {user ? (
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 text-sm px-6"
            >
              לדשבורד
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 text-sm px-6"
            >
              קבלו הצעת מחיר
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary flex-shrink-0 min-w-[44px] min-h-[44px]"
              aria-label={isOpen ? "סגור תפריט" : "פתח תפריט"}
              aria-expanded={isOpen}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className="w-[280px] sm:w-72 bg-background/98 backdrop-blur-xl border-primary/20"
          >
            <motion.div 
              className="flex flex-col gap-4 sm:gap-6 mt-6 sm:mt-8" 
              dir="rtl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, staggerChildren: 0.05 }}
            >
              <Link 
                to="/" 
                className="flex flex-col items-start mb-2 sm:mb-4" 
                onClick={() => setIsOpen(false)}
                aria-label="AMDIR - דף הבית"
              >
                <span className="text-2xl font-serif font-bold gold-text tracking-wider">AMDIR</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">סוכנות דיגיטלית</span>
              </Link>
              
              <nav role="navigation" aria-label="תפריט נייד">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.href}
                    onClick={(e) => scrollToSection(link.href, e)}
                    className={`block w-full py-3 text-lg text-right transition-colors ${
                      activeSection === link.id 
                        ? 'text-primary font-medium' 
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    aria-current={activeSection === link.id ? 'page' : undefined}
                  >
                    {link.label}
                  </motion.button>
                ))}
              </nav>
              
              <motion.div 
                className="pt-4 sm:pt-6 border-t border-primary/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={() => {
                    navigate('/dashboard');
                    setIsOpen(false);
                  }}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm py-6"
                  size="lg"
                >
                  {user ? 'לדשבורד' : 'קבלו הצעת מחיר'}
                </Button>
              </motion.div>
            </motion.div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Navbar;
