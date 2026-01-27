/**
 * Shared types for published site data.
 * Used by server-side rendering pages and the client-side SiteRenderer.
 */

export interface PublishedSection {
  id: string;
  type: string;
  variant: string;
  content: Record<string, unknown>;
  settings: Record<string, unknown>;
  sort_order: number;
}

export interface PublishedPage {
  id: string;
  slug: string;
  title: string;
  is_homepage: boolean;
  seo: Record<string, unknown>;
  sections: PublishedSection[];
}

export interface PublishedSiteData {
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
