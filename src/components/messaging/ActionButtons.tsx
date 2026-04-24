"use client";

import { useState } from "react";
import { Calendar, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfDownloadButton } from "@/components/PdfDownloadButton";
import { EmailActions } from "@/components/EmailActions";

type Props = {
  pdfUrl: string;
  pdfFilename: string;
  leadershipEmail: { subject: string; body: string };
  shareUrl: string;
  reviewGoogleUrl: string;
};

export function ActionButtons({
  pdfUrl,
  pdfFilename,
  leadershipEmail,
  shareUrl,
  reviewGoogleUrl,
}: Props) {
  const [copied, setCopied] = useState(false);
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <PdfDownloadButton
        url={pdfUrl}
        filename={pdfFilename}
        description="8-page branded checklist — one-liner, message map, case study, audit, CTA map."
      />
      <EmailActions
        subject={leadershipEmail.subject}
        body={leadershipEmail.body}
        title="Email my team"
        description="Pre-drafted note with a link to the checklist and your locked one-liner."
      />
      <div className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-0.5">
        <div className="flex items-center gap-2 font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
          {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          Share
        </div>
        <h3 className="font-heading text-lg uppercase tracking-wide text-foreground">
          {copied ? "Copied to clipboard" : "Copy shareable link"}
        </h3>
        <p className="text-sm text-muted-foreground">
          Bookmarkable, shareable with your team.
        </p>
        <Button type="button" variant="cta" size="sm" onClick={copyLink} className="mt-auto">
          {copied ? "Copied" : "Copy link"}
        </Button>
      </div>
      <a
        href={reviewGoogleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-0.5"
      >
        <div className="flex items-center gap-2 font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
          <Calendar className="h-5 w-5" />
          Calendar
        </div>
        <h3 className="font-heading text-lg uppercase tracking-wide text-foreground">
          Schedule 30-day review
        </h3>
        <p className="text-sm text-muted-foreground">
          Adds a Google Calendar event 30 days out to re-audit your collateral and iterate.
        </p>
        <span className="mt-auto inline-flex items-center gap-1 font-heading text-[0.7rem] uppercase tracking-widest text-accent-dark">
          Open →
        </span>
      </a>
    </div>
  );
}
