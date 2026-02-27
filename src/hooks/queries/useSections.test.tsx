import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Mock the API - inline data to avoid hoisting issues
vi.mock('@/api/sections.api', () => ({
  sectionsApi: {
    getByPageId: vi.fn().mockResolvedValue([
      { id: 'section-1', type: 'hero', page_id: 'page-1', sort_order: 0, content: { title: 'Hero' } },
      { id: 'section-2', type: 'features', page_id: 'page-1', sort_order: 1, content: { items: [] } },
    ]),
    getById: vi.fn().mockResolvedValue({ id: 'section-1', type: 'hero', page_id: 'page-1', sort_order: 0, content: { title: 'Hero' } }),
    create: vi.fn().mockResolvedValue({ id: 'new-section', type: 'hero', page_id: 'page-1' }),
    update: vi.fn().mockResolvedValue({ id: 'section-1', type: 'hero', page_id: 'page-1' }),
    updateContent: vi.fn().mockResolvedValue({ id: 'section-1', page_id: 'page-1', content: { title: 'Updated' } }),
    delete: vi.fn().mockResolvedValue(undefined),
    updateOrder: vi.fn().mockResolvedValue(undefined),
    duplicate: vi.fn().mockResolvedValue({ id: 'dup-section', type: 'hero', page_id: 'page-1' }),
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
  useSections,
  useSection,
  useCreateSection,
  useUpdateSection,
  useUpdateSectionContent,
  useDeleteSection,
  useReorderSections,
  useDuplicateSection,
  SECTIONS_QUERY_KEY,
} from './useSections';

describe('useSections hooks', () => {
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

  describe('useSections', () => {
    it('should fetch all sections for a page', async () => {
      const { result } = renderHook(() => useSections('page-1', 'tenant-1'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(2);
    });

    it('should not fetch if pageId is undefined', async () => {
      const { sectionsApi } = await import('@/api/sections.api');
      const { result } = renderHook(() => useSections(undefined, 'tenant-1'), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(sectionsApi.getByPageId).not.toHaveBeenCalled();
    });

    it('should not fetch if pageId is null', async () => {
      const { sectionsApi } = await import('@/api/sections.api');
      const { result } = renderHook(() => useSections(null, 'tenant-1'), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(sectionsApi.getByPageId).not.toHaveBeenCalled();
    });
  });

  describe('useSection', () => {
    it('should fetch a single section by ID', async () => {
      const { result } = renderHook(() => useSection('section-1', 'tenant-1'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.id).toBe('section-1');
    });

    it('should not fetch if sectionId is undefined', async () => {
      const { sectionsApi } = await import('@/api/sections.api');
      const { result } = renderHook(() => useSection(undefined, 'tenant-1'), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(sectionsApi.getById).not.toHaveBeenCalled();
    });
  });

  describe('useCreateSection', () => {
    it('should create a new section', async () => {
      const { result } = renderHook(() => useCreateSection(), { wrapper });

      await result.current.mutateAsync({
        page_id: 'page-1',
        tenant_id: 'tenant-1',
        type: 'hero',
        content: { title: 'New Hero' },
      });

      const { sectionsApi } = await import('@/api/sections.api');
      expect(sectionsApi.create).toHaveBeenCalled();
    });
  });

  describe('useUpdateSection', () => {
    it('should update a section', async () => {
      const { result } = renderHook(() => useUpdateSection(), { wrapper });

      await result.current.mutateAsync({
        sectionId: 'section-1',
        tenantId: 'tenant-1',
        updates: { variant: 'centered' },
      });

      const { sectionsApi } = await import('@/api/sections.api');
      expect(sectionsApi.update).toHaveBeenCalledWith('section-1', 'tenant-1', { variant: 'centered' });
    });
  });

  describe('useUpdateSectionContent', () => {
    it('should update section content', async () => {
      const { result } = renderHook(() => useUpdateSectionContent(), { wrapper });

      const newContent = { title: 'Updated Title', subtitle: 'New subtitle' };

      await result.current.mutateAsync({
        sectionId: 'section-1',
        tenantId: 'tenant-1',
        content: newContent,
      });

      const { sectionsApi } = await import('@/api/sections.api');
      expect(sectionsApi.updateContent).toHaveBeenCalledWith('section-1', 'tenant-1', newContent);
    });
  });

  describe('useDeleteSection', () => {
    it('should delete a section', async () => {
      const { result } = renderHook(() => useDeleteSection(), { wrapper });

      await result.current.mutateAsync({ sectionId: 'section-1', tenantId: 'tenant-1' });

      const { sectionsApi } = await import('@/api/sections.api');
      expect(sectionsApi.delete).toHaveBeenCalledWith('section-1', 'tenant-1');
    });
  });

  describe('useReorderSections', () => {
    it('should reorder sections', async () => {
      const { result } = renderHook(() => useReorderSections(), { wrapper });

      const newOrder = [
        { id: 'section-2', sort_order: 0 },
        { id: 'section-1', sort_order: 1 },
      ];

      await result.current.mutateAsync(newOrder);

      const { sectionsApi } = await import('@/api/sections.api');
      expect(sectionsApi.updateOrder).toHaveBeenCalledWith(newOrder);
    });
  });

  describe('useDuplicateSection', () => {
    it('should duplicate a section', async () => {
      const { result } = renderHook(() => useDuplicateSection(), { wrapper });

      await result.current.mutateAsync('section-1');

      const { sectionsApi } = await import('@/api/sections.api');
      expect(sectionsApi.duplicate).toHaveBeenCalledWith('section-1', 'tenant-1');
    });
  });
});
