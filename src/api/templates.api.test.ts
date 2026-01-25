import { describe, it, expect, vi, beforeEach } from 'vitest';
import { templatesApi } from './templates.api';

// Create mock functions
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockMaybeSingle = vi.fn();

// Mock template data
const mockTemplates = [
  { id: 'template-1', name: 'Business', category: 'business', is_active: true },
  { id: 'template-2', name: 'Portfolio', category: 'portfolio', is_active: true },
  { id: 'template-3', name: 'E-commerce', category: 'ecommerce', is_active: true },
];

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (table: string) => {
      mockFrom(table);
      return {
        select: (...args: unknown[]) => {
          mockSelect(...args);
          return {
            eq: (...eqArgs: unknown[]) => {
              mockEq(...eqArgs);
              return {
                eq: (...eq2Args: unknown[]) => {
                  mockEq(...eq2Args);
                  return {
                    order: (...orderArgs: unknown[]) => {
                      mockOrder(...orderArgs);
                      return Promise.resolve({ data: [], error: null });
                    },
                  };
                },
                order: (...orderArgs: unknown[]) => {
                  mockOrder(...orderArgs);
                  return Promise.resolve({ data: mockTemplates, error: null });
                },
                maybeSingle: () => {
                  mockMaybeSingle();
                  return Promise.resolve({ data: mockTemplates[0], error: null });
                },
              };
            },
            order: (...orderArgs: unknown[]) => {
              mockOrder(...orderArgs);
              return Promise.resolve({ data: [], error: null });
            },
          };
        },
      };
    },
  },
}));

describe('templatesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all active templates', async () => {
      await templatesApi.getAll();

      expect(mockFrom).toHaveBeenCalledWith('templates');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('is_active', true);
      expect(mockOrder).toHaveBeenCalledWith('category');
    });
  });

  describe('getByCategory', () => {
    it('should fetch templates by category', async () => {
      const category = 'business';
      await templatesApi.getByCategory(category);

      expect(mockFrom).toHaveBeenCalledWith('templates');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('is_active', true);
      expect(mockEq).toHaveBeenCalledWith('category', category);
      expect(mockOrder).toHaveBeenCalledWith('name');
    });
  });

  describe('getById', () => {
    it('should fetch a template by ID', async () => {
      const templateId = 'template-1';
      const result = await templatesApi.getById(templateId);

      expect(mockFrom).toHaveBeenCalledWith('templates');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', templateId);
      expect(mockMaybeSingle).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
    });
  });

  describe('getBySlug', () => {
    it('should fetch a template by slug', async () => {
      const slug = 'business-template';
      const result = await templatesApi.getBySlug(slug);

      expect(mockFrom).toHaveBeenCalledWith('templates');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('slug', slug);
      expect(mockMaybeSingle).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
    });
  });

  describe('getCategories', () => {
    it('should fetch all unique categories', async () => {
      const result = await templatesApi.getCategories();

      expect(mockFrom).toHaveBeenCalledWith('templates');
      expect(mockSelect).toHaveBeenCalledWith('category');
      expect(mockEq).toHaveBeenCalledWith('is_active', true);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
