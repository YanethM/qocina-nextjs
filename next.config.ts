import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "ec2-23-23-186-243.compute-1.amazonaws.com",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
    // Convierte a WebP/AVIF automáticamente (archivos más livianos)
    formats: ["image/avif", "image/webp"],
    // Cachea las imágenes ya optimizadas por 1 año en lugar de 60s por defecto
    minimumCacheTTL: 31536000,
    // Solo los anchos que realmente usa el sitio
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [32, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
