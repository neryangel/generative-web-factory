import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'בית', href: '#hero' },
    { label: 'עבודות', href: '#portfolio' },
    { label: 'שירותים', href: '#features' },
    { label: 'שאלות נפוצות', href: '#faq' },
    { label: 'צור קשר', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-primary/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 h-20 flex items-center justify-between" dir="rtl">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-start group flex-shrink-0">
          <span className="text-2xl font-serif font-bold gold-text tracking-wider">AMDIR</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">סוכנות דיגיטלית</span>
        </Link>

        {/* Desktop Navigation - Center */}
        <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 whitespace-nowrap"
            >
              {link.label}
            </button>
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
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-primary flex-shrink-0">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-background border-primary/20">
            <div className="flex flex-col gap-6 mt-8" dir="rtl">
              <Link to="/" className="flex flex-col items-start mb-4" onClick={() => setIsOpen(false)}>
                <span className="text-2xl font-serif font-bold gold-text tracking-wider">AMDIR</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">סוכנות דיגיטלית</span>
              </Link>
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-lg text-muted-foreground hover:text-primary transition-colors text-right"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-6 border-t border-primary/20">
                <Button
                  onClick={() => {
                    navigate('/dashboard');
                    setIsOpen(false);
                  }}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
                >
                  {user ? 'לדשבורד' : 'קבלו הצעת מחיר'}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Navbar;
