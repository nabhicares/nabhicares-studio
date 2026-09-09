const path = require('path');
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Next 14: monorepo root so serverless traces can include packages/*
    outputFileTracingRoot: path.join(__dirname, '../..'),
    outputFileTracingIncludes: {
      '/*': ['./../../packages/db-builder/src/generated/client/**/*'],
      '/api/**/*': [
        './../../packages/db-builder/src/generated/client/**/*',
        './public/fonts/**/*',
        './lib/fonts/**/*',
      ],
    },
    // Avoid webpack ESM/CJS breakage: opentype.default import was undefined on Vercel.
    serverComponentsExternalPackages: ['opentype.js', 'sharp'],
  },
  // Must transpile the TS workspace package; do not also mark it external.
  transpilePackages: [
    '@nabhicares/db-builder',
    '@nabhicares/queue',
    '@nabhicares/section-registry',
    '@nabhicares/section-layouts',
    '@nabhicares/snapshot-store',
  ],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
      const externals = config.externals || [];
      if (Array.isArray(externals)) {
        externals.push('opentype.js');
        config.externals = externals;
      }
    }
    return config;
  },
};

module.exports = nextConfig;
