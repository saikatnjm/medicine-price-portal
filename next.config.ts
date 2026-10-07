import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server output for the Docker production image.
  // Vercel ignores this and uses its own build output.
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  // Singular forms are accepted and redirected to the canonical plural paths.
  async redirects() {
    return [
      { source: "/specialty/:slug", destination: "/specialties/:slug", permanent: true },
      { source: "/location/:slug", destination: "/locations/:slug", permanent: true },
      { source: "/bn/specialty/:slug", destination: "/bn/specialties/:slug", permanent: true },
      { source: "/bn/location/:slug", destination: "/bn/locations/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
