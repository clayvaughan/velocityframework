"use client";

/**
 * AIAssist — shared UI for the AI Polish feature.
 *
 * Two delivery paths surface from one component:
 *   1. "Copy AI Prompt"   → POST /api/ai/prompt   (no API cost, always available)
 *   2. "Generate AI Cleanup" → POST /api/ai/cleanup (rate-limited, hidden when AI not configured)
 *
 * Version history is session-only: up to 5 most-recent generations live in
 * React state, the oldest drops when the buffer fills, and navigating away
 * clears the buffer. Users who want to keep a version can either copy it to
 * clipboard or persist it to their PDF via "Add to my PDF".
 *
 * Reuse: any tool can mount this by passing { tool, userId, aiCleanupAvailable }.
 * The server-side API routes look up the tool name in a registry to fetch
 * the right user data and prompt template.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Copy,
  Check,
  FileDown,
  RotateCcw,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LOADING_MESSAGES = [
  "Reading your messaging…",
  "Polishing the language…",
  "Almost there…",
] as const;

const MAX_ATTEMPTS = 5;
const LOADING_CYCLE_MS = 3000;
const COPY_FEEDBACK_MS = 2000;

export type AIAssistProps = {
  /** Tool registry key, e.g. "messaging-checklist". Server routes use this to look up the right prompt template + storage adapter. */
  tool: string;
  /** Saved-row id, e.g. the checklist UUID. */
  userId: string;
  /** True when ANTHROPIC_API_KEY is set on the server. False = hide "Generate AI Cleanup" button; "Copy AI Prompt" still works. */
  aiCleanupAvailable: boolean;
  /** Text of a previously-saved polished version. When the active attempt's text matches this, the "Add to my PDF" button shows the saved state. */
  initialSavedText?: string | null;
};

type Attempt = {
  text: string;
  generatedAt: number;
  inputTokens: number;
  outputTokens: number;
};

type Mode =
  | { kind: "idle" }
  | { kind: "generating" }
  | { kind: "result" }
  | { kind: "error"; message: string }
  | { kind: "rate-limited"; message: string };

