"use client";

import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";

type Props = {
  subject: string;
  body: string;
  to?: string;
  title: string;
  description: string;
};

function gmailComposeUrl({
  subject,
  body,
  to = "",
}: {
  subject: string;
  body: string;
  to?: string;
}) {
  return (
    "https://mail.google.com/mail/?view=cm&fs=1" +
    `&to=${encodeURIComponent(to)}` +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`
  );
}

function mailtoUrl({
  subject,
  body,
  to = "",
}: {
  subject: string;
  body: string;
  to?: string;
}) {
  return (
    `mailto:${encodeURIComponent(to)}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`
  );
}

export function EmailActions({ subject, body, to, title, description }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      const text = `Subject: ${subject}\n\n${body}`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-0.5">
      <div className="flex items-center gap-2 font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
        <Mail className="h-5 w-5" />
        Team
      </div>
      <h3 className="font-heading text-lg uppercase tracking-wide text-foreground">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="mt-auto flex flex-col gap-2">
        <button
          type="button"
          onClick={copyEmail}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 font-heading text-[0.7rem] uppercase tracking-widest text-accent-dark hover:bg-accent/20 transition-smooth"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied to clipboard" : "Copy email"}
        </button>
        <a
          href={gmailComposeUrl({ subject, body, to })}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 font-heading text-[0.7rem] uppercase tracking-widest text-accent-dark hover:bg-accent/20 transition-smooth"
        >
          Open in Gmail
        </a>
        <a
          href={mailtoUrl({ subject, body, to })}
          className="inline-flex items-center justify-center rounded-md px-3 py-1.5 font-heading text-[0.65rem] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-smooth"
        >
          Open in default mail app
        </a>
      </div>
    </div>
  );
}
