/**
 * Landing Page Constants - Professional Configuration
 */

export const NAV_LINKS = [
  { label: 'בית', href: '#hero', id: 'hero' },
  { label: 'עבודות', href: '#portfolio', id: 'portfolio' },
  { label: 'שירותים', href: '#features', id: 'features' },
  { label: 'שאלות נפוצות', href: '#faq', id: 'faq' },
  { label: 'צור קשר', href: '#contact', id: 'contact' },
] as const;

export const SECTION_IDS = NAV_LINKS.map(link => link.id);

export const UI_CONFIG = {
  navbar: {
    scrollThreshold: 20,
    height: { mobile: 64, desktop: 80 },
    sectionDetectionOffset: 150,
  },
  carousel: {
    cardWidth: { mobile: 280, tablet: 320, desktop: 384 },
    scrollAmount: 400,
  },
  animations: {
    hoverScale: 1.05,
    tapScale: 0.98,
  },
} as const;

export const SEO_CONFIG = {
  siteName: 'AMDIR',
  siteUrl: 'https://amdir.co.il',
  defaultTitle: 'AMDIR - סוכנות דיגיטלית | עיצוב ופיתוח אתרים',
  defaultDescription: 'AMDIR - סוכנות דיגיטלית מובילה בישראל.',
  locale: 'he_IL',
} as const;

export const VALIDATION_MESSAGES = {
  name: { required: 'שם הוא שדה חובה', min: 'שם חייב להכיל לפחות 2 תווים' },
  email: { required: 'אימייל הוא שדה חובה', invalid: 'כתובת אימייל לא תקינה' },
  message: { required: 'הודעה היא שדה חובה', min: 'ההודעה חייבת להכיל לפחות 10 תווים' },
} as const;

export const API_ENDPOINTS = { contact: '/api/contact' } as const;
