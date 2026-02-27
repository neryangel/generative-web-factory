import { supabase } from '@/integrations/supabase/client';
import { parseSupabaseError } from '@/lib/api-error';
import type { Domain } from '@/types/api.types';

export const domainsApi = {
  /**
   * Get all domains for a site
   */
  async getBySiteId(siteId: string): Promise<Domain[]> {
    const { data, error } = await supabase
      .from('domains')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at');

    if (error) throw parseSupabaseError(error);
    return data || [];
  },

  /**
   * Get a domain by ID
   */
  async getById(domainId: string): Promise<Domain | null> {
    const { data, error } = await supabase
      .from('domains')
      .select('*')
      .eq('id', domainId)
      .maybeSingle();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Add a domain to a site
   */
  async create(domain: {
    domain: string;
    site_id: string;
    tenant_id: string;
  }): Promise<Domain> {
    const { data, error } = await supabase
      .from('domains')
      .insert({
        ...domain,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw parseSupabaseError(error);
    return data;
  },

  /**
   * Delete a domain
   */
  async delete(domainId: string): Promise<void> {
    const { error } = await supabase
      .from('domains')
      .delete()
      .eq('id', domainId);

    if (error) throw parseSupabaseError(error);
  },

  /**
   * Verify a domain (triggers edge function)
   */
  async verify(domainId: string): Promise<Domain> {
    // Call edge function to verify domain
    const result = await supabase.functions.invoke<Domain>('verify-domain', {
      body: { domainId },
    });

    if (result.error) throw parseSupabaseError(result.error);
    if (!result.data) throw parseSupabaseError(new Error('No data returned from verify-domain'));
    return result.data;
  },

  /**
   * Check if domain is available
   */
  async isAvailable(domain: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('domains')
      .select('id')
      .eq('domain', domain)
      .maybeSingle();

    if (error) throw parseSupabaseError(error);
    return data === null;
  },
};
