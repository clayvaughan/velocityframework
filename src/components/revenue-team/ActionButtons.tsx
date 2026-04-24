"use client";

import { useState } from "react";
import { Calendar, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfDownloadButton } from "@/components/PdfDownloadButton";
import { EmailActions } from "@/components/EmailActions";

type Props = {
  pdfUrl: string;
  pdfFilename: string;
  teamEmail: { subject: string; body: string };
  shareUrl: string;
  googleCalendarUrls: { weekly: string; r1: string; r2: string; r3: string };
  outlookCalendarUrls: { weekly: string; r1: string; r2: string; r3: string };
};

export function ActionButtons({
  pdfUrl,
  pdfFilename,
  teamEmail,
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
        <PdfDownloadButton
          url={pdfUrl}
          filename={pdfFilename}
          description="Branded map — seats, missions, metrics, responsibilities, meeting agenda, reflection rhythm."
        />
        <EmailActions
          subject={teamEmail.subject}
          body={teamEmail.body}
          title="Email to revenue team"
          description="Pre-drafted note with the shareable link, ready for your next revenue team meeting."
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
