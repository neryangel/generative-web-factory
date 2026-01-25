import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import PortfolioSection from '@/components/landing/PortfolioSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import FAQSection from '@/components/landing/FAQSection';
import ContactSection from '@/components/landing/ContactSection';
import Footer from '@/components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <PortfolioSection />
        <FeaturesSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
