import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
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

  const fetchTenants = async () => {
    if (!user) {
      setTenants([]);
      setCurrentTenant(null);
      setLoading(false);
      return;
    }

    try {
      // Get tenant memberships
      const { data: memberships, error: memberError } = await supabase
        .from('tenant_members')
        .select('tenant_id, role')
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      if (!memberships || memberships.length === 0) {
        setTenants([]);
        setCurrentTenant(null);
        setLoading(false);
        return;
      }

      // Get tenant details
      const tenantIds = memberships.map(m => m.tenant_id);
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .in('id', tenantIds);

      if (tenantError) throw tenantError;

      // Combine tenant data with roles
      const tenantsWithRoles: TenantWithRole[] = (tenantData || []).map(tenant => {
        const membership = memberships.find(m => m.tenant_id === tenant.id);
        return {
          ...tenant,
          role: membership?.role || 'viewer',
        };
      });

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
  };

  useEffect(() => {
    fetchTenants();
  }, [user]);

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
