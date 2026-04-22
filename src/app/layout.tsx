import type { Metadata } from "next";
import { Bebas_Neue, Barlow, Montserrat } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { siteConfig } from "@/config/site";
import "./globals.css";

/* ---------- Web-font fallbacks ---------------------------------------------
   These Google Fonts stand in for the licensed Velocity brand fonts until the
   real files land in /public/fonts/. Each one exposes a CSS variable that the
   font stacks in globals.css reference:
     BigNoodleTitling -> --font-bebas
     NexaBold         -> --font-barlow
     Montserrat       -> --font-montserrat
   When the licensed files arrive, the real fonts take precedence automatically.
   --------------------------------------------------------------------------- */
const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const barlow = Barlow({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${barlow.variable} ${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="bg-background text-foreground min-h-full flex flex-col"
        suppressHydrationWarning
      >
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
