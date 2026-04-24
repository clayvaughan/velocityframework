import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle } from "lucide-react";
import {
  getDashboardDownload,
  isStorageConfigured,
} from "@/lib/dashboard-example/storage";
import { PdfDownloadInline } from "@/components/PdfDownloadButton";

export const metadata: Metadata = {
  title: "Your Good Agency Dashboard Example download",
};

type Params = Promise<{ id: string }>;

export default async function DashboardExampleThanksPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  if (!isStorageConfigured()) return <StorageNotConfigured />;

  const res = await getDashboardDownload(id);
  if (!res.ok) return <ThanksError />;
  if (!res.data) notFound();
  const row = res.data;

  const pdfUrl = `/api/good-agency-dashboard-example/download/${id}`;

  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-3xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Your download is ready
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-4xl md:text-6xl uppercase tracking-wider leading-[0.95]">
            Here&rsquo;s your Good Agency Dashboard Example.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Thanks, {row.first_name}. The PDF opens with the framework and
            then walks all four dashboards with metrics, targets, and the
            commentary that explains why each one matters.
          </p>
          <PdfDownloadInline
            url={pdfUrl}
            filename={`velocity-dashboard-example-${id}.pdf`}
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
            Next move · Revenue Team Accountability Map
          </p>
          <h2 className="mt-3 font-velocity text-primary-foreground text-3xl md:text-4xl uppercase tracking-wider leading-tight">
            Want to know who owns each of these metrics?
          </h2>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            Build your Revenue Team Accountability Map — who&rsquo;s
            accountable for every number on the dashboard. Marketing, sales,
            RevOps, and account management as one revenue team, not four
            silos.
          </p>
          <div className="mt-6">
            <Link
              href="/revenue-team-accountability-map"
              className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 font-heading text-sm uppercase tracking-wide shadow-card transition-smooth hover:bg-accent-dark hover:shadow-glow"
            >
              Build your Revenue Team Map →
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-section">
        <div className="container-wide max-w-3xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Companion resource
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-3xl md:text-4xl uppercase tracking-wider leading-tight">
            Dashboards measure the company. Scorecards measure the person.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            Here&rsquo;s what one looks like — a real Director of Operations
            scorecard with core values, GWC, OKRs, KPIs, and the monthly
            review cadence that makes accountability real at the individual
            level.
          </p>
          <div className="mt-6">
            <Link
              href="/good-agency-scorecard-example"
              className="inline-flex items-center gap-2 rounded-lg border border-accent/60 bg-transparent text-foreground px-6 py-3 font-heading text-sm uppercase tracking-wide transition-smooth hover:bg-accent/10 hover:border-accent"
            >
              Download the Scorecard Example →
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
