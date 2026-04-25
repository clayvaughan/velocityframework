import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle } from "lucide-react";
import {
  getTrustBuildingScriptDownload,
  isStorageConfigured,
} from "@/lib/trust-building-script/storage";
import { PdfDownloadInline } from "@/components/PdfDownloadButton";

export const metadata: Metadata = {
  title: "Your Sample Trust-Building Script download",
};

type Params = Promise<{ id: string }>;

export default async function TrustBuildingScriptThanksPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  if (!isStorageConfigured()) return <StorageNotConfigured />;

  const res = await getTrustBuildingScriptDownload(id);
  if (!res.ok) return <ThanksError />;
  if (!res.data) notFound();
  const row = res.data;

  const pdfUrl = `/api/sample-trust-building-script/download/${id}`;

  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-3xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Your download is ready
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-4xl md:text-6xl uppercase tracking-wider leading-[0.95]">
            Here&rsquo;s the Sample Trust-Building Script.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Thanks, {row.first_name}. The PDF opens with the How-To-Use
            intro, walks through all ten coached sections of the actual
            venue-tour script, and closes with the best practices Luke has
            refined across every FRE rollout.
          </p>
          <PdfDownloadInline
            url={pdfUrl}
            filename={`velocity-sample-trust-building-script-${id}.pdf`}
            size="lg"
            className="mt-8"
          >
            Download PDF
          </PdfDownloadInline>
          <p className="mt-4 text-xs text-muted-foreground">
            A copy has been sent to your email.
          </p>
        </div>
      </section>

      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide max-w-3xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent">
            Next move · Messaging & Proof Checklist
          </p>
          <h2 className="mt-3 font-velocity text-primary-foreground text-3xl md:text-4xl uppercase tracking-wider leading-tight">
            The script only works if your messaging is dialed.
          </h2>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            Build your Messaging & Proof Checklist to make sure your
            one-liner, case studies, and CTAs all point in the same
            direction. Then take the Sample Trust-Building Script into
            your next high-stakes conversation.
          </p>
          <div className="mt-6">
            <Link
              href="/messaging-proof-checklist"
              className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 font-heading text-sm uppercase tracking-wide shadow-card transition-smooth hover:bg-accent-dark hover:shadow-glow"
            >
              Build your Messaging Checklist →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function StorageNotConfigured() {
  return (
    <section className="section-padding bg-gradient-hero">
      <div className="container-narrow max-w-xl text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-accent-dark" />
        <h1 className="mt-4 font-velocity text-foreground text-4xl uppercase tracking-wider">
          Storage not configured
        </h1>
      </div>
    </section>
  );
}

function ThanksError() {
  return (
    <section className="section-padding bg-gradient-hero">
      <div className="container-narrow max-w-xl text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
        <h1 className="mt-4 font-velocity text-foreground text-4xl uppercase tracking-wider">
          Couldn&rsquo;t load your download
        </h1>
      </div>
    </section>
  );
}
