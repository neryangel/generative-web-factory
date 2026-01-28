import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock supabase with inline data to avoid hoisting issues
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn((table: string) => {
      if (table === 'tenant_members') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: [
                { tenant_id: 'tenant-1', role: 'owner' },
                { tenant_id: 'tenant-2', role: 'member' },
              ],
              error: null,
            }),
          }),
        };
      }
      if (table === 'tenants') {
        return {
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({
              data: [
                { id: 'tenant-1', name: 'Tenant 1', slug: 'tenant-1' },
                { id: 'tenant-2', name: 'Tenant 2', slug: 'tenant-2' },
              ],
              error: null,
            }),
          }),
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: 'new-tenant-id', name: 'New', slug: 'new' },
                error: null,
              }),
            }),
          }),
        };
      }
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      };
    }),
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: 'user-1', email: 'test@example.com' } } },
      }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn((callback) => {
        setTimeout(() => callback('SIGNED_IN', { user: { id: 'user-1', email: 'test@example.com' } }), 0);
        return {
          data: { subscription: { unsubscribe: vi.fn() } },
        };
      }),
    },
  },
}));

// Import after mocks
import { TenantProvider, useTenant } from './useTenant';
import { AuthProvider } from './useAuth';

describe('useTenant', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TenantProvider>{children}</TenantProvider>
        </AuthProvider>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('TenantProvider', () => {
    it('should eventually load tenants', async () => {
      const { result } = renderHook(() => useTenant(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      }, { timeout: 3000 });
    });

    it('should provide tenant context values', async () => {
      const { result } = renderHook(() => useTenant(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      }, { timeout: 3000 });

      expect(result.current).toHaveProperty('tenants');
      expect(result.current).toHaveProperty('currentTenant');
      expect(result.current).toHaveProperty('setCurrentTenant');
      expect(result.current).toHaveProperty('createTenant');
      expect(result.current).toHaveProperty('refetchTenants');
    });
  });

  describe('setCurrentTenant', () => {
    it('should be a function', async () => {
      const { result } = renderHook(() => useTenant(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      }, { timeout: 3000 });

      expect(typeof result.current.setCurrentTenant).toBe('function');
    });
  });

  describe('createTenant', () => {
    it('should be a function', async () => {
      const { result } = renderHook(() => useTenant(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      }, { timeout: 3000 });

      expect(typeof result.current.createTenant).toBe('function');
    });
  });

  describe('refetchTenants', () => {
    it('should be a function', async () => {
      const { result } = renderHook(() => useTenant(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      }, { timeout: 3000 });

      expect(typeof result.current.refetchTenants).toBe('function');
    });
  });

  describe('useTenant outside TenantProvider', () => {
    it('should throw error when used outside TenantProvider', () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      const authWrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      );

      expect(() => {
        renderHook(() => useTenant(), { wrapper: authWrapper });
      }).toThrow('useTenant must be used within a TenantProvider');
    });
  });
});
