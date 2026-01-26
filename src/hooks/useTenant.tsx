import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Tables } from '@/integrations/supabase/types';

type Tenant = Tables<'tenants'>;
type TenantMember = Tables<'tenant_members'>;

interface TenantWithRole extends Tenant {
  role: TenantMember['role'];
}

interface TenantContextType {
  tenants: TenantWithRole[];
  currentTenant: TenantWithRole | null;
  setCurrentTenant: (tenant: TenantWithRole | null) => void;
  loading: boolean;
  createTenant: (name: string, slug: string) => Promise<{ data: Tenant | null; error: Error | null }>;
  refetchTenants: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<TenantWithRole[]>([]);
  const [currentTenant, setCurrentTenant] = useState<TenantWithRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTenants = useCallback(async () => {
    if (!user) {
      setTenants([]);
      setCurrentTenant(null);
      setLoading(false);
      return;
    }

    try {
      // Single query with join - fixes N+1 pattern
      const { data, error } = await supabase
        .from('tenant_members')
        .select(`
          role,
          tenant:tenants(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      if (!data || data.length === 0) {
        setTenants([]);
        setCurrentTenant(null);
        setLoading(false);
        return;
      }

      // Transform to TenantWithRole format
      const tenantsWithRoles: TenantWithRole[] = data
        .filter((item): item is typeof item & { tenant: Tenant } =>
          item.tenant !== null
        )
        .map((item) => ({
          ...item.tenant,
          role: item.role,
        }));

      setTenants(tenantsWithRoles);

      // Set current tenant from localStorage or first available
      const savedTenantId = localStorage.getItem('currentTenantId');
      const savedTenant = tenantsWithRoles.find(t => t.id === savedTenantId);
      setCurrentTenant(savedTenant || tenantsWithRoles[0] || null);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  useEffect(() => {
    if (currentTenant) {
      localStorage.setItem('currentTenantId', currentTenant.id);
    }
  }, [currentTenant]);

  const createTenant = async (name: string, slug: string) => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .insert({ name, slug })
        .select()
        .single();

      if (error) throw error;

      // Refetch to get the updated list with roles
      await fetchTenants();

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  return (
    <TenantContext.Provider value={{
      tenants,
      currentTenant,
      setCurrentTenant,
      loading,
      createTenant,
      refetchTenants: fetchTenants,
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
