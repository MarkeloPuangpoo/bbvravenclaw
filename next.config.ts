import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

const localDevHosts = Object.values(networkInterfaces())
  .flatMap((addresses) => addresses ?? [])
  .filter((address) => address.family === "IPv4" && !address.internal)
  .map((address) => address.address);

const nextConfig: NextConfig = {
  allowedDevOrigins: localDevHosts,
  devIndicators: false,
  experimental: { serverActions: { bodySizeLimit: "26mb" } },
  images: {
    localPatterns: [
      { pathname: "/**", search: "" },
      { pathname: "/assets/brand/ravenclaw-mark-primarycrest-rmbg.png", search: "?v=transparent" },
    ],
    remotePatterns: process.env.NEXT_PUBLIC_SUPABASE_URL ? [{
      protocol: "https",
      hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
      pathname: "/storage/v1/object/sign/event-media/**",
    }] : [],
  },
};

export default nextConfig;
