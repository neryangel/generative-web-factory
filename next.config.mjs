/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Support for Supabase and external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
      },
    ],
  },

  // Disable x-powered-by header
  poweredByHeader: false,

  // Trailing slashes configuration
  trailingSlash: false,

  // Security headers for enterprise compliance (OWASP recommendations)
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            // HSTS - enforce HTTPS for 2 years
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            // Prevent MIME type sniffing
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Clickjacking protection
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            // XSS protection (legacy browsers)
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            // Control referrer information
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            // Restrict browser features
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            // Content Security Policy - XSS protection for enterprise compliance
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in",
              "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
