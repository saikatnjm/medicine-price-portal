import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server output for the Docker production image.
  // Vercel ignores this and uses its own build output.
  output: "standalone",
  // Seed data is read with fs at runtime (src/data/local/dataset.ts), not bundled,
  // so it must be shipped next to the server code (standalone and Vercel functions).
  outputFileTracingIncludes: { "/**": ["./src/data/local/seed/**/*.json"] },
  experimental: {
    // Server source maps added ~200 MB to .next/server; stack traces still name files.
    serverSourceMaps: false,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  // Singular forms are accepted and redirected to the canonical plural paths.
  async redirects() {
    return [
      // Sitemap index (Next reserves /sitemap.xml for the generated app/sitemap.ts routes).
      { source: "/sitemap.xml", destination: "/sitemap-index.xml", permanent: true },
      { source: "/specialty/:slug", destination: "/specialties/:slug", permanent: true },
      { source: "/location/:slug", destination: "/locations/:slug", permanent: true },
      { source: "/bn/specialty/:slug", destination: "/bn/specialties/:slug", permanent: true },
      { source: "/bn/location/:slug", destination: "/bn/locations/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
