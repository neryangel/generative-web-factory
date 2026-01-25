import { HeroSection } from './sections/HeroSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { GallerySection } from './sections/GallerySection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { CTASection } from './sections/CTASection';
import { ContactSection } from './sections/ContactSection';
import { AboutSection } from './sections/AboutSection';
import { FooterSection } from './sections/FooterSection';

export interface SectionContent {
  [key: string]: unknown;
}

export interface SectionProps {
  id: string;
  type: string;
  variant: string;
  content: SectionContent;
  settings: Record<string, unknown>;
  isEditing?: boolean;
  onContentChange?: (content: SectionContent) => void;
  onSelect?: () => void;
  isSelected?: boolean;
}

const sectionComponents: Record<string, React.ComponentType<SectionProps>> = {
  hero: HeroSection,
  features: FeaturesSection,
  gallery: GallerySection,
  testimonials: TestimonialsSection,
  cta: CTASection,
  contact: ContactSection,
  about: AboutSection,
  footer: FooterSection,
};

export function SectionRenderer(props: SectionProps) {
  const Component = sectionComponents[props.type];
  
  if (!Component) {
    return (
      <div className="p-8 text-center border-2 border-dashed border-muted rounded-lg">
        <p className="text-muted-foreground">
          Unknown section type: {props.type}
        </p>
      </div>
    );
  }

  return <Component {...props} />;
}
