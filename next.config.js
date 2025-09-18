/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  eslint: {
    // ✅ disable ESLint checks during `next build`
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ allow production builds even if TypeScript errors exist
    ignoreBuildErrors: true,
  },
};

export default config;
