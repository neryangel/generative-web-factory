import { supabase } from '@/integrations/supabase/client';
import { ApiError, parseSupabaseError } from '@/lib/api-error';
import type { Section, SectionContent, SectionInsert, SectionUpdate } from '@/types';
import type { Json } from '@/integrations/supabase/types';

export const sectionsApi = {
  /**
   * Get all sections for a page
   * @param tenantId - Required for defense-in-depth validation alongside RLS
   */
  async getByPageId(pageId: string, tenantId: string): Promise<Section[]> {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .eq('page_id', pageId)
      .eq('tenant_id', tenantId)
      .order('sort_order');

    if (error) throw parseSupabaseError(error);
    return data || [];
  },

  /**
   * Get a section by ID
   * @param tenantId - Required for defense-in-depth validation alongside RLS
   */
  async getById(sectionId: string, tenantId: string): Promise<Section | null> {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .eq('id', sectionId)
      .eq('tenant_id', tenantId)
      .maybeSingle();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Create a new section
   */
  async create(section: SectionInsert): Promise<Section> {
    const { data, error } = await supabase
      .from('sections')
      .insert(section)
      .select()
      .single();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Update a section
   * @param tenantId - Required for defense-in-depth validation alongside RLS
   */
  async update(sectionId: string, tenantId: string, updates: SectionUpdate): Promise<Section> {
    const { data, error } = await supabase
      .from('sections')
      .update(updates)
      .eq('id', sectionId)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Update section content
   * @param tenantId - Required for defense-in-depth validation alongside RLS
   */
  async updateContent(sectionId: string, tenantId: string, content: SectionContent): Promise<Section> {
    const { data, error } = await supabase
      .from('sections')
      .update({ content: content as Json })
      .eq('id', sectionId)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Delete a section
   * @param tenantId - Required for defense-in-depth validation alongside RLS
   */
  async delete(sectionId: string, tenantId: string): Promise<void> {
    const { error } = await supabase
      .from('sections')
      .delete()
      .eq('id', sectionId)
      .eq('tenant_id', tenantId);

    if (error) throw parseSupabaseError(error);
  },

  /**
   * Update section order
   * Note: RLS policies validate tenant access for each section
   */
  async updateOrder(sections: Array<{ id: string; sort_order: number }>): Promise<void> {
    const updates = sections.map(({ id, sort_order }) =>
      supabase
        .from('sections')
        .update({ sort_order })
        .eq('id', id)
    );

    const results = await Promise.all(updates);
    const firstError = results.find(r => r.error);
    if (firstError?.error) throw parseSupabaseError(firstError.error);
  },

  /**
   * Duplicate a section
   * @param tenantId - Required for defense-in-depth validation alongside RLS
   */
  async duplicate(sectionId: string, tenantId: string): Promise<Section> {
    // Get original section
    const original = await sectionsApi.getById(sectionId, tenantId);
    if (!original) {
      throw new ApiError({
        code: 'NOT_FOUND',
        message: 'Section not found',
        retryable: false,
      });
    }

    // Create duplicate with incremented sort_order
    const { data, error } = await supabase
      .from('sections')
      .insert({
        page_id: original.page_id,
        tenant_id: tenantId,
        type: original.type,
        variant: original.variant,
        content: original.content,
        settings: original.settings,
        sort_order: (original.sort_order || 0) + 1,
      })
      .select()
      .single();

    if (error) throw parseSupabaseError(error);
    return data;
  },
};
