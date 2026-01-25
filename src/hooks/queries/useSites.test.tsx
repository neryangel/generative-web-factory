import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Mock the API - inline data to avoid hoisting issues
vi.mock('@/api/sites.api', () => ({
  sitesApi: {
    getAll: vi.fn().mockResolvedValue([
      { id: 'site-1', name: 'Site 1', slug: 'site-1', tenant_id: 'tenant-1' },
      { id: 'site-2', name: 'Site 2', slug: 'site-2', tenant_id: 'tenant-1' },
    ]),
    getById: vi.fn().mockResolvedValue({ id: 'site-1', name: 'Site 1', slug: 'site-1', tenant_id: 'tenant-1' }),
    getBySlug: vi.fn().mockResolvedValue({ id: 'site-1', name: 'Site 1', slug: 'site-1', tenant_id: 'tenant-1' }),
    create: vi.fn().mockResolvedValue({ id: 'new-site', name: 'New Site' }),
    update: vi.fn().mockResolvedValue({ id: 'site-1', name: 'Updated Site' }),
    delete: vi.fn().mockResolvedValue(undefined),
    updateSettings: vi.fn().mockResolvedValue({ id: 'site-1', settings: { theme: 'dark' } }),
    isSlugAvailable: vi.fn().mockResolvedValue(true),
  },
}));

// Mock useTenant hook
vi.mock('@/hooks/useTenant', () => ({
  useTenant: () => ({
    currentTenant: { id: 'tenant-1', name: 'Test Tenant' },
    tenants: [],
    setCurrentTenant: vi.fn(),
    loading: false,
    createTenant: vi.fn(),
    refetchTenants: vi.fn(),
  }),
}));

import {
  useSites,
  useSite,
  useSiteBySlug,
  useCreateSite,
  useUpdateSite,
  useDeleteSite,
  useUpdateSiteSettings,
  useCheckSlugAvailability,
  SITES_QUERY_KEY,
} from './useSites';

describe('useSites hooks', () => {
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

  describe('useSites', () => {
    it('should fetch all sites for current tenant', async () => {
      const { result } = renderHook(() => useSites(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(2);
    });
  });

  describe('useSite', () => {
    it('should fetch a single site by ID', async () => {
      const { result } = renderHook(() => useSite('site-1'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.id).toBe('site-1');
    });

    it('should not fetch if siteId is undefined', async () => {
      const { sitesApi } = await import('@/api/sites.api');
      const { result } = renderHook(() => useSite(undefined), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(sitesApi.getById).not.toHaveBeenCalled();
    });
  });

  describe('useSiteBySlug', () => {
    it('should fetch a site by slug', async () => {
      const { result } = renderHook(() => useSiteBySlug('site-1'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.slug).toBe('site-1');
    });

    it('should not fetch if slug is undefined', async () => {
      const { sitesApi } = await import('@/api/sites.api');
      const { result } = renderHook(() => useSiteBySlug(undefined), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(sitesApi.getBySlug).not.toHaveBeenCalled();
    });
  });

  describe('useCreateSite', () => {
    it('should create a new site', async () => {
      const { result } = renderHook(() => useCreateSite(), { wrapper });

      await result.current.mutateAsync({
        name: 'New Site',
        slug: 'new-site',
        tenant_id: 'tenant-1',
      });

      const { sitesApi } = await import('@/api/sites.api');
      expect(sitesApi.create).toHaveBeenCalled();
    });
  });

  describe('useUpdateSite', () => {
    it('should update a site', async () => {
      const { result } = renderHook(() => useUpdateSite(), { wrapper });

      await result.current.mutateAsync({
        siteId: 'site-1',
        updates: { name: 'Updated Site' },
      });

      const { sitesApi } = await import('@/api/sites.api');
      expect(sitesApi.update).toHaveBeenCalledWith('site-1', { name: 'Updated Site' });
    });
  });

  describe('useDeleteSite', () => {
    it('should delete a site', async () => {
      const { result } = renderHook(() => useDeleteSite(), { wrapper });

      await result.current.mutateAsync('site-1');

      const { sitesApi } = await import('@/api/sites.api');
      expect(sitesApi.delete).toHaveBeenCalledWith('site-1');
    });
  });

  describe('useUpdateSiteSettings', () => {
    it('should update site settings', async () => {
      const { result } = renderHook(() => useUpdateSiteSettings(), { wrapper });

      await result.current.mutateAsync({
        siteId: 'site-1',
        settings: { theme: 'dark' },
      });

      const { sitesApi } = await import('@/api/sites.api');
      expect(sitesApi.updateSettings).toHaveBeenCalledWith('site-1', { theme: 'dark' });
    });
  });

  describe('useCheckSlugAvailability', () => {
    it('should check if slug is available', async () => {
      const { result } = renderHook(() => useCheckSlugAvailability(), { wrapper });

      const isAvailable = await result.current.mutateAsync({ slug: 'new-slug' });

      const { sitesApi } = await import('@/api/sites.api');
      expect(sitesApi.isSlugAvailable).toHaveBeenCalledWith('new-slug', undefined);
      expect(isAvailable).toBe(true);
    });
  });
});
