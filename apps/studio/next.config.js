/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@nabhicares/db-builder',
    '@nabhicares/queue',
    '@nabhicares/section-registry',
    '@nabhicares/section-layouts',
  ],
};

module.exports = nextConfig;
