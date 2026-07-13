import type { NextConfig } from "next";

// Allow LAN devices (phones, tablets) to access the dev server.
// Set ALLOWED_DEV_ORIGINS=192.168.x.x in .env.local and restart.
const allowedDevOrigins = process.env.ALLOWED_DEV_ORIGINS
  ? process.env.ALLOWED_DEV_ORIGINS.split(",").map((s) => s.trim())
  : [];

const nextConfig: NextConfig = {
  output: "standalone",
  // sharp ships native (non-JS) binaries. The standalone build's bundler
  // tracing can drop the shared libraries those binaries dlopen, so it
  // needs to stay a plain runtime require() instead of being bundled.
  serverExternalPackages: ["sharp"],
  ...(allowedDevOrigins.length > 0 && { allowedDevOrigins }),
};

export default nextConfig;
