import type { VercelRequest, VercelResponse } from '@vercel/node';

const VERCEL_API_URL = 'https://api.vercel.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Restrict CORS to allowed origins only
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://amdir.app,https://www.amdir.app').split(',');
  const origin = req.headers.origin || '';

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({ error: 'Missing domain' });
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
