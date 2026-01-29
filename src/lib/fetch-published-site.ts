import type { PublishedSiteData } from '@/types/published-site';

export interface FetchResult {
  data: PublishedSiteData | null;
  /** true when Supabase/network is unreachable (vs content not found) */
  isServiceError: boolean;
}

/**
 * Fetch a published site by slug (server-side).
 * Used by app/s/[slug] routes to avoid duplicating fetch logic.
 */
export async function fetchPublishedSiteBySlug(slug: string): Promise<PublishedSiteData | null> {
  const result = await fetchPublishedSite(
    `slug=${encodeURIComponent(slug)}`,
    true
  );
  return result.data;
}

/**
 * Fetch a published site by domain (server-side).
 * Used by app/sites/[domain] routes.
 */
export async function fetchPublishedSiteByDomain(domain: string): Promise<PublishedSiteData | null> {
  const result = await fetchPublishedSite(
    `domain=${encodeURIComponent(domain)}`,
    false
  );
  return result.data;
}

/**
 * Shared fetch logic with proper error differentiation.
 * Distinguishes between "site not found" (404) and "service unavailable" (5xx/network).
 */
async function fetchPublishedSite(
  queryParams: string,
  includeAuth: boolean
): Promise<FetchResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || (includeAuth && !supabaseKey)) {
    console.error('Missing Supabase configuration');
    return { data: null, isServiceError: true };
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (includeAuth && supabaseKey) {
      headers.Authorization = `Bearer ${supabaseKey}`;
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/get-published-site?${queryParams}`,
      {
        headers,
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      // 404 = site not found (expected), 5xx = service error
      if (response.status >= 500) {
        console.error(`Supabase service error: ${response.status}`);
        return { data: null, isServiceError: true };
      }
      return { data: null, isServiceError: false };
    }

    const data: unknown = await response.json();
    return { data: data as PublishedSiteData, isServiceError: false };
  } catch (error) {
    // Network error = service unavailable
    console.error('Error fetching site (network/service):', error);
    return { data: null, isServiceError: true };
  }
}
