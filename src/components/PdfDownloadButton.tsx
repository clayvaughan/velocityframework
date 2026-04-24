"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  url: string;
  filename: string;
  eyebrow?: string;
  title?: string;
  description: string;
};

export function usePdfDownload(url: string, filename: string) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function start() {
    if (state === "loading") return;
    setState("loading");
    setMessage(null);
    try {
      const res = await fetch(url, { cache: "no-store" });
      const contentType = res.headers.get("content-type") ?? "";
      if (!res.ok || !contentType.includes("application/pdf")) {
        let error = "Download isn't ready yet. Try again in a moment.";
        if (contentType.includes("application/json")) {
          try {
            const body = (await res.json()) as { error?: string };
            if (body.error) error = body.error;
          } catch {}
        }
        setState("error");
        setMessage(error);
        return;
      }
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      setState("idle");
    } catch {
      setState("error");
      setMessage("Network error — please retry.");
    }
  }

  return { state, message, start };
}

export function PdfDownloadButton({
  url,
  filename,
  eyebrow = "Report",
  title = "Download PDF",
  description,
}: Props) {
  const { state, message, start } = usePdfDownload(url, filename);

  return (
    <button
      type="button"
      onClick={start}
      disabled={state === "loading"}
      className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-0.5 text-left disabled:opacity-70 disabled:cursor-wait"
    >
      <div className="flex items-center gap-2 font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
        <Download className="h-5 w-5" />
        {eyebrow}
      </div>
      <h3 className="font-heading text-lg uppercase tracking-wide text-foreground">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <span className="mt-auto inline-flex items-center gap-1 font-heading text-[0.7rem] uppercase tracking-widest text-accent-dark">
        {state === "loading" ? "Preparing…" : "Download →"}
      </span>
      {state === "error" && message ? (
        <span className="font-heading text-[0.7rem] uppercase tracking-widest text-destructive">
          {message}
        </span>
      ) : null}
    </button>
  );
}

type InlineProps = {
  url: string;
  filename: string;
  children: React.ReactNode;
  variant?: "cta" | "outline" | "link";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function PdfDownloadInline({
  url,
  filename,
  children,
  variant = "cta",
  size = "md",
  className,
}: InlineProps) {
  const { state, message, start } = usePdfDownload(url, filename);
  return (
    <div className={className}>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={start}
        disabled={state === "loading"}
      >
        <Download className="h-4 w-4" />
        {state === "loading" ? "Preparing…" : children}
      </Button>
      {state === "error" && message ? (
        <p className="mt-2 font-heading text-[0.7rem] uppercase tracking-widest text-destructive">
          {message}
        </p>
      ) : null}
    </div>
  );
}
