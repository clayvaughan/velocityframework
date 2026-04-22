import { cn } from "@/lib/utils";

/**
 * SectionHeader — consistent eyebrow + heading pattern for interior sections.
 */
type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  className?: string;
  as?: "h2" | "h3";
  tone?: "light" | "dark";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "start",
  as = "h2",
  className,
  tone = "light",
}: SectionHeaderProps) {
  const Heading = as;
  const isDark = tone === "dark";
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "font-heading text-xs uppercase tracking-[0.25em]",
            isDark ? "text-accent" : "text-accent-dark"
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Heading
        className={cn(
          "mt-3 uppercase",
          as === "h2"
            ? "font-velocity text-4xl md:text-5xl lg:text-6xl tracking-wider"
            : "font-heading text-2xl md:text-3xl tracking-wide",
          isDark ? "text-primary-foreground" : "text-foreground"
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base md:text-lg leading-relaxed",
            isDark ? "text-primary-foreground/75" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
