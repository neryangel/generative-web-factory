import type { VercelRequest, VercelResponse } from '@vercel/node';

const VERCEL_API_URL = 'https://api.vercel.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
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
      console.error('Vercel API error:', data);
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
    console.error('Add domain error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
