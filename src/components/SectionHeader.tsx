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
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "start",
  as = "h2",
  className,
}: SectionHeaderProps) {
  const Heading = as;
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
          {eyebrow}
        </p>
      ) : null}
      <Heading
        className={cn(
          as === "h2"
            ? "mt-3 font-velocity text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider"
            : "mt-3 font-heading text-2xl md:text-3xl uppercase tracking-wide"
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
