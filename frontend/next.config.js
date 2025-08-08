/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Netlify deployment - use standard build, not export
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Allow cross-origin requests from Replit domains and local development
  allowedDevOrigins: ['*.replit.dev', '*.repl.co', '*.kirk.replit.dev', '127.0.0.1', 'localhost'],
  // Environment-specific API rewrites
  async rewrites() {
    if (process.env.NETLIFY) {
      return [
        {
          source: '/api/:path*',
          destination: '/.netlify/functions/api/:path*',
        },
      ];
    }
    // For VS Code development - route directly to backend port 3001
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;