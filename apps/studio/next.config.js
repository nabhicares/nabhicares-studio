const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Monorepo: include files outside apps/studio for serverless tracing (Prisma engines).
  outputFileTracingRoot: path.join(__dirname, '../..'),
  experimental: {
    serverComponentsExternalPackages: [
      '@nabhicares/db-builder',
      '@prisma/client',
    ],
    outputFileTracingIncludes: {
      '/*': [
        '../../packages/db-builder/src/generated/client/**/*',
      ],
      '/api/**/*': [
        '../../packages/db-builder/src/generated/client/**/*',
      ],
    },
  },
  transpilePackages: [
    '@nabhicares/db-builder',
    '@nabhicares/queue',
    '@nabhicares/section-registry',
    '@nabhicares/section-layouts',
  ],
};

module.exports = nextConfig;
