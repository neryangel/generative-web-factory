import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pagesApi } from './pages.api';

// Create mock functions
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockSingle = vi.fn();
const mockMaybeSingle = vi.fn();

// Track update calls for updateOrder
const updateCalls: Array<{ id: string; sort_order: number }> = [];

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
                    maybeSingle: () => {
                      mockMaybeSingle();
                      return Promise.resolve({ data: null, error: null });
                    },
                  };
                },
                order: (...orderArgs: unknown[]) => {
                  mockOrder(...orderArgs);
                  return Promise.resolve({ data: [], error: null });
                },
                maybeSingle: () => {
                  mockMaybeSingle();
                  return Promise.resolve({ data: null, error: null });
                },
              };
            },
            order: (...orderArgs: unknown[]) => {
              mockOrder(...orderArgs);
              return Promise.resolve({ data: [], error: null });
            },
          };
        },
        insert: (data: Record<string, unknown>) => {
          mockInsert(data);
          return {
            select: () => ({
              single: () => {
                mockSingle();
                return Promise.resolve({
                  data: { id: 'new-page-id', site_id: 'site-1', ...data },
                  error: null,
                });
              },
            }),
          };
        },
        update: (data: { sort_order?: number }) => {
          mockUpdate(data);
          return {
            eq: (...eqArgs: unknown[]) => {
              mockEq(...eqArgs);
              if (data.sort_order !== undefined) {
                updateCalls.push({ id: eqArgs[1] as string, sort_order: data.sort_order });
              }
              return {
                select: () => ({
                  single: () => {
                    mockSingle();
                    return Promise.resolve({
                      data: { id: eqArgs[1], site_id: 'site-1', ...data },
                      error: null,
                    });
                  },
                }),
              };
            },
          };
        },
        delete: () => {
          mockDelete();
          return {
            eq: (...eqArgs: unknown[]) => {
              mockEq(...eqArgs);
              return Promise.resolve({ error: null });
            },
          };
        },
      };
    },
  },
}));

describe('pagesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    updateCalls.length = 0;
  });

  describe('getBySiteId', () => {
    it('should fetch all pages for a site', async () => {
      const siteId = 'site-1';
      await pagesApi.getBySiteId(siteId);

      expect(mockFrom).toHaveBeenCalledWith('pages');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('site_id', siteId);
      expect(mockOrder).toHaveBeenCalledWith('sort_order');
    });

    it('should return empty array when no pages exist', async () => {
      const result = await pagesApi.getBySiteId('site-1');
      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should fetch a page by ID', async () => {
      const pageId = 'page-1';
      await pagesApi.getById(pageId);

      expect(mockFrom).toHaveBeenCalledWith('pages');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', pageId);
      expect(mockMaybeSingle).toHaveBeenCalled();
    });
  });

  describe('getHomepage', () => {
    it('should fetch homepage for a site', async () => {
      const siteId = 'site-1';
      await pagesApi.getHomepage(siteId);

      expect(mockFrom).toHaveBeenCalledWith('pages');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('site_id', siteId);
      expect(mockEq).toHaveBeenCalledWith('is_homepage', true);
      expect(mockMaybeSingle).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new page', async () => {
      const pageData = {
        site_id: 'site-1',
        tenant_id: 'tenant-1',
        title: 'New Page',
        slug: 'new-page',
      };

      const result = await pagesApi.create(pageData);

      expect(mockFrom).toHaveBeenCalledWith('pages');
      expect(mockInsert).toHaveBeenCalledWith(pageData);
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('site_id', 'site-1');
    });
  });

  describe('update', () => {
    it('should update a page', async () => {
      const pageId = 'page-1';
      const updates = { title: 'Updated Page' };

      const result = await pagesApi.update(pageId, updates);

      expect(mockFrom).toHaveBeenCalledWith('pages');
      expect(mockUpdate).toHaveBeenCalledWith(updates);
      expect(mockEq).toHaveBeenCalledWith('id', pageId);
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toHaveProperty('id', pageId);
    });
  });

  describe('delete', () => {
    it('should delete a page', async () => {
      const pageId = 'page-1';

      await pagesApi.delete(pageId);

      expect(mockFrom).toHaveBeenCalledWith('pages');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', pageId);
    });
  });

  describe('updateOrder', () => {
    it('should update page order for multiple pages', async () => {
      const pages = [
        { id: 'page-1', sort_order: 0 },
        { id: 'page-2', sort_order: 1 },
        { id: 'page-3', sort_order: 2 },
      ];

      await pagesApi.updateOrder(pages);

      expect(mockFrom).toHaveBeenCalledWith('pages');
      expect(mockUpdate).toHaveBeenCalledTimes(3);
      expect(updateCalls).toHaveLength(3);
      expect(updateCalls).toContainEqual({ id: 'page-1', sort_order: 0 });
      expect(updateCalls).toContainEqual({ id: 'page-2', sort_order: 1 });
      expect(updateCalls).toContainEqual({ id: 'page-3', sort_order: 2 });
    });

    it('should handle empty array', async () => {
      await pagesApi.updateOrder([]);
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });
});
