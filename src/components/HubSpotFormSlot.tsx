import { cn } from "@/lib/utils";

/**
 * HubSpotFormSlot — placeholder for a HubSpot embedded form.
 *
 * Per the locked spec: site builds no native forms, uses no third-party form
 * service. Every form on velocityframework.com is a HubSpot embed. Until Abby
 * wires them, each slot renders as a visible labeled block showing:
 *   - which HubSpot form/workflow this is
 *   - which fields it will capture
 *   - which workflow it triggers
 *
 * The data-* attributes give Abby machine-readable targets to find and replace.
 */
type FieldSpec = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "select" | "textarea" | "checkbox";
  required?: boolean;
};

type HubSpotFormSlotProps = {
  /** Short name for this form, e.g. "homepage_newsletter". Used as data attribute. */
  formKey: string;
  /** Short headline shown above the form, e.g. "Get the next resource first" */
  heading: string;
  /** One-line subheading / compliance note */
  subheading?: string;
  /** Fields the form will capture */
  fields: FieldSpec[];
  /** HubSpot workflow key the submission triggers */
  workflow: string;
  /** Submit button label */
  submitLabel?: string;
  className?: string;
};

export function HubSpotFormSlot({
  formKey,
  heading,
  subheading,
  fields,
  workflow,
  submitLabel = "Submit",
  className,
}: HubSpotFormSlotProps) {
  return (
    <div
      role="region"
      aria-label={`HubSpot form placeholder: ${heading}`}
      data-hubspot-form-slot
      data-form-key={formKey}
      data-workflow={workflow}
      className={cn(
        "relative rounded-xl border-2 border-dashed border-accent/50 bg-card/60 p-6 md:p-8",
        "shadow-card",
        className
      )}
    >
      <div className="absolute -top-3 left-6 bg-background px-2 font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
        HubSpot form slot · {formKey}
      </div>

      <div className="space-y-1.5">
        <h3 className="font-heading text-lg md:text-xl tracking-wide text-foreground">
          {heading}
        </h3>
        {subheading ? (
          <p className="text-sm text-muted-foreground">{subheading}</p>
        ) : null}
      </div>

      <ul className="mt-5 space-y-2">
        {fields.map((f) => (
          <li
            key={f.name}
            className="flex items-center justify-between gap-3 rounded-md border border-border bg-background/60 px-3 py-2 text-xs"
          >
            <span className="font-medium">
              {f.label}
              {f.required ? <span className="text-accent-dark">*</span> : null}
            </span>
            <span className="font-mono text-muted-foreground opacity-70">
              {f.type ?? "text"}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex h-10 items-center rounded-lg bg-accent/90 px-5 font-heading uppercase tracking-wide text-accent-foreground">
          {submitLabel}
        </span>
        <span className="font-mono">
          → triggers <span className="text-foreground">{workflow}</span>
        </span>
      </div>
    </div>
  );
}
