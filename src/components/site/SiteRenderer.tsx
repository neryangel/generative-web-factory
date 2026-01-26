'use client';

import { useEffect } from 'react';
import { SectionRenderer } from '@/components/editor/SectionRenderer';

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

interface SiteRendererProps {
  siteData: SiteData;
  currentPage: PublishedPage;
}

export function SiteRenderer({ siteData, currentPage }: SiteRendererProps) {
  // Update favicon if site has custom one
  useEffect(() => {
    if (siteData.site?.settings?.faviconUrl) {
      const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
      if (link) {
        link.href = siteData.site.settings.faviconUrl as string;
      }
    }
  }, [siteData]);

  // Sort sections by sort_order
  const sortedSections = [...(currentPage.sections || [])].sort(
    (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
  );

  return (
    <div className="min-h-screen bg-background" dir="rtl">
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
