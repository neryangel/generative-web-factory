import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteRenderer } from '@/components/site/SiteRenderer';

interface PublishedSection {
  id: string;
  type: string;
  variant: string;
  content: Record<string, unknown>;
  settings: Record<string, unknown>;
  sort_order: number;
}

interface PublishedPage {
  id: string;
  slug: string;
  title: string;
  is_homepage: boolean;
  seo: Record<string, unknown>;
  sections: PublishedSection[];
}

interface SiteData {
  site: {
    name: string;
    settings: Record<string, unknown>;
  };
  snapshot: {
    pages: PublishedPage[];
    settings?: Record<string, unknown>;
  };
  version: number;
  publishedAt: string;
}

async function getSiteData(slug: string): Promise<SiteData | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase configuration');
    return null;
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/get-published-site?slug=${encodeURIComponent(slug)}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching site:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; pageSlug: string[] }>;
}): Promise<Metadata> {
  const { slug, pageSlug } = await params;
  const siteData = await getSiteData(slug);

  if (!siteData) {
    return {
      title: 'אתר לא נמצא',
    };
  }

  const targetSlug = pageSlug.join('/');
  const page = siteData.snapshot.pages?.find((p) => p.slug === targetSlug);
  const seo = page?.seo as Record<string, string> | undefined;

  return {
    title: seo?.title || page?.title || siteData.site?.name || 'אתר',
    description: seo?.description || '',
    openGraph: {
      title: seo?.title || page?.title || siteData.site?.name,
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
  const siteData = await getSiteData(slug);

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
