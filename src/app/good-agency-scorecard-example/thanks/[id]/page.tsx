import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle } from "lucide-react";
import {
  getScorecardDownload,
  isStorageConfigured,
} from "@/lib/scorecard-example/storage";
import { PdfDownloadInline } from "@/components/PdfDownloadButton";

export const metadata: Metadata = {
  title: "Your Good Agency Scorecard Example download",
};

type Params = Promise<{ id: string }>;

export default async function ScorecardExampleThanksPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  if (!isStorageConfigured()) return <StorageNotConfigured />;

  const res = await getScorecardDownload(id);
  if (!res.ok) return <ThanksError />;
  if (!res.data) notFound();
  const row = res.data;

  const pdfUrl = `/api/good-agency-scorecard-example/download/${id}`;

  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-3xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Your download is ready
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-4xl md:text-6xl uppercase tracking-wider leading-[0.95]">
            Here&rsquo;s your Good Agency Scorecard Example.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Thanks, {row.first_name}. The PDF opens with the Jane Doe /
            Director of Operations example and the framework you can adapt
            for any role on your team.
          </p>
          <PdfDownloadInline
            url={pdfUrl}
            filename={`velocity-scorecard-example-${id}.pdf`}
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
            Next move · Leadership Accountability Map
          </p>
          <h2 className="mt-3 font-velocity text-primary-foreground text-3xl md:text-4xl uppercase tracking-wider leading-tight">
            A scorecard only works if the role has clear ownership.
          </h2>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            Build your Leadership Accountability Map to define who owns what
            before you score it. Name every seat in the business first —
            mission, responsibilities, accountability — then adapt this
            scorecard for each one.
          </p>
          <div className="mt-6">
            <Link
              href="/leadership-accountability-map"
              className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 font-heading text-sm uppercase tracking-wide shadow-card transition-smooth hover:bg-accent-dark hover:shadow-glow"
            >
              Build your Accountability Map →
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
