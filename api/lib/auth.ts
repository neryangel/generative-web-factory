import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Extracts and validates the Supabase JWT from the Authorization header.
 * Returns the user object if valid, null otherwise.
 */
export async function authenticateRequest(req: VercelRequest): Promise<{
  userId: string;
  error?: never;
} | {
  userId?: never;
  error: string;
}> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Missing or invalid Authorization header' };
  }

  const token = authHeader.replace('Bearer ', '');

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase configuration for auth verification');
    return { error: 'Server configuration error' };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { error: 'Invalid or expired token' };
  }

  return { userId: user.id };
}

/**
 * Verifies that the user has permission to manage domains for a specific site.
 * Checks tenant membership with admin or owner role.
 */
export async function verifyDomainPermission(
  userId: string,
  siteId: string
): Promise<{ allowed: boolean; error?: string }> {
  if (!supabaseUrl || !supabaseServiceKey) {
    return { allowed: false, error: 'Server configuration error' };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get the site and its tenant_id
  const { data: site, error: siteError } = await supabase
    .from('sites')
    .select('tenant_id')
    .eq('id', siteId)
    .single();

  if (siteError || !site) {
    return { allowed: false, error: 'Site not found' };
  }

  // Check if user is a member of the tenant with sufficient role
  const { data: membership, error: memberError } = await supabase
    .from('tenant_members')
    .select('role')
    .eq('tenant_id', site.tenant_id)
    .eq('user_id', userId)
    .single();

  if (memberError || !membership) {
    return { allowed: false, error: 'Access denied - not a tenant member' };
  }

  // Only owner and admin can manage domains
  const allowedRoles = ['owner', 'admin'];
  if (!allowedRoles.includes(membership.role)) {
    return { allowed: false, error: 'Access denied - insufficient permissions' };
  }

  return { allowed: true };
}

/**
 * Helper to send unauthorized response
 */
export function sendUnauthorized(res: VercelResponse, message: string) {
  return res.status(401).json({ error: message });
}

/**
 * Helper to send forbidden response
 */
export function sendForbidden(res: VercelResponse, message: string) {
  return res.status(403).json({ error: message });
}
