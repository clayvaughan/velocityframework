"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * VisualPlaceholder — renders the real asset at `/{filename}` when present and
 * falls back to a labeled gray rectangle when the file is missing. Every
 * placeholder filename must appear in MISSING_ASSETS_MANIFEST.md so the design
 * team knows what to ship.
 *
 * The fallback (Kind 2 placeholder per the locked spec) is a light gray box
 * with a medium gray dashed border, the correct aspect ratio, and a clear
 * label showing filename and dimensions.
 */
type VisualPlaceholderProps = {
  /** Filename the asset will eventually be saved as, e.g. "clay-headshot-600x800.jpg" */
  filename: string;
  /** Final display dimensions, e.g. 600 x 800 */
  width: number;
  height: number;
  /** Human-readable description — what this space will contain */
  label: string;
  className?: string;
  /** Optional: override to "contain" the max rendered size */
  maxWidthClass?: string;
  /** Optional rounded corner */
  rounded?: "none" | "md" | "lg" | "xl" | "full";
};

export function VisualPlaceholder({
  filename,
  width,
  height,
  label,
  className,
  maxWidthClass,
  rounded = "lg",
}: VisualPlaceholderProps) {
  const [errored, setErrored] = useState(false);
  const aspectRatio = `${width} / ${height}`;
  const roundedClass = {
    none: "rounded-none",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  }[rounded];

  if (!errored) {
    return (
      <img
        src={`/${filename}`}
        alt={label}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        data-placeholder-filename={filename}
        data-placeholder-dimensions={`${width}x${height}`}
        onError={() => setErrored(true)}
        className={cn(
          "block h-auto w-full object-cover",
          roundedClass,
          maxWidthClass,
          className
        )}
        style={{ aspectRatio }}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}`}
      data-placeholder-filename={filename}
      data-placeholder-dimensions={`${width}x${height}`}
      className={cn(
        "flex items-center justify-center border-2 border-dashed",
        "bg-[hsl(var(--placeholder-bg))] border-[hsl(var(--placeholder-border))] text-[hsl(var(--placeholder-label))]",
        "px-6 py-8 text-center overflow-hidden",
        roundedClass,
        maxWidthClass,
        className
      )}
      style={{ aspectRatio }}
    >
      <div className="flex flex-col items-center gap-1.5 max-w-full">
        <span className="font-heading text-xs uppercase tracking-widest opacity-60">
          Placeholder
        </span>
        <span className="font-sans text-sm font-medium leading-tight">
          {label}
        </span>
        <span className="font-mono text-[0.7rem] opacity-70 break-all">
          {filename}
        </span>
        <span className="font-mono text-[0.65rem] opacity-50">
          {width} × {height}
        </span>
      </div>
    </div>
  );
}
