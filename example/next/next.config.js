// @ts-check
/// <reference path="./env.d.ts" />

/** @type {import("next").NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: Boolean(process.env.VERCEL),
  },
  basePath: process.env.EXPORT_DOCS ? "/examples/next" : undefined,
  headers: async () => [],
  reactStrictMode: false,
  redirects: async () => [],
  rewrites: async () => [],
  swcMinify: false,
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: Boolean(process.env.VERCEL),
  },
  transpilePackages: [
    "@leapwallet/cosmos-social-login-capsule-provider",
    "@leapwallet/cosmos-social-login-capsule-provider-ui",
    "@leapwallet/capsule-web-sdk-lite",
  ],
};

module.exports = nextConfig;
