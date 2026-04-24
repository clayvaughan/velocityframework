"use client";

import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfDownloadButton } from "@/components/PdfDownloadButton";
import { EmailActions } from "@/components/EmailActions";

type Props = {
  googleCalendarUrl: string;
  outlookCalendarUrl: string;
  pdfUrl: string;
  pdfFilename: string;
  leadershipEmail: { subject: string; body: string };
  partnerEmail: { subject: string; body: string; to: string } | null;
};

export function ActionButtons({
  googleCalendarUrl,
  outlookCalendarUrl,
  pdfUrl,
  pdfFilename,
  leadershipEmail,
  partnerEmail,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <CalendarCard
        title="Add to Google Calendar"
        description="Adds your weekly check-in (recurring), reassessment, and 7-day deadline."
        href={googleCalendarUrl}
      />
      <CalendarCard
        title="Add to Outlook Calendar"
        description="Same three events. Set weekly recurrence in Outlook after creating."
        href={outlookCalendarUrl}
      />
      <PdfDownloadButton
        url={pdfUrl}
        filename={pdfFilename}
        description="Branded 5-page plan to share with your leadership team."
      />
      <EmailActions
        subject={leadershipEmail.subject}
        body={leadershipEmail.body}
        title="Email my leadership team"
        description="Pre-drafted announcement with your focus areas and weekly rhythm."
      />
      {partnerEmail ? (
        <div className="sm:col-span-2 lg:col-span-4">
          <EmailActions
            subject={partnerEmail.subject}
            body={partnerEmail.body}
            to={partnerEmail.to}
            title="Invite your accountability partner"
            description={`Pre-drafted invite to ${partnerEmail.to} asking them to check in with you weekly.`}
          />
        </div>
      ) : null}
    </div>
  );
}

function CalendarCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-2 font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
        <Calendar className="h-5 w-5" />
        <span>Calendar</span>
      </div>
      <h3 className="font-heading text-lg uppercase tracking-wide text-foreground">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Button variant="cta" size="sm" asChild={false} type="button" tabIndex={-1} className="mt-auto pointer-events-none">
        Open
      </Button>
    </a>
  );
}
