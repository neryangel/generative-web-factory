import { Metadata } from 'next';
import { SiteRenderer } from '@/components/site/SiteRenderer';
import { fetchPublishedSiteByDomain } from '@/lib/fetch-published-site';
import type { PublishedPage } from '@/types/published-site';

interface PageProps {
  params: Promise<{ domain: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain } = await params;
  const data = await fetchPublishedSiteByDomain(domain);

  if (!data) {
    return {
      title: 'אתר לא נמצא',
      description: 'האתר המבוקש לא נמצא',
    };
  }

  const homePage = data.snapshot?.pages?.find((p: PublishedPage) => p.is_homepage);

  return {
    title: data.site?.name || 'אתר',
    description: homePage?.seo?.description as string || data.site?.settings?.description as string || '',
    openGraph: {
      title: data.site?.name,
      description: homePage?.seo?.description as string || data.site?.settings?.description as string,
      images: data.site?.settings?.ogImage ? [data.site.settings.ogImage as string] : [],
      type: 'website',
    },
  };
}

export default async function CustomDomainPage({ params }: PageProps) {
  const { domain } = await params;
  const siteData = await fetchPublishedSiteByDomain(domain);

  if (!siteData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-8" dir="rtl">
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-8">האתר לא נמצא</p>
      </div>
    );
  }

  // Find homepage
  const homePage = siteData.snapshot?.pages?.find((p: PublishedPage) => p.is_homepage);

  if (!homePage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-8" dir="rtl">
        <h1 className="text-4xl font-bold mb-4 text-foreground">אין תוכן</h1>
        <p className="text-xl text-muted-foreground mb-8">האתר טרם פורסם</p>
      </div>
    );
  }

  return <SiteRenderer siteData={siteData} currentPage={homePage} />;
}
