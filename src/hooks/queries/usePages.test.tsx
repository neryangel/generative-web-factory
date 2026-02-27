import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Mock the API - inline data to avoid hoisting issues
vi.mock('@/api/pages.api', () => ({
  pagesApi: {
    getBySiteId: vi.fn().mockResolvedValue([
      { id: 'page-1', title: 'Home', slug: 'home', site_id: 'site-1', is_homepage: true, sort_order: 0 },
      { id: 'page-2', title: 'About', slug: 'about', site_id: 'site-1', is_homepage: false, sort_order: 1 },
    ]),
    getById: vi.fn().mockResolvedValue({ id: 'page-1', title: 'Home', slug: 'home', site_id: 'site-1', is_homepage: true }),
    getHomepage: vi.fn().mockResolvedValue({ id: 'page-1', title: 'Home', slug: 'home', site_id: 'site-1', is_homepage: true }),
    create: vi.fn().mockResolvedValue({ id: 'new-page', title: 'New Page', site_id: 'site-1' }),
    update: vi.fn().mockResolvedValue({ id: 'page-1', title: 'Updated Page', site_id: 'site-1' }),
    delete: vi.fn().mockResolvedValue(undefined),
    updateOrder: vi.fn().mockResolvedValue(undefined),
  },
}));

import {
  usePages,
  usePage,
  useHomepage,
  useCreatePage,
  useUpdatePage,
  useDeletePage,
  useReorderPages,
  PAGES_QUERY_KEY,
} from './usePages';

describe('usePages hooks', () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: Infinity },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  describe('usePages', () => {
    it('should fetch all pages for a site', async () => {
      const { result } = renderHook(() => usePages('site-1', 'tenant-1'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(2);
    });

    it('should not fetch if siteId is undefined', async () => {
      const { pagesApi } = await import('@/api/pages.api');
      const { result } = renderHook(() => usePages(undefined, 'tenant-1'), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(pagesApi.getBySiteId).not.toHaveBeenCalled();
    });
  });

  describe('usePage', () => {
    it('should fetch a single page by ID', async () => {
      const { result } = renderHook(() => usePage('page-1', 'tenant-1'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.id).toBe('page-1');
    });

    it('should not fetch if pageId is undefined', async () => {
      const { pagesApi } = await import('@/api/pages.api');
      const { result } = renderHook(() => usePage(undefined, 'tenant-1'), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(pagesApi.getById).not.toHaveBeenCalled();
    });
  });

  describe('useHomepage', () => {
    it('should fetch homepage for a site', async () => {
      const { result } = renderHook(() => useHomepage('site-1', 'tenant-1'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.is_homepage).toBe(true);
    });

    it('should not fetch if siteId is undefined', async () => {
      const { pagesApi } = await import('@/api/pages.api');
      const { result } = renderHook(() => useHomepage(undefined, 'tenant-1'), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(pagesApi.getHomepage).not.toHaveBeenCalled();
    });
  });

  describe('useCreatePage', () => {
    it('should create a new page', async () => {
      const { result } = renderHook(() => useCreatePage(), { wrapper });

      await result.current.mutateAsync({
        site_id: 'site-1',
        tenant_id: 'tenant-1',
        title: 'New Page',
        slug: 'new-page',
      });

      const { pagesApi } = await import('@/api/pages.api');
      expect(pagesApi.create).toHaveBeenCalled();
    });
  });

  describe('useUpdatePage', () => {
    it('should update a page', async () => {
      const { result } = renderHook(() => useUpdatePage(), { wrapper });

      await result.current.mutateAsync({
        pageId: 'page-1',
        tenantId: 'tenant-1',
        updates: { title: 'Updated Page' },
      });

      const { pagesApi } = await import('@/api/pages.api');
      expect(pagesApi.update).toHaveBeenCalledWith('page-1', 'tenant-1', { title: 'Updated Page' });
    });
  });

  describe('useDeletePage', () => {
    it('should delete a page', async () => {
      const { result } = renderHook(() => useDeletePage(), { wrapper });

      await result.current.mutateAsync({ pageId: 'page-1', tenantId: 'tenant-1' });

      const { pagesApi } = await import('@/api/pages.api');
      expect(pagesApi.delete).toHaveBeenCalledWith('page-1', 'tenant-1');
    });
  });

  describe('useReorderPages', () => {
    it('should reorder pages', async () => {
      const { result } = renderHook(() => useReorderPages(), { wrapper });

      const newOrder = [
        { id: 'page-2', sort_order: 0 },
        { id: 'page-1', sort_order: 1 },
      ];

      await result.current.mutateAsync(newOrder);

      const { pagesApi } = await import('@/api/pages.api');
      expect(pagesApi.updateOrder).toHaveBeenCalledWith(newOrder);
    });
  });
});
