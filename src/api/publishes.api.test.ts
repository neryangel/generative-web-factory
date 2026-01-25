import { describe, it, expect, vi, beforeEach } from 'vitest';
import { publishesApi, PublishSnapshot } from './publishes.api';

// Create mock functions
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockLimit = vi.fn();
const mockSingle = vi.fn();
const mockMaybeSingle = vi.fn();

// State for dynamic mock responses
let lastVersionResponse: { version: number } | null = null;
let getByVersionResponse: { version: number; tenant_id: string; snapshot: unknown } | null = null;

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
                      return Promise.resolve({ data: getByVersionResponse, error: null });
                    },
                  };
                },
                order: (...orderArgs: unknown[]) => {
                  mockOrder(...orderArgs);
                  return {
                    limit: (num: number) => {
                      mockLimit(num);
                      return {
                        maybeSingle: () => {
                          mockMaybeSingle();
                          return Promise.resolve({ data: lastVersionResponse, error: null });
                        },
                      };
                    },
                  };
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
        insert: (data: unknown) => {
          mockInsert(data);
          return {
            select: () => ({
              single: () => {
                mockSingle();
                return Promise.resolve({
                  data: { id: 'new-publish-id', ...data },
                  error: null,
                });
              },
            }),
          };
        },
        update: (data: unknown) => {
          mockUpdate(data);
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

describe('publishesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    lastVersionResponse = null;
    getByVersionResponse = null;
  });

  describe('getBySiteId', () => {
    it('should fetch all publishes for a site', async () => {
      const siteId = 'site-1';
      await publishesApi.getBySiteId(siteId);

      expect(mockFrom).toHaveBeenCalledWith('publishes');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('site_id', siteId);
      expect(mockOrder).toHaveBeenCalledWith('version', { ascending: false });
    });

    it('should return empty array when no publishes exist', async () => {
      const result = await publishesApi.getBySiteId('site-1');
      expect(result).toEqual([]);
    });
  });

  describe('getCurrent', () => {
    it('should fetch current published version', async () => {
      const siteId = 'site-1';
      await publishesApi.getCurrent(siteId);

      expect(mockFrom).toHaveBeenCalledWith('publishes');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('site_id', siteId);
      expect(mockEq).toHaveBeenCalledWith('is_current', true);
      expect(mockMaybeSingle).toHaveBeenCalled();
    });
  });

  describe('getByVersion', () => {
    it('should fetch a publish by version number', async () => {
      const siteId = 'site-1';
      const version = 3;
      await publishesApi.getByVersion(siteId, version);

      expect(mockFrom).toHaveBeenCalledWith('publishes');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('site_id', siteId);
      expect(mockEq).toHaveBeenCalledWith('version', version);
      expect(mockMaybeSingle).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new publish with incremented version', async () => {
      lastVersionResponse = { version: 2 };

      const snapshot: PublishSnapshot = {
        pages: [],
        settings: {},
        published_at: '2024-01-01T00:00:00Z',
      };

      const publishData = {
        site_id: 'site-1',
        tenant_id: 'tenant-1',
        snapshot,
        changelog: 'Initial release',
      };

      const result = await publishesApi.create(publishData);

      expect(mockFrom).toHaveBeenCalledWith('publishes');
      // Should reset is_current on previous publishes
      expect(mockUpdate).toHaveBeenCalledWith({ is_current: false });
      // Should insert with new version
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          version: 3, // Previous was 2, new should be 3
          is_current: true,
        })
      );
      expect(result).toHaveProperty('id');
    });

    it('should start at version 1 if no previous publishes', async () => {
      lastVersionResponse = null;

      const snapshot: PublishSnapshot = {
        pages: [],
        settings: {},
        published_at: '2024-01-01T00:00:00Z',
      };

      const publishData = {
        site_id: 'site-1',
        tenant_id: 'tenant-1',
        snapshot,
      };

      await publishesApi.create(publishData);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          version: 1,
          is_current: true,
        })
      );
    });
  });

  describe('rollback', () => {
    it('should rollback to a previous version', async () => {
      getByVersionResponse = {
        version: 1,
        tenant_id: 'tenant-1',
        snapshot: { pages: [], settings: {} },
      };
      lastVersionResponse = { version: 3, tenant_id: 'tenant-1' } as any;

      const siteId = 'site-1';
      const targetVersion = 1;

      const result = await publishesApi.rollback(siteId, targetVersion);

      expect(mockFrom).toHaveBeenCalledWith('publishes');
      // Should reset is_current on all publishes
      expect(mockUpdate).toHaveBeenCalledWith({ is_current: false });
      // Should create new publish with old snapshot
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          site_id: siteId,
          changelog: `Rollback to version ${targetVersion}`,
          is_current: true,
          version: 4, // Current version + 1
        })
      );
      expect(result).toHaveProperty('id');
    });

    it('should throw error if version not found', async () => {
      getByVersionResponse = null;

      await expect(publishesApi.rollback('site-1', 999)).rejects.toThrow('Version not found');
    });
  });

  describe('getLatestVersion', () => {
    it('should return latest version number', async () => {
      lastVersionResponse = { version: 5 };

      const result = await publishesApi.getLatestVersion('site-1');

      expect(mockFrom).toHaveBeenCalledWith('publishes');
      expect(mockSelect).toHaveBeenCalledWith('version');
      expect(mockOrder).toHaveBeenCalledWith('version', { ascending: false });
      expect(mockLimit).toHaveBeenCalledWith(1);
      expect(result).toBe(5);
    });

    it('should return 0 if no publishes exist', async () => {
      lastVersionResponse = null;

      const result = await publishesApi.getLatestVersion('site-1');

      expect(result).toBe(0);
    });
  });
});
