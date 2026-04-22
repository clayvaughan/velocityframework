import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin Turbopack's workspace root to this project so it can resolve
  // the `next` package reliably (otherwise it may infer src/app as root).
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Allow Replit preview subdomain to reach the Next.js dev server.
  // Add additional origins here if Replit rotates the subdomain.
  allowedDevOrigins: [
    "ab028848-31d7-4055-af1d-f2111532d5da-00-il1hvxtg2tgp.picard.replit.dev",
    "ab028848-31d7-4055-af1d-f2111532d5da-00-il1hvxtg2tgp-r9taotmg.picard.replit.dev",
    "*.picard.replit.dev",
    "*.replit.dev",
  ],
};

export default nextConfig;
