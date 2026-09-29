import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dashboard lives inside the HQ repository; keep Next.js from looking further up.
  outputFileTracingRoot: __dirname,
  turbopack: { root: __dirname },
};

export default nextConfig;
