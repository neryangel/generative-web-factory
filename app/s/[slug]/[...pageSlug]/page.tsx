import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteRenderer } from '@/components/site/SiteRenderer';
import { fetchPublishedSiteBySlug } from '@/lib/fetch-published-site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; pageSlug: string[] }>;
}): Promise<Metadata> {
  const { slug, pageSlug } = await params;
  const siteData = await fetchPublishedSiteBySlug(slug);

  if (!siteData) {
    return {
      title: 'אתר לא נמצא',
    };
  }

  const targetSlug = pageSlug.join('/');
  const page = siteData.snapshot.pages?.find((p) => p.slug === targetSlug);
  const seo = page?.seo as Record<string, string> | undefined;

  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://amdir.app'}/s/${slug}/${targetSlug}`;

  return {
    title: seo?.title || page?.title || siteData.site?.name || 'אתר',
    description: seo?.description || '',
    openGraph: {
      title: seo?.title || page?.title || siteData.site?.name,
      description: seo?.description || '',
      images: seo?.ogImage ? [seo.ogImage] : [],
      url: pageUrl,
      locale: 'he_IL',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.title || page?.title || siteData.site?.name || 'אתר',
      description: seo?.description || '',
      images: seo?.ogImage ? [seo.ogImage] : [],
    },
  };
}

export default async function PublicSiteSubPage({
  params,
}: {
  params: Promise<{ slug: string; pageSlug: string[] }>;
}) {
  const { slug, pageSlug } = await params;
  const siteData = await fetchPublishedSiteBySlug(slug);

  if (!siteData) {
    notFound();
  }

  // Find the requested page
  const targetSlug = pageSlug.join('/');
  const currentPage = siteData.snapshot.pages?.find((p) => p.slug === targetSlug);

  if (!currentPage) {
    notFound();
  }

  return <SiteRenderer siteData={siteData} currentPage={currentPage} />;
}