export function AIAssist({
  tool,
  userId,
  aiCleanupAvailable,
  initialSavedText = null,
}: AIAssistProps) {
  const [mode, setMode] = useState<Mode>({ kind: "idle" });
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [savedText, setSavedText] = useState<string | null>(initialSavedText);
  const [savingToPdf, setSavingToPdf] = useState(false);
  const [copyState, setCopyState] = useState<"none" | "version" | "prompt">(
    "none"
  );
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  // Cycle the loading text every 3s while a request is in flight.
  useEffect(() => {
    if (mode.kind !== "generating") return;
    setLoadingMsgIndex(0);
    const id = setInterval(() => {
      setLoadingMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, LOADING_CYCLE_MS);
    return () => clearInterval(id);
  }, [mode.kind]);

  // Fade copy-feedback states back to "none" after a beat.
  useEffect(() => {
    if (copyState === "none") return;
    const id = setTimeout(() => setCopyState("none"), COPY_FEEDBACK_MS);
    return () => clearTimeout(id);
  }, [copyState]);

  const activeAttempt = useMemo(
    () => (attempts.length > 0 ? attempts[activeIndex] : null),
    [attempts, activeIndex]
  );
  const activeIsSaved =
    activeAttempt !== null &&
    savedText !== null &&
    activeAttempt.text === savedText;

  const handleCopyPrompt = useCallback(async () => {
    try {
      const res = await fetch("/api/ai/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, userId }),
      });
      if (!res.ok) throw new Error(`Prompt fetch failed: ${res.status}`);
      const data = (await res.json()) as { text: string };
      await navigator.clipboard.writeText(data.text);
      setCopyState("prompt");
    } catch (e) {
      console.error("[ai-assist] copy prompt failed", e);
      setMode({
        kind: "error",
        message: "Couldn't generate the prompt. Please try again.",
      });
    }
  }, [tool, userId]);

  const handleGenerate = useCallback(async () => {
    setMode({ kind: "generating" });
    try {
      const res = await fetch("/api/ai/cleanup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, userId }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setMode({
          kind: "rate-limited",
          message:
            typeof data.error === "string"
              ? data.error
              : "AI cleanup is at capacity right now. Try again later, or copy the AI Prompt below.",
        });
        return;
      }
      if (!res.ok) {
        setMode({
          kind: "error",
          message:
            typeof data.error === "string"
              ? data.error
              : "Claude returned an error. Try again, or copy the AI Prompt below.",
        });
        return;
      }
      const newAttempt: Attempt = {
        text: String(data.text ?? ""),
        generatedAt: Date.now(),
        inputTokens: Number(data.inputTokens ?? 0),
        outputTokens: Number(data.outputTokens ?? 0),
      };
      // Determine the new active index BEFORE setState calls so it's stable
      // regardless of batching order.
      const nextLength = Math.min(MAX_ATTEMPTS, attempts.length + 1);
      setAttempts((prev) => {
        const appended = [...prev, newAttempt];
        return appended.length > MAX_ATTEMPTS
          ? appended.slice(appended.length - MAX_ATTEMPTS)
          : appended;
      });
      setActiveIndex(nextLength - 1);
      setMode({ kind: "result" });
    } catch (e) {
      console.error("[ai-assist] generate failed", e);
      setMode({
        kind: "error",
        message:
          "Couldn't reach Claude. Check your connection and try again, or copy the AI Prompt below.",
      });
    }
  }, [tool, userId, attempts.length]);

  const handleCopyVersion = useCallback(async () => {
    if (!activeAttempt) return;
    try {
      await navigator.clipboard.writeText(activeAttempt.text);
      setCopyState("version");
    } catch (e) {
      console.error("[ai-assist] copy version failed", e);
    }
  }, [activeAttempt]);

  const handleSaveToPdf = useCallback(async () => {
    if (!activeAttempt) return;
    setSavingToPdf(true);
    try {
      const res = await fetch("/api/ai/save-version", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, userId, text: activeAttempt.text }),
      });
      if (!res.ok) {
        throw new Error(`save failed: ${res.status}`);
      }
      setSavedText(activeAttempt.text);
    } catch (e) {
      console.error("[ai-assist] save to pdf failed", e);
      setMode({
        kind: "error",
        message:
          "Couldn't add this version to your PDF right now. Please try again.",
      });
    } finally {
      setSavingToPdf(false);
    }
  }, [activeAttempt, tool, userId]);

  const handlePrev = useCallback(() => {
    setActiveIndex((i) => Math.max(0, i - 1));
  }, []);
  const handleNext = useCallback(() => {
    setActiveIndex((i) => Math.min(attempts.length - 1, i + 1));
  }, [attempts.length]);

  const isGenerating = mode.kind === "generating";
  const showVersionUI = attempts.length > 0 && mode.kind === "result";

  return (
    <div className="rounded-2xl border-2 border-accent/40 bg-card p-6 md:p-10 shadow-card">
      {/* Header */}
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-accent-dark"
        >
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
            AI Polish · powered by Claude
          </p>
          <h3 className="mt-2 font-velocity text-foreground text-2xl md:text-3xl uppercase tracking-wider leading-tight">
            Polish your messaging in one click.
          </h3>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground leading-relaxed">
            Get a polished version of your messaging with grammar fixes,
            gap-filling, and tightened language. Free, optional, and your
            inputs aren&rsquo;t stored beyond this session.
          </p>
        </div>
      </div>

      {/* Buttons row — always rendered while idle/result; hidden mid-generate */}
      {!isGenerating && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {aiCleanupAvailable && (
            <Button
              variant="cta"
              size="md"
              onClick={handleGenerate}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {attempts.length > 0 ? "Generate again" : "Generate AI Cleanup"}
            </Button>
          )}
          <Button
            variant="gold-outline"
            size="md"
            onClick={handleCopyPrompt}
            className="gap-2"
            aria-live="polite"
          >
            {copyState === "prompt" ? (
              <>
                <Check className="h-4 w-4" />
                Prompt copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy AI Prompt
              </>
            )}
          </Button>
          {!aiCleanupAvailable && (
            <p className="text-xs text-muted-foreground">
              AI cleanup is temporarily unavailable. Use the Copy AI Prompt
              option to run this in your own AI tool.
            </p>
          )}
        </div>
      )}

      {/* Generating state */}
      {isGenerating && (
        <div
          className="mt-6 flex items-center gap-3 rounded-lg border border-accent/30 bg-accent/5 px-5 py-4"
          aria-live="polite"
        >
          <Loader2 className="h-5 w-5 animate-spin text-accent-dark" />
          <p className="font-heading text-sm uppercase tracking-wide text-foreground">
            {LOADING_MESSAGES[loadingMsgIndex]}
          </p>
        </div>
      )}

      {/* Rate-limit state */}
      {mode.kind === "rate-limited" && (
        <div
          className="mt-6 rounded-lg border border-warning/50 bg-warning/10 px-5 py-4"
          role="status"
        >
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 flex-none text-warning-foreground" />
            <div>
              <p className="font-heading text-xs uppercase tracking-widest text-warning-foreground">
                Cooldown
              </p>
              <p className="mt-1.5 text-sm text-foreground leading-relaxed">
                {mode.message}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Use <strong className="font-semibold">Copy AI Prompt</strong>{" "}
                above to run this in your own AI tool while you wait.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* API-error state */}
      {mode.kind === "error" && (
        <div
          className="mt-6 rounded-lg border border-destructive/50 bg-destructive/5 px-5 py-4"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-none text-destructive" />
            <div className="flex-1">
              <p className="font-heading text-xs uppercase tracking-widest text-destructive">
                Couldn&rsquo;t generate
              </p>
              <p className="mt-1.5 text-sm text-foreground leading-relaxed">
                {mode.message}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                The <strong className="font-semibold">Copy AI Prompt</strong>{" "}
                option above always works — paste it into any AI tool to get
                the same kind of polish.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Result + version UI — only shown when we have attempts */}
      {showVersionUI && activeAttempt && (
        <div className="mt-6 space-y-4">
          {/* Version nav strip */}
          {attempts.length > 1 && (
            <div className="flex items-center justify-between gap-3 border-y border-border py-2.5">
              <button
                type="button"
                onClick={handlePrev}
                disabled={activeIndex === 0}
                aria-label="Previous attempt"
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-md transition-smooth",
                  activeIndex === 0
                    ? "text-muted-foreground/40 cursor-not-allowed"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <p className="font-heading text-[0.7rem] uppercase tracking-widest text-muted-foreground">
                Attempt {activeIndex + 1} of {attempts.length}
              </p>
              <button
                type="button"
                onClick={handleNext}
                disabled={activeIndex >= attempts.length - 1}
                aria-label="Next attempt"
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-md transition-smooth",
                  activeIndex >= attempts.length - 1
                    ? "text-muted-foreground/40 cursor-not-allowed"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Rendered Markdown */}
          <article className="ai-assist-result rounded-lg border border-border bg-background/40 p-5 md:p-6">
            <ReactMarkdown components={MARKDOWN_COMPONENTS}>
              {activeAttempt.text}
            </ReactMarkdown>
          </article>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="cta"
              size="md"
              onClick={handleCopyVersion}
              className="gap-2"
              aria-live="polite"
            >
              {copyState === "version" ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy this version
                </>
              )}
            </Button>
            <Button
              variant={activeIsSaved ? "success" : "gold-outline"}
              size="md"
              onClick={handleSaveToPdf}
              disabled={activeIsSaved || savingToPdf}
              className="gap-2"
              aria-live="polite"
            >
              {activeIsSaved ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved to PDF
                </>
              ) : savingToPdf ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4" />
                  Add to my PDF
                </>
              )}
            </Button>
            <Button
              variant="link"
              size="md"
              onClick={handleGenerate}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Regenerate
            </Button>
          </div>

          {/* Tiny meta line */}
          <p className="text-xs text-muted-foreground">
            {attempts.length} of {MAX_ATTEMPTS} attempts kept this session.
            History clears when you leave this page.
          </p>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// Markdown renderer — match the Velocity design system. No custom HTML allowed
// (react-markdown's default), so model output can't sneak in <script> tags.
// ----------------------------------------------------------------------------

const MARKDOWN_COMPONENTS = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="font-velocity text-foreground text-3xl uppercase tracking-wider mt-6 mb-3 first:mt-0 leading-tight">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="font-velocity text-foreground text-xl uppercase tracking-wider mt-6 mb-3 first:mt-0 leading-tight">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="font-heading text-sm uppercase tracking-widest text-accent-dark mt-5 mb-2">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-foreground leading-relaxed mb-3 last:mb-0">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic text-foreground/85">{children}</em>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-4 border-accent pl-4 my-4 italic text-foreground/90">
      {children}
    </blockquote>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc pl-6 mb-3 space-y-1.5 text-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal pl-6 mb-3 space-y-1.5 text-foreground">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="font-mono text-[0.875em] bg-muted px-1.5 py-0.5 rounded">
      {children}
    </code>
  ),
  hr: () => <hr className="my-6 border-border" />,
  a: ({
    href,
    children,
  }: {
    href?: string;
    children?: React.ReactNode;
  }) => (
    <a
      href={href}
      className="text-accent-dark underline underline-offset-2 hover:text-accent"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
};
