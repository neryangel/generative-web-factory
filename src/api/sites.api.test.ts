import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sitesApi } from './sites.api';

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
                  data: { id: 'new-site-id', ...data },
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
      const tenantId = 'tenant-1';
      await sitesApi.getAll(tenantId);

      expect(mockFrom).toHaveBeenCalledWith('sites');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('tenant_id', tenantId);
      expect(mockOrder).toHaveBeenCalledWith('updated_at', { ascending: false });
    });

    it('should return empty array when no sites exist', async () => {
      const result = await sitesApi.getAll('tenant-1');
      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should fetch a site by ID', async () => {
      const siteId = 'site-1';
      const tenantId = 'tenant-1';
      await sitesApi.getById(siteId, tenantId);

      expect(mockFrom).toHaveBeenCalledWith('sites');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', siteId);
      expect(mockEq).toHaveBeenCalledWith('tenant_id', tenantId);
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
        tenant_id: 'tenant-1',
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
      const siteId = 'site-1';
      const tenantId = 'tenant-1';
      const updates = { name: 'Updated Site' };

      const result = await sitesApi.update(siteId, tenantId, updates);

      expect(mockFrom).toHaveBeenCalledWith('sites');
      expect(mockUpdate).toHaveBeenCalledWith(updates);
      expect(mockEq).toHaveBeenCalledWith('id', siteId);
      expect(mockEq).toHaveBeenCalledWith('tenant_id', tenantId);
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toHaveProperty('id', siteId);
    });
  });

  describe('delete', () => {
    it('should delete a site with tenant validation', async () => {
      const siteId = 'site-1';
      const tenantId = 'tenant-1';

      await sitesApi.delete(siteId, tenantId);

      expect(mockFrom).toHaveBeenCalledWith('sites');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', siteId);
      expect(mockEq).toHaveBeenCalledWith('tenant_id', tenantId);
    });
  });

  describe('updateSettings', () => {
    it('should update site settings with tenant validation', async () => {
      const siteId = 'site-1';
      const tenantId = 'tenant-1';
      const settings = { theme: 'dark' };

      const result = await sitesApi.updateSettings(siteId, tenantId, settings);

      expect(mockFrom).toHaveBeenCalledWith('sites');
      expect(mockUpdate).toHaveBeenCalledWith({ settings });
      expect(mockEq).toHaveBeenCalledWith('id', siteId);
      expect(mockEq).toHaveBeenCalledWith('tenant_id', tenantId);
      expect(result).toHaveProperty('id', siteId);
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
      const excludeSiteId = 'site-1';

      await sitesApi.isSlugAvailable(slug, excludeSiteId);

      expect(mockNeq).toHaveBeenCalledWith('id', excludeSiteId);
    });
  });
});
