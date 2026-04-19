/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@fitness/ui', '@fitness/types', '@fitness/utils', '@fitness/config'],
  experimental: {
    optimizePackageImports: ['@mediapipe/tasks-vision'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

