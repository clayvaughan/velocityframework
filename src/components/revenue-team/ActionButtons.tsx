"use client";

import { useState } from "react";
import { Calendar, Check, Copy, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  pdfUrl: string;
  teamMailtoUrl: string;
  shareUrl: string;
  googleCalendarUrls: { weekly: string; r1: string; r2: string; r3: string };
  outlookCalendarUrls: { weekly: string; r1: string; r2: string; r3: string };
};

export function ActionButtons({
  pdfUrl,
  teamMailtoUrl,
  shareUrl,
  googleCalendarUrls,
  outlookCalendarUrls,
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
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          eyebrow="Report"
          title="Download PDF"
          description="Branded map — seats, missions, metrics, responsibilities, meeting agenda, reflection rhythm."
          icon={<Download className="h-5 w-5" />}
          href={pdfUrl}
          download
        />
        <Card
          eyebrow="Team"
          title="Email to revenue team"
          description="Pre-drafted note with the shareable link, ready to paste into your next revenue team meeting."
          icon={<Mail className="h-5 w-5" />}
          href={teamMailtoUrl}
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
            Bookmarkable, shareable with your revenue team.
          </p>
          <Button type="button" variant="cta" size="sm" onClick={copyLink} className="mt-auto">
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6">
        <div className="flex items-center gap-2 font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
          <Calendar className="h-4 w-4" />
          Calendar · Weekly meeting + reflection dates
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          One link for the recurring weekly meeting plus three one-off events
          for each reflection date.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <p className="font-heading text-[0.65rem] uppercase tracking-widest text-foreground">
              Google Calendar
            </p>
            <ul className="mt-2 space-y-2 text-xs">
              <CalendarLink href={googleCalendarUrls.weekly} label="+ Weekly Revenue Team Meeting (recurring)" />
              <CalendarLink href={googleCalendarUrls.r1} label="+ First reflection" />
              <CalendarLink href={googleCalendarUrls.r2} label="+ Second reflection" />
              <CalendarLink href={googleCalendarUrls.r3} label="+ Third reflection" />
            </ul>
          </div>
          <div>
            <p className="font-heading text-[0.65rem] uppercase tracking-widest text-foreground">
              Outlook Calendar
            </p>
            <ul className="mt-2 space-y-2 text-xs">
              <CalendarLink href={outlookCalendarUrls.weekly} label="+ Weekly Revenue Team Meeting" />
              <CalendarLink href={outlookCalendarUrls.r1} label="+ First reflection" />
              <CalendarLink href={outlookCalendarUrls.r2} label="+ Second reflection" />
              <CalendarLink href={outlookCalendarUrls.r3} label="+ Third reflection" />
            </ul>
            <p className="mt-2 text-[0.65rem] text-muted-foreground italic">
              Outlook doesn&rsquo;t support recurring rules via deep link — set
              weekly recurrence manually when the event opens.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function CalendarLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-md border border-border bg-background px-3 py-2 text-muted-foreground hover:text-foreground hover:border-accent/60 transition-smooth"
      >
        {label}
      </a>
    </li>
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
