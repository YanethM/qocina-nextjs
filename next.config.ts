import type { NextConfig } from "next";

const buildRemotePatterns = () => {
  const patterns: {
    protocol: "http" | "https";
    hostname: string;
    port?: string;
    pathname: string;
  }[] = [
    // Wildcard para cualquier instancia EC2 en compute-1.amazonaws.com con puerto 1337
    {
      protocol: "http",
      hostname: "*.compute-1.amazonaws.com",
      port: "1337",
      pathname: "/uploads/**",
    },
    // Wildcard para HTTPS también (por si migran)
    {
      protocol: "https",
      hostname: "*.compute-1.amazonaws.com",
      pathname: "/uploads/**",
    },
  ];

  // Si hay una URL personalizada en env, también agregarla
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
      // URL inválida, ignorar
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
