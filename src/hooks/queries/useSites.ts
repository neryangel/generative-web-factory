import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sitesApi } from '@/api/sites.api';
import { useTenant } from '@/hooks/useTenant';
import type { Site, SiteInsert, SiteUpdate } from '@/types';

export const SITES_QUERY_KEY = ['sites'];

/**
 * Hook to fetch all sites for current tenant
 */
export function useSites() {
  const { currentTenant } = useTenant();

  return useQuery({
    queryKey: [...SITES_QUERY_KEY, currentTenant?.id],
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
    queryKey: [...SITES_QUERY_KEY, siteId],
    queryFn: () => sitesApi.getById(siteId!, currentTenant!.id),
    enabled: !!currentTenant && !!siteId,
  });
}

/**
 * Hook to fetch a site by slug
 */
export function useSiteBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: [...SITES_QUERY_KEY, 'slug', slug],
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
      queryClient.invalidateQueries({ queryKey: SITES_QUERY_KEY });
    },
  });
}

/**
 * Hook to update a site
 */
export function useUpdateSite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ siteId, updates }: { siteId: string; updates: SiteUpdate }) =>
      sitesApi.update(siteId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SITES_QUERY_KEY });
      queryClient.setQueryData([...SITES_QUERY_KEY, data.id], data);
    },
  });
}

/**
 * Hook to delete a site
 */
export function useDeleteSite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (siteId: string) => sitesApi.delete(siteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SITES_QUERY_KEY });
    },
  });
}

/**
 * Hook to update site settings
 */
export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ siteId, settings }: { siteId: string; settings: Record<string, unknown> }) =>
      sitesApi.updateSettings(siteId, settings),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SITES_QUERY_KEY });
      queryClient.setQueryData([...SITES_QUERY_KEY, data.id], data);
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
