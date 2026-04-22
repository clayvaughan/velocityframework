import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
