import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pagesApi } from '@/api/pages.api';
import { queryKeys } from '@/lib/query-keys';
import type { PageInsert, PageUpdate } from '@/types';

/** @deprecated Use queryKeys.pages from '@/lib/query-keys' instead */
export const PAGES_QUERY_KEY = queryKeys.pages.all;

/**
 * Hook to fetch all pages for a site
 */
export function usePages(siteId: string | undefined, tenantId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.pages.list(siteId) ?? ['_disabled'],
    queryFn: () => pagesApi.getBySiteId(siteId!, tenantId!),
    enabled: !!siteId && !!tenantId,
  });
}

/**
 * Hook to fetch a single page
 */
export function usePage(pageId: string | undefined, tenantId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.pages.detail(pageId) ?? ['_disabled'],
    queryFn: () => pagesApi.getById(pageId!, tenantId!),
    enabled: !!pageId && !!tenantId,
  });
}

/**
 * Hook to fetch homepage for a site
 */
export function useHomepage(siteId: string | undefined, tenantId: string | undefined) {
  return useQuery({
    queryKey: [...queryKeys.pages.all, 'homepage', siteId],
    queryFn: () => pagesApi.getHomepage(siteId!, tenantId!),
    enabled: !!siteId && !!tenantId,
  });
}

/**
 * Hook to create a new page
 */
export function useCreatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (page: PageInsert) => pagesApi.create(page),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.pages.list(data.site_id) });
    },
  });
}

/**
 * Hook to update a page
 */
export function useUpdatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pageId, tenantId, updates }: { pageId: string; tenantId: string; updates: PageUpdate }) =>
      pagesApi.update(pageId, tenantId, updates),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.pages.list(data.site_id) });
    },
  });
}

/**
 * Hook to delete a page
 */
export function useDeletePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pageId, tenantId }: { pageId: string; tenantId: string }) =>
      pagesApi.delete(pageId, tenantId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.pages.all });
    },
  });
}

/**
 * Hook to reorder pages
 */
export function useReorderPages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pages: Array<{ id: string; sort_order: number }>) =>
      pagesApi.updateOrder(pages),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.pages.all });
    },
  });
}
