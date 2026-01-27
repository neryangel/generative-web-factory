import { Metadata } from 'next';
import { SiteRenderer } from '@/components/site/SiteRenderer';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ domain: string; slug: string[] }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain, slug } = await params;
  const pageSlug = slug?.[0] || 'home';

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-published-site?domain=${encodeURIComponent(domain)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return { title: 'אתר לא נמצא' };
    }

    const data = await response.json();
    const page = data.snapshot?.pages?.find(
      (p: any) => p.slug === pageSlug || (pageSlug === 'home' && p.is_homepage)
    );

    return {
      title: page?.seo?.title || page?.title || data.site?.name || 'אתר',
      description: page?.seo?.description || data.site?.settings?.description || '',
      openGraph: {
        title: page?.seo?.title || page?.title,
        description: page?.seo?.description || data.site?.settings?.description,
        images: page?.seo?.ogImage || data.site?.settings?.ogImage ? [page?.seo?.ogImage || data.site.settings.ogImage] : [],
        type: 'website',
      },
    };
  } catch (error) {
    return { title: 'שגיאה' };
  }
}

export default async function CustomDomainSubPage({ params }: PageProps) {
  const { domain, slug } = await params;
  const pageSlug = slug?.[0] || 'home';

  // Fetch site data server-side
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-published-site?domain=${encodeURIComponent(domain)}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    notFound();
  }

  const siteData = await response.json();

  // Find the requested page
  const currentPage = siteData.snapshot?.pages?.find(
    (p: any) => p.slug === pageSlug || (pageSlug === 'home' && p.is_homepage)
  );

  if (!currentPage) {
    notFound();
  }

  return <SiteRenderer siteData={siteData} currentPage={currentPage} />;
}
