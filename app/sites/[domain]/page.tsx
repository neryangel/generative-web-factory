import { Metadata } from 'next';
import { SiteRenderer } from '@/components/site/SiteRenderer';

interface PageProps {
  params: Promise<{ domain: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain } = await params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-published-site?domain=${encodeURIComponent(domain)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      return {
        title: 'אתר לא נמצא',
        description: 'האתר המבוקש לא נמצא',
      };
    }

    const data = await response.json();
    const homePage = data.snapshot?.pages?.find((p: any) => p.is_homepage);

    return {
      title: data.site?.name || 'אתר',
      description: homePage?.seo?.description || data.site?.settings?.description || '',
      openGraph: {
        title: data.site?.name,
        description: homePage?.seo?.description || data.site?.settings?.description,
        images: data.site?.settings?.ogImage ? [data.site.settings.ogImage] : [],
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: 'שגיאה',
      description: 'אירעה שגיאה בטעינת האתר',
    };
  }
}

export default async function CustomDomainPage({ params }: PageProps) {
  const { domain } = await params;

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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-8" dir="rtl">
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-8">האתר לא נמצא</p>
      </div>
    );
  }

  const siteData = await response.json();

  // Find homepage
  const homePage = siteData.snapshot?.pages?.find((p: any) => p.is_homepage);

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
