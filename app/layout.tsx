import type { Metadata, Viewport } from 'next';
import './globals.css';
import '@/components/accessibility/styles/accessibility.css';
import { Providers } from './providers';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://amdir.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'AMDIR - בונה אתרים מקצועי | צור אתר עסקי בדקות',
    template: '%s | AMDIR',
  },
  description: 'פלטפורמת בניית אתרים מקצועית מבית AMDIR. צור אתרים עסקיים מרהיבים עם עורך ויזואלי, תבניות פרימיום ובינה מלאכותית. ללא קוד, ללא מאמץ.',
  keywords: ['בניית אתרים', 'עיצוב אתרים', 'אתר עסקי', 'עורך ויזואלי', 'תבניות אתרים', 'AMDIR', 'בינה מלאכותית'],
  authors: [{ name: 'AMDIR', url: SITE_URL }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: SITE_URL,
    siteName: 'AMDIR',
    title: 'AMDIR - בונה אתרים מקצועי | צור אתר עסקי בדקות',
    description: 'פלטפורמת בניית אתרים מקצועית מבית AMDIR. צור אתרים עסקיים מרהיבים עם עורך ויזואלי, תבניות פרימיום ובינה מלאכותית.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AMDIR - פלטפורמת בניית אתרים מקצועית' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AMDIR - בונה אתרים מקצועי',
    description: 'צור אתרים עסקיים מרהיבים עם עורך ויזואלי, תבניות פרימיום ובינה מלאכותית.',
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0c14' },
  ],
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'AMDIR',
  description: 'פלטפורמת בניית אתרים מקצועית. צור אתרים עסקיים מרהיבים עם עורך ויזואלי, תבניות פרימיום ובינה מלאכותית.',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: [
    'https://www.facebook.com/amdir',
    'https://www.instagram.com/amdir',
    'https://www.linkedin.com/company/amdir',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'תל אביב',
    addressCountry: 'IL',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['Hebrew', 'English'],
  },
  serviceArea: {
    '@type': 'Country',
    name: 'Israel',
  },
  priceRange: '$$',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className="font-heebo antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
