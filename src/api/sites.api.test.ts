import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sitesApi } from './sites.api';

// Valid UUIDs for testing
const MOCK_TENANT_ID = '11111111-1111-1111-1111-111111111111';
const MOCK_SITE_ID = '22222222-2222-2222-2222-222222222222';
const MOCK_NEW_SITE_ID = '33333333-3333-3333-3333-333333333333';

// Mock supabase client
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();
const mockNeq = vi.fn();
const mockOrder = vi.fn();
const mockSingle = vi.fn();
const mockMaybeSingle = vi.fn();

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
                neq: (...neqArgs: unknown[]) => {
                  mockNeq(...neqArgs);
                  return {
                    maybeSingle: () => {
                      mockMaybeSingle();
                      return Promise.resolve({ data: null, error: null });
                    },
                  };
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
                  data: { id: MOCK_NEW_SITE_ID, ...data },
                  error: null,
                });
              },
            }),
          };
        },
        update: (data: Record<string, unknown>) => {
          mockUpdate(data);
          return {
            eq: (...eqArgs: unknown[]) => {
              mockEq(...eqArgs);
              return {
                eq: (...eq2Args: unknown[]) => {
                  mockEq(...eq2Args);
                  return {
                    select: () => ({
                      single: () => {
                        mockSingle();
                        return Promise.resolve({
                          data: { id: eqArgs[1], ...data },
                          error: null,
                        });
                      },
                    }),
                  };
                },
                select: () => ({
                  single: () => {
                    mockSingle();
                    return Promise.resolve({
                      data: { id: eqArgs[1], ...data },
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
              return {
                eq: (...eq2Args: unknown[]) => {
                  mockEq(...eq2Args);
                  return Promise.resolve({ error: null });
                },
              };
            },
          };
        },
      };
    },
  },
}));

describe('sitesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all sites for a tenant', async () => {
      await sitesApi.getAll(MOCK_TENANT_ID);

      expect(mockFrom).toHaveBeenCalledWith('sites');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('tenant_id', MOCK_TENANT_ID);
      expect(mockOrder).toHaveBeenCalledWith('updated_at', { ascending: false });
    });

    it('should return empty array when no sites exist', async () => {
      const result = await sitesApi.getAll(MOCK_TENANT_ID);
      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should fetch a site by ID', async () => {
      await sitesApi.getById(MOCK_SITE_ID, MOCK_TENANT_ID);

      expect(mockFrom).toHaveBeenCalledWith('sites');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', MOCK_SITE_ID);
      expect(mockEq).toHaveBeenCalledWith('tenant_id', MOCK_TENANT_ID);
      expect(mockMaybeSingle).toHaveBeenCalled();
    });
  });

  describe('getBySlug', () => {
    it('should fetch a site by slug', async () => {
      const slug = 'test-site';
      await sitesApi.getBySlug(slug);

      expect(mockFrom).toHaveBeenCalledWith('sites');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('slug', slug);
      expect(mockMaybeSingle).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new site', async () => {
      const siteData = {
        name: 'New Site',
        slug: 'new-site',
        tenant_id: MOCK_TENANT_ID,
      };

      const result = await sitesApi.create(siteData);

      expect(mockFrom).toHaveBeenCalledWith('sites');
      expect(mockInsert).toHaveBeenCalledWith(siteData);
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
    });
  });

  describe('update', () => {
    it('should update a site with tenant validation', async () => {
      const updates = { name: 'Updated Site' };

      const result = await sitesApi.update(MOCK_SITE_ID, MOCK_TENANT_ID, updates);

      expect(mockFrom).toHaveBeenCalledWith('sites');
      expect(mockUpdate).toHaveBeenCalledWith(updates);
      expect(mockEq).toHaveBeenCalledWith('id', MOCK_SITE_ID);
      expect(mockEq).toHaveBeenCalledWith('tenant_id', MOCK_TENANT_ID);
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toHaveProperty('id', MOCK_SITE_ID);
    });
  });

  describe('delete', () => {
    it('should delete a site with tenant validation', async () => {
      await sitesApi.delete(MOCK_SITE_ID, MOCK_TENANT_ID);

      expect(mockFrom).toHaveBeenCalledWith('sites');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', MOCK_SITE_ID);
      expect(mockEq).toHaveBeenCalledWith('tenant_id', MOCK_TENANT_ID);
    });
  });

  describe('updateSettings', () => {
    it('should update site settings with tenant validation', async () => {
      const settings = { theme: 'dark' };

      const result = await sitesApi.updateSettings(MOCK_SITE_ID, MOCK_TENANT_ID, settings);

      expect(mockFrom).toHaveBeenCalledWith('sites');
      expect(mockUpdate).toHaveBeenCalledWith({ settings });
      expect(mockEq).toHaveBeenCalledWith('id', MOCK_SITE_ID);
      expect(mockEq).toHaveBeenCalledWith('tenant_id', MOCK_TENANT_ID);
      expect(result).toHaveProperty('id', MOCK_SITE_ID);
    });
  });

  describe('isSlugAvailable', () => {
    it('should check if slug is available', async () => {
      const slug = 'test-slug';

      const result = await sitesApi.isSlugAvailable(slug);

      expect(mockFrom).toHaveBeenCalledWith('sites');
      expect(mockSelect).toHaveBeenCalledWith('id');
      expect(mockEq).toHaveBeenCalledWith('slug', slug);
      expect(result).toBe(true);
    });

    it('should exclude a site ID when checking availability', async () => {
      const slug = 'test-slug';

      await sitesApi.isSlugAvailable(slug, MOCK_SITE_ID);

      expect(mockNeq).toHaveBeenCalledWith('id', MOCK_SITE_ID);
    });
  });

  describe('validation', () => {
    it('should reject invalid tenant ID format', async () => {
      await expect(sitesApi.getAll('invalid-id')).rejects.toThrow();
    });

    it('should reject invalid site ID format', async () => {
      await expect(sitesApi.getById('invalid-id', MOCK_TENANT_ID)).rejects.toThrow();
    });

    it('should reject invalid slug format', async () => {
      await expect(sitesApi.getBySlug('Invalid Slug!')).rejects.toThrow();
    });
  });
});
