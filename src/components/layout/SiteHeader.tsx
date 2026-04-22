"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { primaryNav, siteConfig } from "@/config/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container-wide flex h-16 md:h-20 items-center justify-between gap-6">
        <Link
          href="/"
          className="font-velocity text-2xl md:text-3xl tracking-widest uppercase"
          aria-label={`${siteConfig.name} home`}
          onClick={() => setOpen(false)}
        >
          Velocity
          <span className="ml-2 font-heading text-[0.6rem] tracking-[0.4em] text-accent-dark align-middle">
            Framework
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
          {primaryNav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-heading text-xs uppercase tracking-widest transition-smooth",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center">
          <Button asChild variant="cta" size="sm">
            <Link href="/workshop">Apply for Workshop</Link>
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container-wide py-5 flex flex-col gap-1" aria-label="Primary mobile">
            {primaryNav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-3 font-heading text-sm uppercase tracking-wider",
                    active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button asChild variant="cta" size="md" className="mt-3">
              <Link href="/workshop" onClick={() => setOpen(false)}>
                Apply for Workshop
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
