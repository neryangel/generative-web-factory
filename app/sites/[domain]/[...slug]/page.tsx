import { Metadata } from 'next';
import { SiteRenderer } from '@/components/site/SiteRenderer';
import { notFound } from 'next/navigation';
import { fetchPublishedSiteByDomain } from '@/lib/fetch-published-site';
import type { PublishedPage } from '@/types/published-site';

interface PageProps {
  params: Promise<{ domain: string; slug: string[] }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain, slug } = await params;
  const pageSlug = slug?.[0] || 'home';

  const data = await fetchPublishedSiteByDomain(domain);

  if (!data) {
    return { title: 'אתר לא נמצא' };
  }

  const page = data.snapshot?.pages?.find(
    (p: PublishedPage) => p.slug === pageSlug || (pageSlug === 'home' && p.is_homepage)
  );

  return {
    title: page?.seo?.title as string || page?.title || data.site?.name || 'אתר',
    description: page?.seo?.description as string || data.site?.settings?.description as string || '',
    openGraph: {
      title: page?.seo?.title as string || page?.title,
      description: page?.seo?.description as string || data.site?.settings?.description as string,
      images: page?.seo?.ogImage || data.site?.settings?.ogImage ? [page?.seo?.ogImage as string || data.site.settings.ogImage as string] : [],
      type: 'website',
    },
  };
}

export default async function CustomDomainSubPage({ params }: PageProps) {
  const { domain, slug } = await params;
  const pageSlug = slug?.[0] || 'home';

  const siteData = await fetchPublishedSiteByDomain(domain);

  if (!siteData) {
    notFound();
  }

  // Find the requested page
  const currentPage = siteData.snapshot?.pages?.find(
    (p: PublishedPage) => p.slug === pageSlug || (pageSlug === 'home' && p.is_homepage)
  );

  if (!currentPage) {
    notFound();
  }

  return <SiteRenderer siteData={siteData} currentPage={currentPage} />;
}
