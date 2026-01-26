/**
 * Centralized query key factory
 * Prevents cache collisions and provides type-safe query keys
 *
 * Pattern: ['domain', 'scope', ...identifiers]
 * - domain: The data domain (sites, pages, sections, etc.)
 * - scope: The query type (list, detail, slug, etc.)
 * - identifiers: Specific IDs or parameters
 */

export const queryKeys = {
  // Sites
  sites: {
    all: ['sites'] as const,
    lists: () => [...queryKeys.sites.all, 'list'] as const,
    list: (tenantId: string) => [...queryKeys.sites.lists(), tenantId] as const,
    details: () => [...queryKeys.sites.all, 'detail'] as const,
    detail: (siteId: string) => [...queryKeys.sites.details(), siteId] as const,
    bySlug: (slug: string) => [...queryKeys.sites.all, 'slug', slug] as const,
  },

  // Pages
  pages: {
    all: ['pages'] as const,
    lists: () => [...queryKeys.pages.all, 'list'] as const,
    list: (siteId: string) => [...queryKeys.pages.lists(), siteId] as const,
    details: () => [...queryKeys.pages.all, 'detail'] as const,
    detail: (pageId: string) => [...queryKeys.pages.details(), pageId] as const,
    bySlug: (siteId: string, slug: string) =>
      [...queryKeys.pages.all, 'slug', siteId, slug] as const,
  },

  // Sections
  sections: {
    all: ['sections'] as const,
    lists: () => [...queryKeys.sections.all, 'list'] as const,
    list: (pageId: string) => [...queryKeys.sections.lists(), pageId] as const,
    details: () => [...queryKeys.sections.all, 'detail'] as const,
    detail: (sectionId: string) => [...queryKeys.sections.details(), sectionId] as const,
  },

  // Templates
  templates: {
    all: ['templates'] as const,
    lists: () => [...queryKeys.templates.all, 'list'] as const,
    list: (category?: string) =>
      category
        ? ([...queryKeys.templates.lists(), category] as const)
        : queryKeys.templates.lists(),
    details: () => [...queryKeys.templates.all, 'detail'] as const,
    detail: (templateId: string) => [...queryKeys.templates.details(), templateId] as const,
    bySlug: (slug: string) => [...queryKeys.templates.all, 'slug', slug] as const,
  },

  // Tenants
  tenants: {
    all: ['tenants'] as const,
    lists: () => [...queryKeys.tenants.all, 'list'] as const,
    list: (userId: string) => [...queryKeys.tenants.lists(), userId] as const,
    details: () => [...queryKeys.tenants.all, 'detail'] as const,
    detail: (tenantId: string) => [...queryKeys.tenants.details(), tenantId] as const,
  },

  // Domains
  domains: {
    all: ['domains'] as const,
    lists: () => [...queryKeys.domains.all, 'list'] as const,
    list: (siteId: string) => [...queryKeys.domains.lists(), siteId] as const,
    details: () => [...queryKeys.domains.all, 'detail'] as const,
    detail: (domainId: string) => [...queryKeys.domains.details(), domainId] as const,
    byDomain: (domain: string) => [...queryKeys.domains.all, 'domain', domain] as const,
  },

  // Assets
  assets: {
    all: ['assets'] as const,
    lists: () => [...queryKeys.assets.all, 'list'] as const,
    list: (tenantId: string, siteId?: string) =>
      siteId
        ? ([...queryKeys.assets.lists(), tenantId, siteId] as const)
        : ([...queryKeys.assets.lists(), tenantId] as const),
    details: () => [...queryKeys.assets.all, 'detail'] as const,
    detail: (assetId: string) => [...queryKeys.assets.details(), assetId] as const,
  },

  // Publishes
  publishes: {
    all: ['publishes'] as const,
    lists: () => [...queryKeys.publishes.all, 'list'] as const,
    list: (siteId: string) => [...queryKeys.publishes.lists(), siteId] as const,
    current: (siteId: string) => [...queryKeys.publishes.all, 'current', siteId] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;
