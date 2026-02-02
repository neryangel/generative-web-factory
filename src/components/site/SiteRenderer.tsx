'use client';

import { useEffect, useMemo } from 'react';
import { SectionRenderer } from '@/components/editor/SectionRenderer';
import type { PublishedPage, PublishedSiteData } from '@/types/published-site';

interface SectionStyles {
  backgroundColor?: string;
  textColor?: string;
  paddingY?: 'compact' | 'normal' | 'spacious';
}

const paddingMap: Record<string, string> = {
  compact: '3rem',
  normal: '5rem',
  spacious: '7rem',
};

interface SiteRendererProps {
  siteData: PublishedSiteData;
  currentPage: PublishedPage;
}

export function SiteRenderer({ siteData, currentPage }: SiteRendererProps) {
  // Update favicon if site has custom one
  useEffect(() => {
    try {
      if (siteData.site?.settings?.faviconUrl) {
        const link = document.querySelector("link[rel='icon']");
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

  // Get section styles from site settings
  const allSectionStyles = useMemo(() => {
    const settings = siteData.site?.settings || {};
    return (settings.sectionStyles as Record<string, SectionStyles>) || {};
  }, [siteData.site?.settings]);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Render all sections */}
      <main>
        {sortedSections.map((section) => {
          const styles = allSectionStyles[section.id];
          const wrapperStyle: React.CSSProperties = {
            ...(styles?.backgroundColor ? { backgroundColor: styles.backgroundColor } : {}),
            ...(styles?.textColor ? { color: styles.textColor } : {}),
            ...(styles?.paddingY ? { paddingTop: paddingMap[styles.paddingY], paddingBottom: paddingMap[styles.paddingY] } : {}),
          };
          const hasStyles = Object.keys(wrapperStyle).length > 0;

          return hasStyles ? (
            <div key={section.id} style={wrapperStyle}>
              <SectionRenderer
                id={section.id}
                type={section.type}
                variant={section.variant || 'default'}
                content={section.content}
                settings={section.settings || {}}
                isEditing={false}
              />
            </div>
          ) : (
            <SectionRenderer
              key={section.id}
              id={section.id}
              type={section.type}
              variant={section.variant || 'default'}
              content={section.content}
              settings={section.settings || {}}
              isEditing={false}
            />
          );
        })}
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
