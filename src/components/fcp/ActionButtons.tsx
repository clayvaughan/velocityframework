"use client";

import { useState } from "react";
import { Calendar, Check, Copy, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  pdfUrl: string;
  leadershipMailtoUrl: string;
  shareUrl: string;
  revisitGoogleUrl: string;
};

export function ActionButtons({
  pdfUrl,
  leadershipMailtoUrl,
  shareUrl,
  revisitGoogleUrl,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card
        eyebrow="Report"
        title="Download PDF"
        description="Branded worksheet PDF — your FCPs, scope guardrails, and summary table."
        icon={<Download className="h-5 w-5" />}
        href={pdfUrl}
        download
      />
      <Card
        eyebrow="Team"
        title="Email my leadership team"
        description="Pre-drafted note with a link to the worksheet for review."
        icon={<Mail className="h-5 w-5" />}
        href={leadershipMailtoUrl}
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
          The link opens this same page — bookmarkable, shareable with your
          team.
        </p>
        <Button type="button" variant="cta" size="sm" onClick={copyLink} className="mt-auto">
          {copied ? "Copied" : "Copy link"}
        </Button>
      </div>
      <Card
        eyebrow="Calendar"
        title="Revisit in 90 days"
        description="Adds a Google Calendar event 90 days out to re-read and refine."
        icon={<Calendar className="h-5 w-5" />}
        href={revisitGoogleUrl}
        target="_blank"
      />
    </div>
  );
}

function Card({
  eyebrow,
  title,
  description,
  icon,
  href,
  target,
  download,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  target?: string;
  download?: boolean;
}) {
  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      download={download ? true : undefined}
      className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-2 font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
        {icon}
        {eyebrow}
      </div>
      <h3 className="font-heading text-lg uppercase tracking-wide text-foreground">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <span className="mt-auto inline-flex items-center gap-1 font-heading text-[0.7rem] uppercase tracking-widest text-accent-dark">
        Open →
      </span>
    </a>
  );
}
