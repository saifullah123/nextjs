import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-expect-error - serverActions is available at root in recent versions
  serverActions: {
    bodySizeLimit: '500mb',
  },
  experimental: {
    // Keep this for backward compatibility or if types expect it
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
};

export default nextConfig;
