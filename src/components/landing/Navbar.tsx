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
    { label: 'Home', href: '#hero' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Services', href: '#features' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
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
      <nav className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-start group">
          <span className="text-2xl font-serif font-bold gold-text tracking-wider">AMDIR</span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Digital Agency</span>
        </Link>

        {/* Tagline - Desktop Only */}
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Crafting Premium Digital Experiences
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          {user ? (
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 uppercase tracking-wider text-xs px-6"
            >
              Dashboard
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 uppercase tracking-wider text-xs px-6"
            >
              Get a Free Quote
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-primary">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-background border-primary/20">
            <div className="flex flex-col gap-6 mt-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-lg uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors text-left"
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
                  variant="outline"
                  className="w-full border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-wider text-xs"
                >
                  {user ? 'Dashboard' : 'Get a Free Quote'}
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
