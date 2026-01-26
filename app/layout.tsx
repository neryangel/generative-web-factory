import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'AMDIR - בונה אתרים מקצועי',
  description: 'צור אתרים מקצועיים בקלות עם AMDIR',
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
