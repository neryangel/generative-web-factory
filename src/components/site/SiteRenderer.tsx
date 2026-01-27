'use client';

import { useEffect, useMemo } from 'react';
import { SectionRenderer } from '@/components/editor/SectionRenderer';
import type { PublishedSiteData, PublishedPage } from '@/types/published-site';

interface SiteRendererProps {
  siteData: PublishedSiteData;
  currentPage: PublishedPage;
}

export function SiteRenderer({ siteData, currentPage }: SiteRendererProps) {
  // Update favicon if site has custom one
  useEffect(() => {
    try {
      if (siteData.site?.settings?.faviconUrl) {
        const link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
        if (link) {
          link.href = siteData.site.settings.faviconUrl as string;
        }
      }
    } catch {
      // DOM manipulation may fail in edge cases
    }
  }, [siteData]);

  // Memoize sorted sections to avoid re-sorting on every render
  const sortedSections = useMemo(
    () =>
      [...(currentPage.sections || [])].sort(
        (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
      ),
    [currentPage.sections]
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
