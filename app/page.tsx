'use client';

import { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import Footer from '@/components/landing/Footer';
import { SmoothScrollProvider } from '@/components/effects/SmoothScroll';
import { MagneticCursor } from '@/components/effects/MagneticCursor';
import { Preloader } from '@/components/effects/Preloader';
import { Loader2 } from 'lucide-react';

// Lazy load below-the-fold sections for better Core Web Vitals
const ClientLogosMarquee = lazy(() => import('@/components/landing/ClientLogosMarquee'));
const PortfolioSection = lazy(() => import('@/components/landing/PortfolioSection'));
const FeaturesSection = lazy(() => import('@/components/landing/FeaturesSection'));
const HowItWorksSection = lazy(() => import('@/components/landing/HowItWorksSection'));
const TestimonialsSection = lazy(() => import('@/components/landing/TestimonialsSection'));
const StatsSection = lazy(() => import('@/components/landing/StatsSection'));
const FAQSection = lazy(() => import('@/components/landing/FAQSection'));
const ContactSection = lazy(() => import('@/components/landing/ContactSection'));

// Loading fallback with skeleton
const SectionSkeleton = () => (
  <div className="py-24 bg-background">
    <div className="container mx-auto px-6">
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-card/50 rounded w-1/3 mx-auto" />
        <div className="h-4 bg-card/50 rounded w-2/3 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-card/50 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Client-only wrapper to avoid hydration issues with BrowserRouter
function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
}

export default function Home() {
  const [isPreloading, setIsPreloading] = useState(true);

  return (
    <ClientWrapper>
      <SmoothScrollProvider>
      {/* Premium Preloader */}
      <Preloader
        onComplete={() => setIsPreloading(false)}
        minDuration={1500}
      />

      {/* Custom Magnetic Cursor */}
      <MagneticCursor />

      <div className={`min-h-screen bg-background noise-texture transition-opacity duration-500 ${isPreloading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="skip-to-content">
          דלג לתוכן הראשי
        </a>

        <Navbar />

        <main id="main-content" role="main" aria-label="תוכן ראשי">
          {/* Hero is loaded eagerly - above the fold */}
          <HeroSection />

          {/* Client Logos Marquee */}
          <Suspense fallback={<SectionSkeleton />}>
            <ClientLogosMarquee />
          </Suspense>

          {/* Portfolio */}
          <Suspense fallback={<SectionSkeleton />}>
            <PortfolioSection />
          </Suspense>

          {/* Features */}
          <Suspense fallback={<SectionSkeleton />}>
            <FeaturesSection />
          </Suspense>

          {/* How It Works */}
          <Suspense fallback={<SectionSkeleton />}>
            <HowItWorksSection />
          </Suspense>

          {/* Testimonials - Social Proof */}
          <Suspense fallback={<SectionSkeleton />}>
            <TestimonialsSection />
          </Suspense>

          {/* Stats */}
          <Suspense fallback={<SectionSkeleton />}>
            <StatsSection />
          </Suspense>

          {/* FAQ */}
          <Suspense fallback={<SectionSkeleton />}>
            <FAQSection />
          </Suspense>

          {/* Contact */}
          <Suspense fallback={<SectionSkeleton />}>
            <ContactSection />
          </Suspense>
        </main>

        <Footer />
      </div>
      </SmoothScrollProvider>
    </ClientWrapper>
  );
}
