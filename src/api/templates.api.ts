import { supabase } from '@/integrations/supabase/client';
import { parseSupabaseError } from '@/lib/api-error';
import type { Template } from '@/types/api.types';

export const templatesApi = {
  /**
   * Get all active templates
   */
  async getAll(): Promise<Template[]> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('is_active', true)
      .order('category');

    if (error) throw parseSupabaseError(error);
    return data || [];
  },

  /**
   * Get templates by category
   */
  async getByCategory(category: string): Promise<Template[]> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('is_active', true)
      .eq('category', category)
      .order('name');

    if (error) throw parseSupabaseError(error);
    return data || [];
  },

  /**
   * Get a template by ID
   */
  async getById(templateId: string): Promise<Template | null> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .maybeSingle();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Get a template by slug
   */
  async getBySlug(slug: string): Promise<Template | null> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Get all unique categories
   */
  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('templates')
      .select('category')
      .eq('is_active', true);

    if (error) throw parseSupabaseError(error);
    
    const categories = [...new Set(data?.map(t => t.category) || [])];
    return categories.sort();
  },
};
