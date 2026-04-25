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
  async redirects() {
    return [
      // Bellamere → Sample Trust-Building Script: rename was cosmetic
      // (Bellamere stays inside the script content as the example client),
      // but any links shared from the original launch must keep working.
      {
        source: "/bellamere-trust-building-script",
        destination: "/sample-trust-building-script",
        permanent: true,
      },
      {
        source: "/bellamere-trust-building-script/:path*",
        destination: "/sample-trust-building-script/:path*",
        permanent: true,
      },
      {
        source: "/api/bellamere-trust-building-script/:path*",
        destination: "/api/sample-trust-building-script/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
