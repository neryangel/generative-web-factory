import type { VercelRequest, VercelResponse } from '@vercel/node';

const VERCEL_API_URL = 'https://api.vercel.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers - restrict to allowed origins only (CSRF protection)
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://amdir.app,https://www.amdir.app').split(',');
  const origin = req.headers.origin || '';

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({ error: 'Missing domain' });
    }

    // Validate domain format (defense-in-depth)
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (typeof domain !== 'string' || domain.length > 253 || !domainRegex.test(domain)) {
      return res.status(400).json({ error: 'Invalid domain format' });
    }

    const token = process.env.VERCEL_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID; // Auto-provided by Vercel
    const teamId = process.env.VERCEL_TEAM_ID; // Optional - only for team accounts

    if (!token) {
      return res.status(500).json({ error: 'Missing VERCEL_TOKEN environment variable' });
    }

    if (!projectId) {
      return res.status(500).json({ error: 'VERCEL_PROJECT_ID not available - are you running on Vercel?' });
    }

    const url = teamId
      ? `${VERCEL_API_URL}/v10/projects/${projectId}/domains?teamId=${teamId}`
      : `${VERCEL_API_URL}/v10/projects/${projectId}/domains`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Log error code only, not full response (may contain sensitive data)
      console.error('Vercel API error:', response.status, data.error?.code);
      return res.status(response.status).json({
        error: data.error?.message || 'Failed to add domain',
        code: data.error?.code
      });
    }

    return res.status(200).json({
      success: true,
      domain: data.name,
      verified: data.verified,
      verification: data.verification,
    });
  } catch (error) {
    // Log error type only, not full error (may contain sensitive data)
    console.error('Add domain error:', error instanceof Error ? error.name : 'Unknown');
    return res.status(500).json({ error: 'Internal server error' });
  }
}
