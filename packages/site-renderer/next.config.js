/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  transpilePackages: ['@nabhicares/section-layouts', '@nabhicares/section-registry'],
  // Sites are served under http://localhost:8080/{hospitalSlug}/ via the CDN
  // simulator, so static assets must be prefixed with that path — not "/".
  assetPrefix: process.env.SITE_BASE_PATH || '',
};

module.exports = nextConfig;
