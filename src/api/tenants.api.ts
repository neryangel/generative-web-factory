import { supabase } from '@/integrations/supabase/client';
import { parseSupabaseError } from '@/lib/api-error';
import { tenantInsertSchema, uuidSchema } from '@/types/schemas';
import type { Tables } from '@/integrations/supabase/types';

type Tenant = Tables<'tenants'>;
type TenantMember = Tables<'tenant_members'>;

export interface TenantWithRole extends Tenant {
  role: TenantMember['role'];
}

/**
 * Tenants API layer with runtime validation
 * Provides consistent data fetching for tenant operations
 */
export const tenantsApi = {
  /**
   * Get all tenants for a user with their roles
   */
  async getAllForUser(userId: string): Promise<TenantWithRole[]> {
    // Validate input
    const validUserId = uuidSchema.parse(userId);

    // Get tenant memberships
    const { data: memberships, error: memberError } = await supabase
      .from('tenant_members')
      .select('tenant_id, role')
      .eq('user_id', validUserId);

    if (memberError) throw parseSupabaseError(memberError);

    if (!memberships || memberships.length === 0) {
      return [];
    }

    // Get tenant details
    const tenantIds = memberships.map(m => m.tenant_id);
    const { data: tenantData, error: tenantError } = await supabase
      .from('tenants')
      .select('*')
      .in('id', tenantIds);

    if (tenantError) throw parseSupabaseError(tenantError);

    // Combine tenant data with roles
    return (tenantData || []).map(tenant => {
      const membership = memberships.find(m => m.tenant_id === tenant.id);
      return {
        ...tenant,
        role: membership?.role || 'viewer',
      };
    });
  },

  /**
   * Get a tenant by ID
   */
  async getById(tenantId: string): Promise<Tenant | null> {
    const validTenantId = uuidSchema.parse(tenantId);

    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', validTenantId)
      .maybeSingle();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Create a new tenant
   * The user creating it will automatically become the owner via database trigger
   */
  async create(input: { name: string; slug: string }): Promise<Tenant> {
    // Validate input with Zod
    const validatedInput = tenantInsertSchema.parse(input);

    const { data, error } = await supabase
      .from('tenants')
      .insert(validatedInput)
      .select()
      .single();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Update a tenant
   */
  async update(tenantId: string, updates: Partial<Tenant>): Promise<Tenant> {
    const validTenantId = uuidSchema.parse(tenantId);

    const { data, error } = await supabase
      .from('tenants')
      .update(updates)
      .eq('id', validTenantId)
      .select()
      .single();

    if (error) throw parseSupabaseError(error);
    return data;
  },
};
