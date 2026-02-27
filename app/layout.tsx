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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className="font-heebo antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
