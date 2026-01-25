import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Mock the API - inline data to avoid hoisting issues
vi.mock('@/api/templates.api', () => ({
  templatesApi: {
    getAll: vi.fn().mockResolvedValue([
      { id: 'template-1', name: 'Business', slug: 'business', category: 'corporate', is_active: true },
      { id: 'template-2', name: 'Portfolio', slug: 'portfolio', category: 'creative', is_active: true },
      { id: 'template-3', name: 'Shop', slug: 'shop', category: 'ecommerce', is_active: true },
    ]),
    getByCategory: vi.fn().mockResolvedValue([
      { id: 'template-1', name: 'Business', slug: 'business', category: 'corporate', is_active: true },
    ]),
    getById: vi.fn().mockResolvedValue({ id: 'template-1', name: 'Business', slug: 'business', category: 'corporate', is_active: true }),
    getBySlug: vi.fn().mockResolvedValue({ id: 'template-1', name: 'Business', slug: 'business', category: 'corporate', is_active: true }),
    getCategories: vi.fn().mockResolvedValue(['corporate', 'creative', 'ecommerce']),
  },
}));

import {
  useTemplates,
  useTemplatesByCategory,
  useTemplate,
  useTemplateBySlug,
  useTemplateCategories,
  TEMPLATES_QUERY_KEY,
} from './useTemplates';

describe('useTemplates hooks', () => {
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

  describe('useTemplates', () => {
    it('should fetch all active templates', async () => {
      const { result } = renderHook(() => useTemplates(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(3);
    });
  });

  describe('useTemplatesByCategory', () => {
    it('should fetch templates by category', async () => {
      const { result } = renderHook(() => useTemplatesByCategory('corporate'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const { templatesApi } = await import('@/api/templates.api');
      expect(templatesApi.getByCategory).toHaveBeenCalledWith('corporate');
      expect(result.current.data).toHaveLength(1);
    });

    it('should not fetch if category is undefined', async () => {
      const { templatesApi } = await import('@/api/templates.api');
      const { result } = renderHook(() => useTemplatesByCategory(undefined), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(templatesApi.getByCategory).not.toHaveBeenCalled();
    });
  });

  describe('useTemplate', () => {
    it('should fetch a single template by ID', async () => {
      const { result } = renderHook(() => useTemplate('template-1'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const { templatesApi } = await import('@/api/templates.api');
      expect(templatesApi.getById).toHaveBeenCalledWith('template-1');
      expect(result.current.data?.id).toBe('template-1');
    });

    it('should not fetch if templateId is undefined', async () => {
      const { templatesApi } = await import('@/api/templates.api');
      const { result } = renderHook(() => useTemplate(undefined), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(templatesApi.getById).not.toHaveBeenCalled();
    });
  });

  describe('useTemplateBySlug', () => {
    it('should fetch a template by slug', async () => {
      const { result } = renderHook(() => useTemplateBySlug('business'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const { templatesApi } = await import('@/api/templates.api');
      expect(templatesApi.getBySlug).toHaveBeenCalledWith('business');
      expect(result.current.data?.slug).toBe('business');
    });

    it('should not fetch if slug is undefined', async () => {
      const { templatesApi } = await import('@/api/templates.api');
      const { result } = renderHook(() => useTemplateBySlug(undefined), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(templatesApi.getBySlug).not.toHaveBeenCalled();
    });
  });

  describe('useTemplateCategories', () => {
    it('should fetch all unique categories', async () => {
      const { result } = renderHook(() => useTemplateCategories(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const { templatesApi } = await import('@/api/templates.api');
      expect(templatesApi.getCategories).toHaveBeenCalled();
      expect(result.current.data).toEqual(['corporate', 'creative', 'ecommerce']);
    });
  });
});
