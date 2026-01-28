import type { VercelRequest, VercelResponse } from '@vercel/node';

const VERCEL_API_URL = 'https://api.vercel.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers - restrict to allowed origins only (CSRF protection)
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://amdir.app,https://www.amdir.app').split(',');
  const origin = req.headers.origin || '';

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST' && req.method !== 'DELETE') {
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

    const url = teamId
      ? `${VERCEL_API_URL}/v9/projects/${projectId}/domains/${domain}?teamId=${teamId}`
      : `${VERCEL_API_URL}/v9/projects/${projectId}/domains/${domain}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok && response.status !== 404) {
      const data = await response.json();
      return res.status(response.status).json({
        error: data.error?.message || 'Failed to remove domain',
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    // Log error type only, not full error (may contain sensitive data)
    console.error('Remove domain error:', error instanceof Error ? error.name : 'Unknown');
    return res.status(500).json({ error: 'Internal server error' });
  }
}
