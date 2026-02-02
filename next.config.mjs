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
    const isDev = process.env.NODE_ENV === 'development';

    // CSP is more permissive in development for hot reload
    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
      : "script-src 'self' 'unsafe-inline'"; // Remove unsafe-eval in production

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
            // Content Security Policy - Enhanced security
            // Note: unsafe-inline for styles is required for Tailwind CSS
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              scriptSrc,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in https://images.unsplash.com",
              "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co",
              "media-src 'self' https://*.supabase.co",
              "object-src 'none'",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
