import { supabase } from '@/integrations/supabase/client';
import type { Page, PageInsert, PageUpdate } from '@/types';

export const pagesApi = {
  /**
   * Get all pages for a site
   */
  async getBySiteId(siteId: string): Promise<Page[]> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('site_id', siteId)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  },

  /**
   * Get a page by ID
   */
  async getById(pageId: string): Promise<Page | null> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Get homepage for a site
   */
  async getHomepage(siteId: string): Promise<Page | null> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('site_id', siteId)
      .eq('is_homepage', true)
      .maybeSingle();

    if (error) throw error;
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

    if (error) throw error;
    return data;
  },

  /**
   * Update a page
   */
  async update(pageId: string, updates: PageUpdate): Promise<Page> {
    const { data, error } = await supabase
      .from('pages')
      .update(updates)
      .eq('id', pageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a page
   */
  async delete(pageId: string): Promise<void> {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', pageId);

    if (error) throw error;
  },

  /**
   * Update page order
   */
  async updateOrder(pages: Array<{ id: string; sort_order: number }>): Promise<void> {
    const updates = pages.map(({ id, sort_order }) =>
      supabase
        .from('pages')
        .update({ sort_order })
        .eq('id', id)
    );

    await Promise.all(updates);
  },
};
