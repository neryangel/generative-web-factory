import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pagesApi } from '@/api/pages.api';
import type { Page, PageInsert, PageUpdate } from '@/types';

export const PAGES_QUERY_KEY = ['pages'];

/**
 * Hook to fetch all pages for a site
 */
export function usePages(siteId: string | undefined) {
  return useQuery({
    queryKey: [...PAGES_QUERY_KEY, siteId],
    queryFn: () => pagesApi.getBySiteId(siteId!),
    enabled: !!siteId,
  });
}

/**
 * Hook to fetch a single page
 */
export function usePage(pageId: string | undefined) {
  return useQuery({
    queryKey: [...PAGES_QUERY_KEY, 'detail', pageId],
    queryFn: () => pagesApi.getById(pageId!),
    enabled: !!pageId,
  });
}

/**
 * Hook to fetch homepage for a site
 */
export function useHomepage(siteId: string | undefined) {
  return useQuery({
    queryKey: [...PAGES_QUERY_KEY, 'homepage', siteId],
    queryFn: () => pagesApi.getHomepage(siteId!),
    enabled: !!siteId,
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
      queryClient.invalidateQueries({ queryKey: [...PAGES_QUERY_KEY, data.site_id] });
    },
  });
}

/**
 * Hook to update a page
 */
export function useUpdatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pageId, updates }: { pageId: string; updates: PageUpdate }) =>
      pagesApi.update(pageId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...PAGES_QUERY_KEY, data.site_id] });
    },
  });
}

/**
 * Hook to delete a page
 */
export function useDeletePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pageId: string) => pagesApi.delete(pageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY });
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
      queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY });
    },
  });
}
