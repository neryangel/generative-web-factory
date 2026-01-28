import type { ReactNode} from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useCreateTenant, useTenants } from './queries/useTenants';
import { queryKeys } from '@/lib/query-keys';
import type { TenantWithRole } from '@/api/tenants.api';
import type { Tables } from '@/integrations/supabase/types';

type Tenant = Tables<'tenants'>;

interface TenantContextType {
  tenants: TenantWithRole[];
  currentTenant: TenantWithRole | null;
  setCurrentTenant: (tenant: TenantWithRole | null) => void;
  loading: boolean;
  createTenant: (name: string, slug: string) => Promise<{ data: Tenant | null; error: Error | null }>;
  refetchTenants: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

/**
 * TenantProvider with React Query integration
 * Provides tenant state management with automatic caching, refetching, and retry logic
 */
export function TenantProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentTenant, setCurrentTenantState] = useState<TenantWithRole | null>(null);

  // Use React Query for tenant data fetching
  const { data: tenants = [], isLoading, refetch } = useTenants();
  const createTenantMutation = useCreateTenant();

  // Initialize current tenant from localStorage or first available
  useEffect(() => {
    if (tenants.length > 0 && !currentTenant) {
      let savedTenantId: string | null = null;
      try {
        savedTenantId = localStorage.getItem('currentTenantId');
      } catch {
        // localStorage may be unavailable in private browsing
      }
      const savedTenant = savedTenantId ? tenants.find(t => t.id === savedTenantId) : null;
      setCurrentTenantState(savedTenant || tenants[0] || null);
    }
  }, [tenants, currentTenant]);

  // Clear tenant when user logs out
  useEffect(() => {
    if (!user) {
      setCurrentTenantState(null);
    }
  }, [user]);

  // Persist current tenant selection
  const setCurrentTenant = useCallback((tenant: TenantWithRole | null) => {
    setCurrentTenantState(tenant);
    try {
      if (tenant) {
        localStorage.setItem('currentTenantId', tenant.id);
      } else {
        localStorage.removeItem('currentTenantId');
      }
    } catch {
      // localStorage may be unavailable in private browsing
    }
  }, []);

  // Create tenant wrapper that matches the existing interface
  const createTenant = useCallback(async (name: string, slug: string) => {
    try {
      const data = await createTenantMutation.mutateAsync({ name, slug });
      // After creation, refetch to get the updated list with roles
      await refetch();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }, [createTenantMutation, refetch]);

  // Refetch tenants wrapper
  const refetchTenants = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.tenants.all });
  }, [queryClient]);

  return (
    <TenantContext.Provider value={{
      tenants,
      currentTenant,
      setCurrentTenant,
      loading: isLoading,
      createTenant,
      refetchTenants,
    }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
