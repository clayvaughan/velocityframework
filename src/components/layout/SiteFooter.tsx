import Link from "next/link";
import {
  legalNav,
  primaryNav,
  secondaryNav,
  siteConfig,
} from "@/config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-secondary/40">
      <div className="container-wide py-14 md:py-20 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5 space-y-4">
          <Link
            href="/"
            className="font-velocity text-3xl tracking-widest uppercase"
          >
            Velocity
            <span className="ml-2 font-heading text-xs tracking-[0.4em] text-accent-dark align-middle">
              Framework
            </span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            The public tools and resource library for {siteConfig.author.name}
            &rsquo;s book, <em>{siteConfig.author.bookTitle}</em>. Worksheets,
            scripts, scorecards, and frameworks for Heart, Heading, and Hustle.
          </p>
          <p className="text-xs text-muted-foreground">
            Contact:{" "}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="underline-offset-4 hover:underline"
            >
              {siteConfig.contactEmail}
            </a>
          </p>
        </div>

        <div className="md:col-span-3">
          <h4 className="font-heading text-xs uppercase tracking-widest text-foreground">
            Framework
          </h4>
          <ul className="mt-4 space-y-2.5">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-smooth hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="font-heading text-xs uppercase tracking-widest text-foreground">
            Resources
          </h4>
          <ul className="mt-4 space-y-2.5">
            {secondaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-smooth hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-wide py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} Clayton Vaughan Strategies. All rights reserved.
          </p>
          <ul className="flex gap-5">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-xs text-muted-foreground transition-smooth hover:text-foreground"
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
