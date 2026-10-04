import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server output for the Docker production image.
  // Vercel ignores this and uses its own build output.
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
