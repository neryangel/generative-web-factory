import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sectionsApi } from './sections.api';

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

// Mock section for duplicate testing
const mockSectionForDuplicate = {
  id: 'section-1',
  page_id: 'page-1',
  tenant_id: 'tenant-1',
  type: 'hero',
  variant: 'default',
  content: { title: 'Test' },
  settings: {},
  sort_order: 0,
};

let returnSectionForDuplicate = false;

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
                order: (...orderArgs: unknown[]) => {
                  mockOrder(...orderArgs);
                  return Promise.resolve({ data: [], error: null });
                },
                maybeSingle: () => {
                  mockMaybeSingle();
                  if (returnSectionForDuplicate) {
                    return Promise.resolve({ data: mockSectionForDuplicate, error: null });
                  }
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
        insert: (data: unknown) => {
          mockInsert(data);
          return {
            select: () => ({
              single: () => {
                mockSingle();
                return Promise.resolve({
                  data: { id: 'new-section-id', page_id: 'page-1', ...data },
                  error: null,
                });
              },
            }),
          };
        },
        update: (data: { sort_order?: number; content?: unknown }) => {
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
                      data: { id: eqArgs[1], page_id: 'page-1', ...data },
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

describe('sectionsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    updateCalls.length = 0;
    returnSectionForDuplicate = false;
  });

  describe('getByPageId', () => {
    it('should fetch all sections for a page', async () => {
      const pageId = 'page-1';
      await sectionsApi.getByPageId(pageId);

      expect(mockFrom).toHaveBeenCalledWith('sections');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('page_id', pageId);
      expect(mockOrder).toHaveBeenCalledWith('sort_order');
    });

    it('should return empty array when no sections exist', async () => {
      const result = await sectionsApi.getByPageId('page-1');
      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should fetch a section by ID', async () => {
      const sectionId = 'section-1';
      await sectionsApi.getById(sectionId);

      expect(mockFrom).toHaveBeenCalledWith('sections');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', sectionId);
      expect(mockMaybeSingle).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new section', async () => {
      const sectionData = {
        page_id: 'page-1',
        tenant_id: 'tenant-1',
        type: 'hero',
        content: { title: 'Hello' },
      };

      const result = await sectionsApi.create(sectionData);

      expect(mockFrom).toHaveBeenCalledWith('sections');
      expect(mockInsert).toHaveBeenCalledWith(sectionData);
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('page_id', 'page-1');
    });
  });

  describe('update', () => {
    it('should update a section', async () => {
      const sectionId = 'section-1';
      const updates = { variant: 'centered' };

      const result = await sectionsApi.update(sectionId, updates);

      expect(mockFrom).toHaveBeenCalledWith('sections');
      expect(mockUpdate).toHaveBeenCalledWith(updates);
      expect(mockEq).toHaveBeenCalledWith('id', sectionId);
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toHaveProperty('id', sectionId);
    });
  });

  describe('updateContent', () => {
    it('should update section content', async () => {
      const sectionId = 'section-1';
      const content = { title: 'Updated Title', description: 'New description' };

      const result = await sectionsApi.updateContent(sectionId, content);

      expect(mockFrom).toHaveBeenCalledWith('sections');
      expect(mockUpdate).toHaveBeenCalledWith({ content });
      expect(mockEq).toHaveBeenCalledWith('id', sectionId);
      expect(result).toHaveProperty('content');
    });
  });

  describe('delete', () => {
    it('should delete a section', async () => {
      const sectionId = 'section-1';

      await sectionsApi.delete(sectionId);

      expect(mockFrom).toHaveBeenCalledWith('sections');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', sectionId);
    });
  });

  describe('updateOrder', () => {
    it('should update section order for multiple sections', async () => {
      const sections = [
        { id: 'section-1', sort_order: 0 },
        { id: 'section-2', sort_order: 1 },
        { id: 'section-3', sort_order: 2 },
      ];

      await sectionsApi.updateOrder(sections);

      expect(mockFrom).toHaveBeenCalledWith('sections');
      expect(mockUpdate).toHaveBeenCalledTimes(3);
      expect(updateCalls).toHaveLength(3);
      expect(updateCalls).toContainEqual({ id: 'section-1', sort_order: 0 });
      expect(updateCalls).toContainEqual({ id: 'section-2', sort_order: 1 });
      expect(updateCalls).toContainEqual({ id: 'section-3', sort_order: 2 });
    });

    it('should handle empty array', async () => {
      await sectionsApi.updateOrder([]);
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe('duplicate', () => {
    it('should duplicate a section', async () => {
      returnSectionForDuplicate = true;
      const sectionId = 'section-1';
      const tenantId = 'tenant-1';

      const result = await sectionsApi.duplicate(sectionId, tenantId);

      expect(mockFrom).toHaveBeenCalledWith('sections');
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          page_id: mockSectionForDuplicate.page_id,
          tenant_id: tenantId,
          type: mockSectionForDuplicate.type,
          variant: mockSectionForDuplicate.variant,
          content: mockSectionForDuplicate.content,
          sort_order: mockSectionForDuplicate.sort_order + 1,
        })
      );
      expect(result).toHaveProperty('id');
    });

    it('should throw error if section not found', async () => {
      returnSectionForDuplicate = false;
      const sectionId = 'nonexistent-section';
      const tenantId = 'tenant-1';

      await expect(sectionsApi.duplicate(sectionId, tenantId)).rejects.toThrow('Section not found');
    });
  });
});
