import { supabase } from '@/integrations/supabase/client';
import { parseSupabaseError, ApiError } from '@/lib/api-error';
import { siteInsertSchema, siteUpdateSchema, slugSchema, uuidSchema, siteSettingsSchema } from '@/types/schemas';
import type { Site } from '@/types';
import type { Json } from '@/integrations/supabase/types';

/**
 * Sites API layer with runtime validation
 * All mutations are validated with Zod schemas before being sent to the database
 */
export const sitesApi = {
  /**
   * Get all sites for a tenant
   */
  async getAll(tenantId: string): Promise<Site[]> {
    // Validate input
    const validTenantId = uuidSchema.parse(tenantId);

    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('tenant_id', validTenantId)
      .order('updated_at', { ascending: false });

    if (error) throw parseSupabaseError(error);
    return data || [];
  },

  /**
   * Get a site by ID
   */
  async getById(siteId: string, tenantId: string): Promise<Site | null> {
    // Validate inputs
    const validSiteId = uuidSchema.parse(siteId);
    const validTenantId = uuidSchema.parse(tenantId);

    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', validSiteId)
      .eq('tenant_id', validTenantId)
      .maybeSingle();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Get a site by slug
   */
  async getBySlug(slug: string): Promise<Site | null> {
    // Validate input
    const validSlug = slugSchema.parse(slug);

    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('slug', validSlug)
      .maybeSingle();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Create a new site
   * Input is validated against siteInsertSchema
   */
  async create(input: unknown): Promise<Site> {
    // Validate input with Zod
    const validatedInput = siteInsertSchema.parse(input);

    const { data, error } = await supabase
      .from('sites')
      .insert(validatedInput)
      .select()
      .single();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Update a site
   * @param tenantId - Required for defense-in-depth validation alongside RLS
   * Input is validated against siteUpdateSchema
   */
  async update(siteId: string, tenantId: string, input: unknown): Promise<Site> {
    // Validate inputs
    const validSiteId = uuidSchema.parse(siteId);
    const validTenantId = uuidSchema.parse(tenantId);
    const validatedUpdates = siteUpdateSchema.parse(input);

    const { data, error } = await supabase
      .from('sites')
      .update(validatedUpdates)
      .eq('id', validSiteId)
      .eq('tenant_id', validTenantId)
      .select()
      .single();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Delete a site
   * @param tenantId - Required for defense-in-depth validation alongside RLS
   */
  async delete(siteId: string, tenantId: string): Promise<void> {
    // Validate inputs
    const validSiteId = uuidSchema.parse(siteId);
    const validTenantId = uuidSchema.parse(tenantId);

    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', validSiteId)
      .eq('tenant_id', validTenantId);

    if (error) throw parseSupabaseError(error);
  },

  /**
   * Update site settings
   * @param tenantId - Required for defense-in-depth validation alongside RLS
   */
  async updateSettings(siteId: string, tenantId: string, settings: unknown): Promise<Site> {
    // Validate inputs
    const validSiteId = uuidSchema.parse(siteId);
    const validTenantId = uuidSchema.parse(tenantId);
    const validatedSettings = siteSettingsSchema.parse(settings);

    const { data, error } = await supabase
      .from('sites')
      .update({ settings: validatedSettings as unknown as Json })
      .eq('id', validSiteId)
      .eq('tenant_id', validTenantId)
      .select()
      .single();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Check if slug is available
   */
  async isSlugAvailable(slug: string, excludeSiteId?: string): Promise<boolean> {
    // Validate inputs
    const validSlug = slugSchema.parse(slug);
    if (excludeSiteId) {
      uuidSchema.parse(excludeSiteId);
    }

    let query = supabase
      .from('sites')
      .select('id')
      .eq('slug', validSlug);

    if (excludeSiteId) {
      query = query.neq('id', excludeSiteId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) throw parseSupabaseError(error);
    return data === null;
  },
};
