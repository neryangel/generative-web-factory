import { supabase } from '@/integrations/supabase/client';
import { parseSupabaseError } from '@/lib/api-error';
import type { Page, PageInsert, PageUpdate } from '@/types';

export const pagesApi = {
  /**
   * Get all pages for a site
   * @param tenantId - Required for defense-in-depth validation alongside RLS
   */
  async getBySiteId(siteId: string, tenantId: string): Promise<Page[]> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('site_id', siteId)
      .eq('tenant_id', tenantId)
      .order('sort_order');

    if (error) throw parseSupabaseError(error);
    return data || [];
  },

  /**
   * Get a page by ID
   * @param tenantId - Required for defense-in-depth validation alongside RLS
   */
  async getById(pageId: string, tenantId: string): Promise<Page | null> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .eq('tenant_id', tenantId)
      .maybeSingle();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Get homepage for a site
   * @param tenantId - Required for defense-in-depth validation alongside RLS
   */
  async getHomepage(siteId: string, tenantId: string): Promise<Page | null> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('site_id', siteId)
      .eq('tenant_id', tenantId)
      .eq('is_homepage', true)
      .maybeSingle();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Create a new page
   */
  async create(page: PageInsert): Promise<Page> {
    const { data, error } = await supabase
      .from('pages')
      .insert(page)
      .select()
      .single();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Update a page
   * @param tenantId - Required for defense-in-depth validation alongside RLS
   */
  async update(pageId: string, tenantId: string, updates: PageUpdate): Promise<Page> {
    const { data, error } = await supabase
      .from('pages')
      .update(updates)
      .eq('id', pageId)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Delete a page
   * @param tenantId - Required for defense-in-depth validation alongside RLS
   */
  async delete(pageId: string, tenantId: string): Promise<void> {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', pageId)
      .eq('tenant_id', tenantId);

    if (error) throw parseSupabaseError(error);
  },

  /**
   * Update page order
   * Note: RLS policies validate tenant access for each page
   */
  async updateOrder(pages: Array<{ id: string; sort_order: number }>): Promise<void> {
    const updates = pages.map(({ id, sort_order }) =>
      supabase
        .from('pages')
        .update({ sort_order })
        .eq('id', id)
    );

    const results = await Promise.all(updates);
    const firstError = results.find(r => r.error);
    if (firstError?.error) throw parseSupabaseError(firstError.error);
  },
};
