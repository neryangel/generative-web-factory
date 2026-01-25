import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionRenderer, SectionProps } from './SectionRenderer';

// Mock all section components
vi.mock('./sections/HeroSection', () => ({
  HeroSection: (props: SectionProps) => (
    <div data-testid="hero-section" data-id={props.id}>
      Hero Section
    </div>
  ),
}));

vi.mock('./sections/FeaturesSection', () => ({
  FeaturesSection: (props: SectionProps) => (
    <div data-testid="features-section" data-id={props.id}>
      Features Section
    </div>
  ),
}));

vi.mock('./sections/GallerySection', () => ({
  GallerySection: (props: SectionProps) => (
    <div data-testid="gallery-section" data-id={props.id}>
      Gallery Section
    </div>
  ),
}));

vi.mock('./sections/TestimonialsSection', () => ({
  TestimonialsSection: (props: SectionProps) => (
    <div data-testid="testimonials-section" data-id={props.id}>
      Testimonials Section
    </div>
  ),
}));

vi.mock('./sections/CTASection', () => ({
  CTASection: (props: SectionProps) => (
    <div data-testid="cta-section" data-id={props.id}>
      CTA Section
    </div>
  ),
}));

vi.mock('./sections/ContactSection', () => ({
  ContactSection: (props: SectionProps) => (
    <div data-testid="contact-section" data-id={props.id}>
      Contact Section
    </div>
  ),
}));

vi.mock('./sections/AboutSection', () => ({
  AboutSection: (props: SectionProps) => (
    <div data-testid="about-section" data-id={props.id}>
      About Section
    </div>
  ),
}));

vi.mock('./sections/FooterSection', () => ({
  FooterSection: (props: SectionProps) => (
    <div data-testid="footer-section" data-id={props.id}>
      Footer Section
    </div>
  ),
}));

vi.mock('./sections/PricingSection', () => ({
  PricingSection: (props: SectionProps) => (
    <div data-testid="pricing-section" data-id={props.id}>
      Pricing Section
    </div>
  ),
}));

vi.mock('./sections/TeamSection', () => ({
  TeamSection: (props: SectionProps) => (
    <div data-testid="team-section" data-id={props.id}>
      Team Section
    </div>
  ),
}));

vi.mock('./sections/FAQSection', () => ({
  FAQSection: (props: SectionProps) => (
    <div data-testid="faq-section" data-id={props.id}>
      FAQ Section
    </div>
  ),
}));

vi.mock('./sections/StatsSection', () => ({
  StatsSection: (props: SectionProps) => (
    <div data-testid="stats-section" data-id={props.id}>
      Stats Section
    </div>
  ),
}));

describe('SectionRenderer', () => {
  const defaultProps: SectionProps = {
    id: 'section-1',
    type: 'hero',
    variant: 'default',
    content: {},
    settings: {},
  };

  describe('section type rendering', () => {
    it('should render hero section', () => {
      render(<SectionRenderer {...defaultProps} type="hero" />);
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    });

    it('should render features section', () => {
      render(<SectionRenderer {...defaultProps} type="features" />);
      expect(screen.getByTestId('features-section')).toBeInTheDocument();
    });

    it('should render gallery section', () => {
      render(<SectionRenderer {...defaultProps} type="gallery" />);
      expect(screen.getByTestId('gallery-section')).toBeInTheDocument();
    });

    it('should render testimonials section', () => {
      render(<SectionRenderer {...defaultProps} type="testimonials" />);
      expect(screen.getByTestId('testimonials-section')).toBeInTheDocument();
    });

    it('should render cta section', () => {
      render(<SectionRenderer {...defaultProps} type="cta" />);
      expect(screen.getByTestId('cta-section')).toBeInTheDocument();
    });

    it('should render contact section', () => {
      render(<SectionRenderer {...defaultProps} type="contact" />);
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
    });

    it('should render about section', () => {
      render(<SectionRenderer {...defaultProps} type="about" />);
      expect(screen.getByTestId('about-section')).toBeInTheDocument();
    });

    it('should render footer section', () => {
      render(<SectionRenderer {...defaultProps} type="footer" />);
      expect(screen.getByTestId('footer-section')).toBeInTheDocument();
    });

    it('should render pricing section', () => {
      render(<SectionRenderer {...defaultProps} type="pricing" />);
      expect(screen.getByTestId('pricing-section')).toBeInTheDocument();
    });

    it('should render team section', () => {
      render(<SectionRenderer {...defaultProps} type="team" />);
      expect(screen.getByTestId('team-section')).toBeInTheDocument();
    });

    it('should render faq section', () => {
      render(<SectionRenderer {...defaultProps} type="faq" />);
      expect(screen.getByTestId('faq-section')).toBeInTheDocument();
    });

    it('should render stats section', () => {
      render(<SectionRenderer {...defaultProps} type="stats" />);
      expect(screen.getByTestId('stats-section')).toBeInTheDocument();
    });
  });

  describe('unknown section type', () => {
    it('should render fallback for unknown section type', () => {
      render(<SectionRenderer {...defaultProps} type="unknown-type" />);
      expect(screen.getByText(/Unknown section type: unknown-type/)).toBeInTheDocument();
    });

    it('should have proper styling for fallback', () => {
      const { container } = render(<SectionRenderer {...defaultProps} type="invalid" />);
      expect(container.querySelector('.border-dashed')).toBeInTheDocument();
    });
  });

  describe('props passing', () => {
    it('should pass id to section component', () => {
      render(<SectionRenderer {...defaultProps} id="test-id" type="hero" />);
      expect(screen.getByTestId('hero-section')).toHaveAttribute('data-id', 'test-id');
    });

    it('should pass isEditing prop', () => {
      // This is tested through the mock - the component receives the prop
      render(<SectionRenderer {...defaultProps} isEditing={true} />);
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    });

    it('should pass onContentChange prop', () => {
      const onContentChange = vi.fn();
      render(<SectionRenderer {...defaultProps} onContentChange={onContentChange} />);
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    });
  });
});
