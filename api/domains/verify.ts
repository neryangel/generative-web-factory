import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest, verifyDomainPermission, sendUnauthorized, sendForbidden } from '../lib/auth';

const VERCEL_API_URL = 'https://api.vercel.com';

// Allowed origins for CORS (update with your domains)
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://generative-web-factory.vercel.app',
  'https://amdir.app',
  'https://www.amdir.app',
];

function getCorsOrigin(req: VercelRequest): string {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return origin;
  }
  return ALLOWED_ORIGINS[0];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers with restricted origins
  res.setHeader('Access-Control-Allow-Origin', getCorsOrigin(req));
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate the request
    const authResult = await authenticateRequest(req);
    if (authResult.error) {
      return sendUnauthorized(res, authResult.error);
    }

    const { domain, siteId } = req.body;

    if (!domain) {
      return res.status(400).json({ error: 'Missing domain' });
    }

    if (!siteId) {
      return res.status(400).json({ error: 'Missing siteId' });
    }

    // Verify the user has permission to manage domains for this site
    const permissionResult = await verifyDomainPermission(authResult.userId, siteId);
    if (!permissionResult.allowed) {
      return sendForbidden(res, permissionResult.error || 'Access denied');
    }

    const token = process.env.VERCEL_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID; // Auto-provided by Vercel
    const teamId = process.env.VERCEL_TEAM_ID; // Optional

    if (!token) {
      return res.status(500).json({ error: 'Missing VERCEL_TOKEN environment variable' });
    }

    if (!projectId) {
      return res.status(500).json({ error: 'VERCEL_PROJECT_ID not available' });
    }

    // First, try to verify the domain
    const verifyUrl = teamId
      ? `${VERCEL_API_URL}/v9/projects/${projectId}/domains/${domain}/verify?teamId=${teamId}`
      : `${VERCEL_API_URL}/v9/projects/${projectId}/domains/${domain}/verify`;

    const verifyResponse = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const verifyData = await verifyResponse.json();

    // Get domain configuration status
    const configUrl = teamId
      ? `${VERCEL_API_URL}/v6/domains/${domain}/config?teamId=${teamId}`
      : `${VERCEL_API_URL}/v6/domains/${domain}/config`;

    const configResponse = await fetch(configUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let configured = false;
    let misconfigured = false;

    if (configResponse.ok) {
      const configData = await configResponse.json();
      configured = configData.configuredBy !== null;
      misconfigured = configData.misconfigured || false;
    }

    return res.status(200).json({
      verified: verifyData.verified || false,
      configured,
      misconfigured,
      verification: verifyData.verification,
    });
  } catch (error) {
    console.error('Verify domain error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
