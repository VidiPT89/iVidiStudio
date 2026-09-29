import type { NextConfig } from "next";

// The showcase may only be embedded by ividi.dev (the "Live Demo" panel) and local development.
const FRAME_ANCESTORS = "'self' https://ividi.dev https://*.ividi.dev http://localhost:*";

const nextConfig: NextConfig = {
  // The dashboard lives inside the HQ repository; keep Next.js from looking further up.
  outputFileTracingRoot: __dirname,
  turbopack: { root: __dirname },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: `frame-ancestors ${FRAME_ANCESTORS}` },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
