import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SectionRenderer } from '@/components/editor/SectionRenderer';
import { Loader2 } from 'lucide-react';

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

interface PublishedSnapshot {
  pages: PublishedPage[];
  settings?: Record<string, unknown>;
}

interface SiteData {
  site: {
    name: string;
    settings: Record<string, unknown>;
  };
  snapshot: PublishedSnapshot;
  version: number;
  publishedAt: string;
}

export default function PublicSite() {
  const { slug, pageSlug } = useParams<{ slug: string; pageSlug?: string }>();
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSite() {
      if (!slug) {
        setError('אתר לא נמצא');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-published-site?slug=${encodeURIComponent(slug)}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'שגיאה בטעינת האתר');
        }

        setSiteData(data);

        // Update document title
        if (data.site?.name) {
          document.title = data.site.name;
        }
      } catch (err: any) {
        console.error('Error fetching site:', err);
        setError(err.message || 'שגיאה בטעינת האתר');
      } finally {
        setLoading(false);
      }
    }

    fetchSite();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-8" dir="rtl">
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          {error || 'האתר לא נמצא'}
        </p>
        <a 
          href="/" 
          className="text-primary hover:underline"
        >
          חזרה לדף הבית
        </a>
      </div>
    );
  }

  // Find the current page
  const currentPageSlug = pageSlug || 'home';
  const currentPage = siteData.snapshot.pages?.find(
    (p) => p.slug === currentPageSlug || (currentPageSlug === 'home' && p.is_homepage)
  );

  if (!currentPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-8" dir="rtl">
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          העמוד לא נמצא
        </p>
        <a 
          href={`/s/${slug}`} 
          className="text-primary hover:underline"
        >
          חזרה לדף הבית
        </a>
      </div>
    );
  }

  // Sort sections by sort_order
  const sortedSections = [...(currentPage.sections || [])].sort(
    (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
  );

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* SEO Meta */}
      {currentPage.seo && (
        <>
          {/* Would normally use react-helmet here */}
        </>
      )}

      {/* Render all sections */}
      <main>
        {sortedSections.map((section) => (
          <SectionRenderer
            key={section.id}
            id={section.id}
            type={section.type}
            variant={section.variant || 'default'}
            content={section.content}
            settings={section.settings || {}}
            isEditing={false}
          />
        ))}
      </main>

      {/* Empty state */}
      {sortedSections.length === 0 && (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">אין תוכן להצגה</p>
        </div>
      )}
    </div>
  );
}
