import Link from "next/link";
import {
  legalNav,
  primaryNav,
  secondaryNav,
  siteConfig,
} from "@/config/site";

// Computed once at module load (server side) so the value is stable across
// the request lifecycle and can never drift between SSR and hydration.
const COPYRIGHT_YEAR = new Date().getFullYear();

export function SiteFooter() {
  const year = COPYRIGHT_YEAR;

  return (
    <footer className="mt-auto border-t border-accent/20 bg-primary text-primary-foreground">
      <div className="container-wide py-14 md:py-20 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5 space-y-4">
          <Link
            href="/"
            className="font-velocity text-3xl tracking-widest uppercase"
          >
            Velocity
            <span className="ml-2 font-heading text-xs tracking-[0.4em] text-accent align-middle">
              Framework
            </span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/70">
            The public tools and resource library for {siteConfig.author.name}
            &rsquo;s book, <em>{siteConfig.author.bookTitle}</em>. Worksheets,
            scripts, scorecards, and frameworks for Heart, Heading, and Hustle.
          </p>
          <p className="text-xs text-primary-foreground/70">
            Contact:{" "}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="underline-offset-4 hover:underline hover:text-primary-foreground"
            >
              {siteConfig.contactEmail}
            </a>
          </p>
        </div>

        <div className="md:col-span-3">
          <h4 className="font-heading text-xs uppercase tracking-widest text-primary-foreground">
            Framework
          </h4>
          <ul className="mt-4 space-y-2.5">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-primary-foreground/70 transition-smooth hover:text-primary-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="font-heading text-xs uppercase tracking-widest text-primary-foreground">
            Resources
          </h4>
          <ul className="mt-4 space-y-2.5">
            {secondaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-primary-foreground/70 transition-smooth hover:text-primary-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="container-wide py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs text-primary-foreground/70">
            © {year} Clayton Vaughan Strategies. All rights reserved.
          </p>
          <ul className="flex gap-5">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-xs text-primary-foreground/70 transition-smooth hover:text-primary-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
