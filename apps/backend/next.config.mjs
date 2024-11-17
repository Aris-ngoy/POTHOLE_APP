/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['storage.googleapis.com', 'firebasestorage.googleapis.com', 'localhost:3000'],
  },
  async rewrites() {
      return [
        {
          source: '/api/process:path*',
          destination: 'http://localhost:8000/process/:path*', // Proxy to the Flask server
        },
      ]
    },
};

export default nextConfig;
