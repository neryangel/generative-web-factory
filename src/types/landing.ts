/**
 * Landing Page Types
 */

export interface NavLink {
  label: string;
  href: string;
  id: string;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  alt: string;
  url?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

export interface ScrollPosition {
  x: number;
  y: number;
  direction: 'up' | 'down' | null;
  isAtTop: boolean;
  isAtBottom: boolean;
}

export interface CarouselState {
  currentIndex: number;
  scrollRef: React.RefObject<HTMLDivElement>;
  scrollTo: (index: number) => void;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

export interface AnalyticsEvent {
  category: 'navigation' | 'engagement' | 'conversion' | 'error';
  action: string;
  label?: string;
  value?: number;
}

export interface PageViewEvent {
  path: string;
  title: string;
  referrer?: string;
}
