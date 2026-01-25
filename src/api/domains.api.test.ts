import { describe, it, expect, vi, beforeEach } from 'vitest';
import { domainsApi } from './domains.api';

// Create mock functions
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockSingle = vi.fn();
const mockMaybeSingle = vi.fn();
const mockFunctionsInvoke = vi.fn();

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
                  data: { id: 'new-domain-id', ...data },
                  error: null,
                });
              },
            }),
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
    functions: {
      invoke: (name: string, options: unknown) => {
        mockFunctionsInvoke(name, options);
        return Promise.resolve({
          data: { id: 'domain-1', status: 'verified' },
          error: null,
        });
      },
    },
  },
}));

describe('domainsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getBySiteId', () => {
    it('should fetch all domains for a site', async () => {
      const siteId = 'site-1';
      await domainsApi.getBySiteId(siteId);

      expect(mockFrom).toHaveBeenCalledWith('domains');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('site_id', siteId);
      expect(mockOrder).toHaveBeenCalledWith('created_at');
    });

    it('should return empty array when no domains exist', async () => {
      const result = await domainsApi.getBySiteId('site-1');
      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should fetch a domain by ID', async () => {
      const domainId = 'domain-1';
      await domainsApi.getById(domainId);

      expect(mockFrom).toHaveBeenCalledWith('domains');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', domainId);
      expect(mockMaybeSingle).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new domain with pending status', async () => {
      const domainData = {
        domain: 'example.com',
        site_id: 'site-1',
        tenant_id: 'tenant-1',
      };

      const result = await domainsApi.create(domainData);

      expect(mockFrom).toHaveBeenCalledWith('domains');
      expect(mockInsert).toHaveBeenCalledWith({
        ...domainData,
        status: 'pending',
      });
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('status', 'pending');
    });
  });

  describe('delete', () => {
    it('should delete a domain', async () => {
      const domainId = 'domain-1';

      await domainsApi.delete(domainId);

      expect(mockFrom).toHaveBeenCalledWith('domains');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', domainId);
    });
  });

  describe('verify', () => {
    it('should call edge function to verify domain', async () => {
      const domainId = 'domain-1';

      const result = await domainsApi.verify(domainId);

      expect(mockFunctionsInvoke).toHaveBeenCalledWith('verify-domain', {
        body: { domainId },
      });
      expect(result).toHaveProperty('status', 'verified');
    });
  });

  describe('isAvailable', () => {
    it('should return true when domain is available', async () => {
      const domain = 'available.com';

      const result = await domainsApi.isAvailable(domain);

      expect(mockFrom).toHaveBeenCalledWith('domains');
      expect(mockSelect).toHaveBeenCalledWith('id');
      expect(mockEq).toHaveBeenCalledWith('domain', domain);
      expect(mockMaybeSingle).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
