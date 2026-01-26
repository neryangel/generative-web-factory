/**
 * Navigation utilities for Next.js App Router
 * Provides consistent navigation API across the application
 */

/**
 * Application routes - centralized route definitions
 */
export const routes = {
  home: '/',
  dashboard: '/dashboard',
  sites: '/dashboard/sites',
  newSite: '/dashboard/sites/new',
  siteEditor: (siteId: string) => `/dashboard/sites/${siteId}`,
  settings: '/dashboard/settings',
  publicSite: (slug: string) => `/s/${slug}`,
  publicSitePage: (slug: string, pageSlug: string) => `/s/${slug}/${pageSlug}`,
} as const;

/**
 * Type-safe route builder
 */
export type AppRoutes = typeof routes;
