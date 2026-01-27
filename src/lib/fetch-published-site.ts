import type { PublishedSiteData } from '@/types/published-site';

/**
 * Fetch a published site by slug (server-side).
 * Used by app/s/[slug] routes to avoid duplicating fetch logic.
 */
export async function fetchPublishedSiteBySlug(slug: string): Promise<PublishedSiteData | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase configuration');
    return null;
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/get-published-site?slug=${encodeURIComponent(slug)}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching site:', error);
    return null;
  }
}

/**
 * Fetch a published site by domain (server-side).
 * Used by app/sites/[domain] routes.
 */
export async function fetchPublishedSiteByDomain(domain: string): Promise<PublishedSiteData | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    console.error('Missing Supabase URL configuration');
    return null;
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/get-published-site?domain=${encodeURIComponent(domain)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching site:', error);
    return null;
  }
}
