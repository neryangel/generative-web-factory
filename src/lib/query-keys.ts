/**
 * Centralized query key factory
 * Prevents cache collisions and provides type-safe query keys
 *
 * Pattern: ['domain', 'scope', ...identifiers]
 * - domain: The data domain (sites, pages, sections, etc.)
 * - scope: The query type (list, detail, slug, etc.)
 * - identifiers: Specific IDs or parameters
 *
 * Note: Functions return empty arrays for null/undefined IDs to prevent
 * cache collisions when identifiers are not yet available. Queries should
 * use `enabled: !!id` to prevent fetching with invalid keys.
 */

type MaybeString = string | null | undefined;

export const queryKeys = {
  // Sites
  sites: {
    all: ['sites'] as const,
    lists: () => [...queryKeys.sites.all, 'list'] as const,
    list: (tenantId: MaybeString) =>
      tenantId ? ([...queryKeys.sites.lists(), tenantId] as const) : ([] as const),
    details: () => [...queryKeys.sites.all, 'detail'] as const,
    detail: (siteId: MaybeString) =>
      siteId ? ([...queryKeys.sites.details(), siteId] as const) : ([] as const),
    bySlug: (slug: MaybeString) =>
      slug ? ([...queryKeys.sites.all, 'slug', slug] as const) : ([] as const),
  },

  // Pages
  pages: {
    all: ['pages'] as const,
    lists: () => [...queryKeys.pages.all, 'list'] as const,
    list: (siteId: MaybeString) =>
      siteId ? ([...queryKeys.pages.lists(), siteId] as const) : ([] as const),
    details: () => [...queryKeys.pages.all, 'detail'] as const,
    detail: (pageId: MaybeString) =>
      pageId ? ([...queryKeys.pages.details(), pageId] as const) : ([] as const),
    bySlug: (siteId: MaybeString, slug: MaybeString) =>
      siteId && slug
        ? ([...queryKeys.pages.all, 'slug', siteId, slug] as const)
        : ([] as const),
  },

  // Sections
  sections: {
    all: ['sections'] as const,
    lists: () => [...queryKeys.sections.all, 'list'] as const,
    list: (pageId: MaybeString) =>
      pageId ? ([...queryKeys.sections.lists(), pageId] as const) : ([] as const),
    details: () => [...queryKeys.sections.all, 'detail'] as const,
    detail: (sectionId: MaybeString) =>
      sectionId ? ([...queryKeys.sections.details(), sectionId] as const) : ([] as const),
  },

  // Templates
  templates: {
    all: ['templates'] as const,
    lists: () => [...queryKeys.templates.all, 'list'] as const,
    list: (category?: MaybeString) =>
      category
        ? ([...queryKeys.templates.lists(), category] as const)
        : queryKeys.templates.lists(),
    details: () => [...queryKeys.templates.all, 'detail'] as const,
    detail: (templateId: MaybeString) =>
      templateId ? ([...queryKeys.templates.details(), templateId] as const) : ([] as const),
    bySlug: (slug: MaybeString) =>
      slug ? ([...queryKeys.templates.all, 'slug', slug] as const) : ([] as const),
  },

  // Tenants
  tenants: {
    all: ['tenants'] as const,
    lists: () => [...queryKeys.tenants.all, 'list'] as const,
    list: (userId: MaybeString) =>
      userId ? ([...queryKeys.tenants.lists(), userId] as const) : ([] as const),
    details: () => [...queryKeys.tenants.all, 'detail'] as const,
    detail: (tenantId: MaybeString) =>
      tenantId ? ([...queryKeys.tenants.details(), tenantId] as const) : ([] as const),
  },

  // Domains
  domains: {
    all: ['domains'] as const,
    lists: () => [...queryKeys.domains.all, 'list'] as const,
    list: (siteId: MaybeString) =>
      siteId ? ([...queryKeys.domains.lists(), siteId] as const) : ([] as const),
    details: () => [...queryKeys.domains.all, 'detail'] as const,
    detail: (domainId: MaybeString) =>
      domainId ? ([...queryKeys.domains.details(), domainId] as const) : ([] as const),
    byDomain: (domain: MaybeString) =>
      domain ? ([...queryKeys.domains.all, 'domain', domain] as const) : ([] as const),
  },

  // Assets
  assets: {
    all: ['assets'] as const,
    lists: () => [...queryKeys.assets.all, 'list'] as const,
    list: (tenantId: MaybeString, siteId?: MaybeString) =>
      tenantId
        ? siteId
          ? ([...queryKeys.assets.lists(), tenantId, siteId] as const)
          : ([...queryKeys.assets.lists(), tenantId] as const)
        : ([] as const),
    details: () => [...queryKeys.assets.all, 'detail'] as const,
    detail: (assetId: MaybeString) =>
      assetId ? ([...queryKeys.assets.details(), assetId] as const) : ([] as const),
  },

  // Publishes
  publishes: {
    all: ['publishes'] as const,
    lists: () => [...queryKeys.publishes.all, 'list'] as const,
    list: (siteId: MaybeString) =>
      siteId ? ([...queryKeys.publishes.lists(), siteId] as const) : ([] as const),
    current: (siteId: MaybeString) =>
      siteId ? ([...queryKeys.publishes.all, 'current', siteId] as const) : ([] as const),
  },
} as const;

export type QueryKeys = typeof queryKeys;
