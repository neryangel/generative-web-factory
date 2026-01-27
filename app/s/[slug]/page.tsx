import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteRenderer } from '@/components/site/SiteRenderer';
import { fetchPublishedSiteBySlug } from '@/lib/fetch-published-site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const siteData = await fetchPublishedSiteBySlug(slug);

  if (!siteData) {
    return {
      title: 'אתר לא נמצא',
    };
  }

  const homepage = siteData.snapshot.pages?.find((p) => p.is_homepage);
  const seo = homepage?.seo as Record<string, string> | undefined;

  return {
    title: seo?.title || siteData.site?.name || 'אתר',
    description: seo?.description || '',
    openGraph: {
      title: seo?.title || siteData.site?.name,
      description: seo?.description || '',
      images: seo?.ogImage ? [seo.ogImage] : [],
    },
  };
}

export default async function PublicSitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const siteData = await fetchPublishedSiteBySlug(slug);

  if (!siteData) {
    notFound();
  }

  // Find homepage
  const currentPage = siteData.snapshot.pages?.find((p) => p.is_homepage);

  if (!currentPage) {
    notFound();
  }

  return <SiteRenderer siteData={siteData} currentPage={currentPage} />;
}
