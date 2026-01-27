import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sitesApi } from '@/api/sites.api';
import { useTenant } from '@/hooks/useTenant';
import { queryKeys } from '@/lib/query-keys';
import type { SiteInsert, SiteUpdate } from '@/types';

/**
 * Hook to fetch all sites for current tenant
 */
export function useSites() {
  const { currentTenant } = useTenant();

  return useQuery({
    queryKey: queryKeys.sites.list(currentTenant?.id ?? ''),
    queryFn: () => sitesApi.getAll(currentTenant!.id),
    enabled: !!currentTenant,
  });
}

/**
 * Hook to fetch a single site by ID
 */
export function useSite(siteId: string | undefined) {
  const { currentTenant } = useTenant();

  return useQuery({
    queryKey: queryKeys.sites.detail(siteId ?? ''),
    queryFn: () => sitesApi.getById(siteId!, currentTenant!.id),
    enabled: !!currentTenant && !!siteId,
  });
}

/**
 * Hook to fetch a site by slug
 */
export function useSiteBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.sites.bySlug(slug ?? ''),
    queryFn: () => sitesApi.getBySlug(slug!),
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
      queryClient.invalidateQueries({ queryKey: queryKeys.sites.all });
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
    mutationFn: ({ siteId, updates }: { siteId: string; updates: SiteUpdate }) =>
      sitesApi.update(siteId, currentTenant!.id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sites.all });
      queryClient.setQueryData(queryKeys.sites.detail(data.id), data);
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
    mutationFn: (siteId: string) => sitesApi.delete(siteId, currentTenant!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sites.all });
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
    mutationFn: ({ siteId, settings }: { siteId: string; settings: Record<string, unknown> }) =>
      sitesApi.updateSettings(siteId, currentTenant!.id, settings),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sites.all });
      queryClient.setQueryData(queryKeys.sites.detail(data.id), data);
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
