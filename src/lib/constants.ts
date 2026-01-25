import type { ViewMode } from '@/types';

// Section type definitions
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

// Section type labels (Hebrew)
export const SECTION_LABELS: Record<string, string> = {
  hero: 'כותרת ראשית',
  features: 'תכונות',
  gallery: 'גלריה',
  testimonials: 'המלצות',
  cta: 'קריאה לפעולה',
  contact: 'יצירת קשר',
  about: 'אודות',
  footer: 'פוטר',
  pricing: 'מחירים',
  team: 'צוות',
  faq: 'שאלות נפוצות',
  stats: 'סטטיסטיקות',
};

// Font options for theme customizer
export const FONT_OPTIONS = [
  { value: 'Heebo', label: 'Heebo' },
  { value: 'Assistant', label: 'Assistant' },
  { value: 'Rubik', label: 'Rubik' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Alef', label: 'Alef' },
  { value: 'Varela Round', label: 'Varela Round' },
] as const;

// Border radius options
export const BORDER_RADIUS_OPTIONS = [
  { value: 'sharp', label: 'חד', cssValue: '0px' },
  { value: 'rounded', label: 'מעוגל', cssValue: '8px' },
  { value: 'pill', label: 'כדורי', cssValue: '9999px' },
] as const;

// View mode widths for responsive preview
export const VIEW_MODE_WIDTHS: Record<ViewMode, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

// Color presets for theme customizer
export const COLOR_PRESETS = [
  { name: 'סגול', primary: '#5d00ff', secondary: '#000000', accent: '#6f6758' },
  { name: 'כחול', primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6' },
  { name: 'ירוק', primary: '#059669', secondary: '#047857', accent: '#10b981' },
  { name: 'אדום', primary: '#dc2626', secondary: '#b91c1c', accent: '#ef4444' },
  { name: 'כתום', primary: '#ea580c', secondary: '#c2410c', accent: '#f97316' },
  { name: 'ורוד', primary: '#db2777', secondary: '#be185d', accent: '#ec4899' },
] as const;

// Status labels
export const SITE_STATUS_LABELS: Record<string, string> = {
  draft: 'טיוטה',
  published: 'פורסם',
  archived: 'בארכיון',
};

// Domain status labels
export const DOMAIN_STATUS_LABELS: Record<string, string> = {
  pending: 'ממתין',
  verifying: 'מאמת',
  active: 'פעיל',
  failed: 'נכשל',
};

// API endpoints
export const API_ENDPOINTS = {
  GENERATE_SITE: 'generate-site',
  GET_PUBLISHED_SITE: 'get-published-site',
  VERIFY_DOMAIN: 'verify-domain',
} as const;

// Debounce delays (ms)
export const DEBOUNCE_DELAYS = {
  AUTO_SAVE: 1500,
  SEARCH: 300,
  RESIZE: 100,
} as const;

// Animation durations (ms)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;
