import type { NextConfig } from "next";

const buildRemotePatterns = () => {
  const patterns: {
    protocol: "http" | "https";
    hostname: string;
    port?: string;
    pathname: string;
  }[] = [
    {
      protocol: "http",
      hostname: "*.compute-1.amazonaws.com",
      port: "1337",
      pathname: "/uploads/**",
    },
    {
      protocol: "https",
      hostname: "*.compute-1.amazonaws.com",
      pathname: "/uploads/**",
    },
  ];

  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL);
      const isAlreadyCovered = apiUrl.hostname.endsWith(
        ".compute-1.amazonaws.com"
      );
      if (!isAlreadyCovered) {
        patterns.push({
          protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
          hostname: apiUrl.hostname,
          port: apiUrl.port || undefined,
          pathname: "/uploads/**",
        });
      }
    } catch {
      return patterns;
    }
  }

  return patterns;
};

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["192.168.1.11"],
  images: {
    remotePatterns: buildRemotePatterns(),
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [32, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
