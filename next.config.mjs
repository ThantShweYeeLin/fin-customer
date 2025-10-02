/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/fin-customer',
  assetPrefix: '/fin-customer',
  experimental: {
    instrumentationHook: true,
  },
  trailingSlash: true,
};

export default nextConfig;
