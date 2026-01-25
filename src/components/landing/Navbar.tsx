import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, Sparkles } from 'lucide-react';
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
    { label: 'תכונות', href: '#features' },
    { label: 'איך זה עובד', href: '#how-it-works' },
    { label: 'מחירים', href: '#pricing' },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass border-b border-border/50 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="text-xl font-bold gradient-text">AMDIR</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group story-link"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              לדשבורד
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-muted-foreground hover:text-foreground"
              >
                התחברות
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
              >
                התחל בחינם
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 glass-dark">
            <div className="flex flex-col gap-6 mt-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-lg font-medium text-right hover:text-primary transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
                {user ? (
                  <Button
                    onClick={() => {
                      navigate('/dashboard');
                      setIsOpen(false);
                    }}
                    className="bg-gradient-to-r from-primary to-accent"
                  >
                    לדשבורד
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigate('/dashboard');
                        setIsOpen(false);
                      }}
                    >
                      התחברות
                    </Button>
                    <Button
                      onClick={() => {
                        navigate('/dashboard');
                        setIsOpen(false);
                      }}
                      className="bg-gradient-to-r from-primary to-accent"
                    >
                      התחל בחינם
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Navbar;
