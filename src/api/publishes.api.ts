import { supabase } from '@/integrations/supabase/client';
import type { Publish } from '@/types/api.types';
import type { Json } from '@/integrations/supabase/types';

export interface PublishSnapshot {
  pages: Array<{
    id: string;
    title: string;
    slug: string;
    sections: Array<{
      id: string;
      type: string;
      variant: string | null;
      content: Json;
      sort_order: number | null;
    }>;
  }>;
  settings: Json;
  published_at: string;
}

export const publishesApi = {
  /**
   * Get all publishes for a site
   */
  async getBySiteId(siteId: string): Promise<Publish[]> {
    const { data, error } = await supabase
      .from('publishes')
      .select('*')
      .eq('site_id', siteId)
      .order('version', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get current published version
   */
  async getCurrent(siteId: string): Promise<Publish | null> {
    const { data, error } = await supabase
      .from('publishes')
      .select('*')
      .eq('site_id', siteId)
      .eq('is_current', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Get a publish by version
   */
  async getByVersion(siteId: string, version: number): Promise<Publish | null> {
    const { data, error } = await supabase
      .from('publishes')
      .select('*')
      .eq('site_id', siteId)
      .eq('version', version)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Create a new publish
   */
  async create(publish: {
    site_id: string;
    tenant_id: string;
    snapshot: PublishSnapshot;
    changelog?: string;
  }): Promise<Publish> {
    // Get next version number
    const { data: lastPublish } = await supabase
      .from('publishes')
      .select('version')
      .eq('site_id', publish.site_id)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();

    const newVersion = (lastPublish?.version || 0) + 1;

    // Reset is_current on previous publishes
    await supabase
      .from('publishes')
      .update({ is_current: false })
      .eq('site_id', publish.site_id);

    // Create new publish
    const { data, error } = await supabase
      .from('publishes')
      .insert({
        ...publish,
        snapshot: publish.snapshot as unknown as Json,
        version: newVersion,
        is_current: true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Rollback to a previous version
   */
  async rollback(siteId: string, version: number): Promise<Publish> {
    // Get the target version
    const target = await publishesApi.getByVersion(siteId, version);
    if (!target) {
      throw new Error('Version not found');
    }

    // Reset is_current on all publishes
    await supabase
      .from('publishes')
      .update({ is_current: false })
      .eq('site_id', siteId);

    // Create new publish with the old snapshot
    const { data: lastPublish } = await supabase
      .from('publishes')
      .select('version, tenant_id')
      .eq('site_id', siteId)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();

    const newVersion = (lastPublish?.version || 0) + 1;

    const { data, error } = await supabase
      .from('publishes')
      .insert({
        site_id: siteId,
        tenant_id: lastPublish?.tenant_id || target.tenant_id,
        version: newVersion,
        snapshot: target.snapshot,
        changelog: `Rollback to version ${version}`,
        is_current: true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get latest version number
   */
  async getLatestVersion(siteId: string): Promise<number> {
    const { data, error } = await supabase
      .from('publishes')
      .select('version')
      .eq('site_id', siteId)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data?.version || 0;
  },
};
