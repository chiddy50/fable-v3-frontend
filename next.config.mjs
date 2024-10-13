/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    typescript: { ignoreBuildErrors: true },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'oaidalleapiprodscus.blob.core.windows.net',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'd9jy2smsrdjcq.cloudfront.net',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'pub-3626123a908346a7a8be8d9295f44e26.r2.dev',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'cdn2.stablediffusionapi.com',
            pathname: '/**',
          },
          
        ],
    },
    async rewrites() {
      return [
        {
          source: '/.well-known/code-payments.json',
          destination: '/api/well-known/code-payments', // This points to the dynamic API route
        },
      ];
    },
};

export default nextConfig;
