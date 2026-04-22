import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillarTag } from "@/components/PillarTag";
import { SectionHeader } from "@/components/SectionHeader";
import { HubSpotFormSlot } from "@/components/HubSpotFormSlot";
import { ResourceCard } from "@/components/ResourceCard";
import { VisualPlaceholder } from "@/components/VisualPlaceholder";
import {
  resources,
  resourceBySlug,
  resourcesByPillar,
} from "@/lib/resources";

export function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const resource = resourceBySlug(slug);
  if (!resource) return { title: "Resource not found" };
  return {
    title: resource.title,
    description: resource.hook,
  };
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = resourceBySlug(slug);
  if (!resource) notFound();
  // Live interactive tools (e.g., Culture Action Plan) redirect straight to
  // their real route instead of rendering the generic placeholder detail.
  if (resource.externalHref) redirect(resource.externalHref);

  const related = resourcesByPillar(resource.pillar)
    .filter((r) => r.slug !== resource.slug)
    .slice(0, 3);

  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide grid gap-12 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <Button asChild variant="link" size="sm">
              <Link href="/toolbox">
                <ArrowLeft className="h-3.5 w-3.5" />
                All resources
              </Link>
            </Button>

            <div className="flex flex-wrap items-center gap-3">
              <PillarTag pillar={resource.pillar} />
              <span className="font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground">
                No. {resource.number} · {resource.format}
              </span>
            </div>

            <h1 className="font-velocity text-foreground text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider leading-[1]">
              {resource.title}
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-xl">
              {resource.hook}
            </p>

            <dl className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 text-sm border-t border-border">
              <div>
                <dt className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  Format
                </dt>
                <dd className="mt-1">{resource.format}</dd>
              </div>
              <div>
                <dt className="font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  Ownership
                </dt>
                <dd className="mt-1">{resource.owner}</dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-5">
            <VisualPlaceholder
              filename={`toolbox-cover-${resource.slug}-800x1000.jpg`}
              width={800}
              height={1000}
              label={`${resource.title} — cover artwork`}
              rounded="xl"
            />
          </div>
        </div>
      </section>

      {/* ---------- Download form ---------- */}
      <section className="section-padding bg-gradient-download">
        <div className="container-narrow">
          <SectionHeader
            tone="dark"
            align="center"
            eyebrow="Free download"
            title="Grab your copy"
            description="Enter your details and we'll send the PDF to your inbox. You'll also be enrolled in a short nurture sequence tied to this resource."
          />
          <div className="mt-10">
            <HubSpotFormSlot
              formKey={`resource_download_${resource.slug.replace(/-/g, "_")}`}
              heading={`Send me the ${resource.title}`}
              subheading="Tagged with resources_downloaded, pillar_interest, lifecycle: Subscriber"
              fields={[
                { name: "firstname", label: "First name", required: true },
                { name: "lastname", label: "Last name" },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "company", label: "Company" },
                { name: "role", label: "Your role" },
              ]}
              workflow={resource.hubspotWorkflowKey}
              submitLabel="Email me the PDF"
            />
            <p className="mt-4 text-xs text-muted-foreground text-center">
              The PDF is currently a placeholder — real content ships soon.
              Fill out the form anyway and we&rsquo;ll send the final version
              the moment it&rsquo;s live.
            </p>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="section-padding bg-gradient-download">
          <div className="container-wide">
            <SectionHeader
              tone="dark"
              eyebrow={`More ${resource.pillar} downloads`}
              title="Related resources"
            />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <ResourceCard key={r.slug} resource={r} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
