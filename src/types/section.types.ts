import type { Tables, TablesInsert, TablesUpdate, Json } from '@/integrations/supabase/types';

// Base types from Supabase
export type Section = Tables<'sections'>;
export type SectionInsert = TablesInsert<'sections'>;
export type SectionUpdate = TablesUpdate<'sections'>;

// Section types enum
export const SECTION_TYPES = [
  'hero',
  'features', 
  'gallery',
  'testimonials',
  'cta',
  'contact',
  'about',
  'footer',
  'pricing',
  'team',
  'faq',
  'stats',
] as const;

export type SectionType = typeof SECTION_TYPES[number];

// Content types for each section
export interface HeroContent {
  headline: string;
  subheadline: string;
  cta_primary?: {
    text: string;
    url: string;
  };
  cta_secondary?: {
    text: string;
    url: string;
  };
  background_image?: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface FeaturesContent {
  title: string;
  subtitle?: string;
  items: FeatureItem[];
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
}

export interface TestimonialsContent {
  title: string;
  items: TestimonialItem[];
}

export interface CTAContent {
  headline: string;
  description?: string;
  button: {
    text: string;
    url: string;
  };
}

export interface ContactContent {
  title: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface FooterContent {
  copyright: string;
  links?: Array<{
    label: string;
    url: string;
  }>;
  social?: Array<{
    platform: string;
    url: string;
  }>;
}

export interface AboutContent {
  title: string;
  description: string;
  image?: string;
}

export interface GalleryContent {
  title?: string;
  images: Array<{
    id: string;
    url: string;
    alt?: string;
    caption?: string;
  }>;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  cta?: {
    text: string;
    url: string;
  };
}

export interface PricingContent {
  title: string;
  subtitle?: string;
  plans: PricingPlan[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image?: string;
  bio?: string;
  social?: Array<{
    platform: string;
    url: string;
  }>;
}

export interface TeamContent {
  title: string;
  subtitle?: string;
  members: TeamMember[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQContent {
  title: string;
  items: FAQItem[];
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
}

export interface StatsContent {
  title?: string;
  items: StatItem[];
}

// Union type for all section content
export type SectionContent =
  | HeroContent
  | FeaturesContent
  | TestimonialsContent
  | CTAContent
  | ContactContent
  | FooterContent
  | AboutContent
  | GalleryContent
  | PricingContent
  | TeamContent
  | FAQContent
  | StatsContent
  | Json;
