"use client";

import { Calendar, Download, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  googleCalendarUrl: string;
  outlookCalendarUrl: string;
  pdfUrl: string;
  leadershipMailtoUrl: string;
  partnerMailtoUrl: string | null;
};

export function ActionButtons({
  googleCalendarUrl,
  outlookCalendarUrl,
  pdfUrl,
  leadershipMailtoUrl,
  partnerMailtoUrl,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <ActionCard
        eyebrow="Calendar"
        title="Add to Google Calendar"
        description="Adds your weekly check-in (recurring), reassessment, and 7-day deadline."
        icon={<Calendar className="h-5 w-5" />}
        href={googleCalendarUrl}
        target="_blank"
      />
      <ActionCard
        eyebrow="Calendar"
        title="Add to Outlook Calendar"
        description="Same three events. Set weekly recurrence in Outlook after creating."
        icon={<Calendar className="h-5 w-5" />}
        href={outlookCalendarUrl}
        target="_blank"
      />
      <ActionCard
        eyebrow="Report"
        title="Download PDF"
        description="Branded 5-page plan to share with your leadership team."
        icon={<Download className="h-5 w-5" />}
        href={pdfUrl}
        download
      />
      <ActionCard
        eyebrow="Communicate"
        title="Email my leadership team"
        description="Opens your mail client with a pre-drafted announcement."
        icon={<Mail className="h-5 w-5" />}
        href={leadershipMailtoUrl}
      />
      {partnerMailtoUrl ? (
        <div className="sm:col-span-2 lg:col-span-4">
          <ActionCard
            wide
            eyebrow="Accountability"
            title="Invite your accountability partner"
            description="Pre-drafted invite asking them to check in with you weekly."
            icon={<Send className="h-5 w-5" />}
            href={partnerMailtoUrl}
          />
        </div>
      ) : null}
    </div>
  );
}

function ActionCard({
  eyebrow,
  title,
  description,
  icon,
  href,
  target,
  download,
  wide,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  target?: string;
  download?: boolean;
  wide?: boolean;
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
        <span>{eyebrow}</span>
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
