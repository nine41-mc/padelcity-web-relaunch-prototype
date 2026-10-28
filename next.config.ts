import type { NextConfig } from "next";

/**
 * Static export (GitHub Pages; .gitlab-ci.yml for GitLab Pages). Contentful data is fetched at build time;
 * a scheduled/webhook pipeline rebuilds when content changes.
 * NEXT_PUBLIC_BASE_PATH is set by CI when Pages serves the site from a sub-path.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
