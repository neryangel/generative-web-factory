import { supabase } from '@/integrations/supabase/client';
import type { Section, SectionInsert, SectionUpdate, SectionContent } from '@/types';
import type { Json } from '@/integrations/supabase/types';

export const sectionsApi = {
  /**
   * Get all sections for a page
   */
  async getByPageId(pageId: string): Promise<Section[]> {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .eq('page_id', pageId)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  },

  /**
   * Get a section by ID
   */
  async getById(sectionId: string): Promise<Section | null> {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .eq('id', sectionId)
      .maybeSingle();

    if (error) throw error;
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

    if (error) throw error;
    return data;
  },

  /**
   * Update a section
   */
  async update(sectionId: string, updates: SectionUpdate): Promise<Section> {
    const { data, error } = await supabase
      .from('sections')
      .update(updates)
      .eq('id', sectionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update section content
   */
  async updateContent(sectionId: string, content: SectionContent): Promise<Section> {
    const { data, error } = await supabase
      .from('sections')
      .update({ content: content as Json })
      .eq('id', sectionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a section
   */
  async delete(sectionId: string): Promise<void> {
    const { error } = await supabase
      .from('sections')
      .delete()
      .eq('id', sectionId);

    if (error) throw error;
  },

  /**
   * Update section order
   */
  async updateOrder(sections: Array<{ id: string; sort_order: number }>): Promise<void> {
    const updates = sections.map(({ id, sort_order }) =>
      supabase
        .from('sections')
        .update({ sort_order })
        .eq('id', id)
    );

    await Promise.all(updates);
  },

  /**
   * Duplicate a section
   */
  async duplicate(sectionId: string, tenantId: string): Promise<Section> {
    // Get original section
    const original = await sectionsApi.getById(sectionId);
    if (!original) {
      throw new Error('Section not found');
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

    if (error) throw error;
    return data;
  },
};
