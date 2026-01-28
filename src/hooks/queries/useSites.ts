import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sitesApi } from '@/api/sites.api';
import { useTenant } from '@/hooks/useTenant';
import { DISABLED_QUERY_KEY, queryKeys } from '@/lib/query-keys';
import type { SiteInsert, SiteUpdate } from '@/types';

/**
 * Hook to fetch all sites for a tenant
 * @param tenantId - Optional tenant ID override. If not provided, uses current tenant from context.
 */
export function useSites(tenantId?: string | null) {
  const { currentTenant } = useTenant();
  const effectiveTenantId = tenantId ?? currentTenant?.id;

  return useQuery({
    queryKey: queryKeys.sites.list(effectiveTenantId) ?? DISABLED_QUERY_KEY,
    queryFn: () => {
      if (!effectiveTenantId) throw new Error('No tenant selected');
      return sitesApi.getAll(effectiveTenantId);
    },
    enabled: !!effectiveTenantId,
  });
}

/**
 * Hook to fetch a single site by ID
 */
export function useSite(siteId: string | undefined) {
  const { currentTenant } = useTenant();

  return useQuery({
    queryKey: queryKeys.sites.detail(siteId) ?? DISABLED_QUERY_KEY,
    queryFn: () => {
      if (!currentTenant) throw new Error('No tenant selected');
      if (!siteId) throw new Error('No site ID provided');
      return sitesApi.getById(siteId, currentTenant.id);
    },
    enabled: !!currentTenant && !!siteId,
  });
}

/**
 * Hook to fetch a site by slug
 */
export function useSiteBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.sites.bySlug(slug) ?? DISABLED_QUERY_KEY,
    queryFn: () => {
      if (!slug) throw new Error('No slug provided');
      return sitesApi.getBySlug(slug);
    },
    enabled: !!slug,
  });
}

/**
 * Hook to create a new site
 */
export function useCreateSite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (site: SiteInsert) => sitesApi.create(site),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.sites.all });
    },
  });
}

/**
 * Hook to update a site
 */
export function useUpdateSite() {
  const queryClient = useQueryClient();
  const { currentTenant } = useTenant();

  return useMutation({
    mutationFn: ({ siteId, updates }: { siteId: string; updates: SiteUpdate }) => {
      if (!currentTenant) throw new Error('No tenant selected');
      return sitesApi.update(siteId, currentTenant.id, updates);
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.sites.all });
      const detailKey = queryKeys.sites.detail(data.id);
      if (detailKey) {
        queryClient.setQueryData(detailKey, data);
      }
    },
  });
}

/**
 * Hook to delete a site
 */
export function useDeleteSite() {
  const queryClient = useQueryClient();
  const { currentTenant } = useTenant();

  return useMutation({
    mutationFn: (siteId: string) => {
      if (!currentTenant) throw new Error('No tenant selected');
      return sitesApi.delete(siteId, currentTenant.id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.sites.all });
    },
  });
}

/**
 * Hook to update site settings
 */
export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();
  const { currentTenant } = useTenant();

  return useMutation({
    mutationFn: ({ siteId, settings }: { siteId: string; settings: Record<string, unknown> }) => {
      if (!currentTenant) throw new Error('No tenant selected');
      return sitesApi.updateSettings(siteId, currentTenant.id, settings);
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.sites.all });
      const detailKey = queryKeys.sites.detail(data.id);
      if (detailKey) {
        queryClient.setQueryData(detailKey, data);
      }
    },
  });
}

/**
 * Hook to check if slug is available
 */
export function useCheckSlugAvailability() {
  return useMutation({
    mutationFn: ({ slug, excludeSiteId }: { slug: string; excludeSiteId?: string }) =>
      sitesApi.isSlugAvailable(slug, excludeSiteId),
  });
}
