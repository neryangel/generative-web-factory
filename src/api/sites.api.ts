import { supabase } from '@/integrations/supabase/client';
import { parseSupabaseError } from '@/lib/api-error';
import type { Site, SiteInsert, SiteUpdate } from '@/types';

export const sitesApi = {
  /**
   * Get all sites for a tenant
   */
  async getAll(tenantId: string): Promise<Site[]> {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('updated_at', { ascending: false });

    if (error) throw parseSupabaseError(error);
    return data || [];
  },

  /**
   * Get a site by ID
   */
  async getById(siteId: string, tenantId: string): Promise<Site | null> {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', siteId)
      .eq('tenant_id', tenantId)
      .maybeSingle();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Get a site by slug
   */
  async getBySlug(slug: string): Promise<Site | null> {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Create a new site
   */
  async create(site: SiteInsert): Promise<Site> {
    const { data, error } = await supabase
      .from('sites')
      .insert(site)
      .select()
      .single();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Update a site
   */
  async update(siteId: string, updates: SiteUpdate): Promise<Site> {
    const { data, error } = await supabase
      .from('sites')
      .update(updates)
      .eq('id', siteId)
      .select()
      .single();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Delete a site
   */
  async delete(siteId: string): Promise<void> {
    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', siteId);

    if (error) throw parseSupabaseError(error);
  },

  /**
   * Update site settings
   */
  async updateSettings(siteId: string, settings: Record<string, unknown>): Promise<Site> {
    const { data, error } = await supabase
      .from('sites')
      .update({ settings: settings as unknown as import('@/integrations/supabase/types').Json })
      .eq('id', siteId)
      .select()
      .single();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Check if slug is available
   */
  async isSlugAvailable(slug: string, excludeSiteId?: string): Promise<boolean> {
    let query = supabase
      .from('sites')
      .select('id')
      .eq('slug', slug);

    if (excludeSiteId) {
      query = query.neq('id', excludeSiteId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) throw parseSupabaseError(error);
    return data === null;
  },
};
