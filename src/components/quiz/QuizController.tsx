"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LikertScale, type LikertValue } from "./LikertScale";
import { QuizProgress } from "./QuizProgress";
import {
  QUESTIONS,
  QUESTION_COUNT,
  getQuestionByOrder,
} from "@/lib/quiz/questions";

/**
 * Single question screen — client component.
 *
 * Manages the quiz's in-progress state in localStorage, keyed by the
 * `storageKey` passed in (different namespaces for individual vs. team
 * member flows). Back/forward nav persists answers. After the last question,
 * POSTs the full payload to `submitEndpoint` and redirects to the result
 * URL returned by the server.
 */

type StorageShape = {
  id: string;
  answers: Record<string, LikertValue>;
};

type Props = {
  /** 1-based question position this screen is rendering. */
  order: number;
  /**
   * Localstorage namespace. Pass e.g. `quiz-individual` for individual flow
   * and `quiz-team-<nanoid>` for team-member flow.
   */
  storageKey: string;
  /** POST target that accepts { id, answers } and returns { resultUrl } or { error }. */
  submitEndpoint: string;
  /**
   * Template for question-screen URLs. Must contain literal `{n}` which is
   * replaced with the 1-based question number. Passed as a string (not a
   * function) so this component can receive it across the server/client
   * boundary.
   */
  questionPathTemplate: string;
  /**
   * If no session id is found in localStorage, redirect here. Prevents users
   * from deep-linking past the email-capture step.
   */
  startPath: string;
};

function readSession(key: string): StorageShape | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StorageShape;
    if (!parsed?.id) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeSession(key: string, s: StorageShape) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(s));
}

export function QuizController({
  order,
  storageKey,
  submitEndpoint,
  questionPathTemplate,
  startPath,
}: Props) {
  const questionPath = (n: number) =>
    questionPathTemplate.replace("{n}", String(n));
  const router = useRouter();
  const question = useMemo(() => getQuestionByOrder(order), [order]);
  const [session, setSession] = useState<StorageShape | null>(null);
  const [value, setValue] = useState<LikertValue | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load session + previously-answered value on mount / route change
  useEffect(() => {
    const s = readSession(storageKey);
    if (!s) {
      router.replace(startPath);
      return;
    }
    setSession(s);
    const previous = s.answers[question.id];
    setValue(typeof previous === "number" ? (previous as LikertValue) : null);
    setSubmitError(null);
  }, [storageKey, startPath, router, question.id]);

  if (!session) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2 font-heading text-xs uppercase tracking-widest">
          Loading your quiz…
        </span>
      </div>
    );
  }

  const isLast = order >= QUESTION_COUNT;

  function persist(next: Record<string, LikertValue>) {
    if (!session) return;
    const merged: StorageShape = {
      ...session,
      answers: { ...session.answers, ...next },
    };
    setSession(merged);
    writeSession(storageKey, merged);
  }

  async function handleAnswer(v: LikertValue) {
    setValue(v);
    persist({ [question.id]: v });
  }

  async function goNext() {
    if (value === null) return;
    if (!isLast) {
      router.push(questionPath(order + 1));
      return;
    }
    // Submit
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(submitEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: session!.id, answers: session!.answers }),
      });
      const json = (await res.json()) as { resultUrl?: string; error?: string };
      if (!res.ok || !json.resultUrl) {
        setSubmitError(json.error ?? "Submission failed. Please try again.");
        setSubmitting(false);
        return;
      }
      // Clear storage after successful submit so a later quiz from the same
      // browser starts fresh.
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(storageKey);
      }
      router.push(json.resultUrl);
    } catch (err) {
      console.error("Submit failed", err);
      setSubmitError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  function goBack() {
    if (order <= 1) return;
    router.push(questionPath(order - 1));
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 md:py-14">
      <QuizProgress current={order} total={QUESTION_COUNT} />

      <div className="mt-10 md:mt-14">
        <p className="font-heading text-xs uppercase tracking-[0.25em] text-accent-dark">
          {question.dimension.replace("_", " ")}
        </p>
        <h1 className="mt-4 font-velocity text-foreground text-3xl sm:text-4xl md:text-5xl leading-tight tracking-wider">
          {question.statement}
        </h1>
      </div>

      <div className="mt-10">
        <LikertScale
          name={`answer_${question.id}`}
          value={value}
          onChange={handleAnswer}
        />
      </div>

      {submitError ? (
        <p
          role="alert"
          className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {submitError}
        </p>
      ) : null}

      <div className="mt-10 flex items-center justify-between">
        {order > 1 ? (
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={goBack}
            className="!p-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Button>
        ) : (
          <Link
            href="/health-survey"
            className="font-heading text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-smooth"
          >
            Leave quiz
          </Link>
        )}

        <Button
          type="button"
          variant="cta"
          size="lg"
          onClick={goNext}
          disabled={value === null || submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Scoring…
            </>
          ) : isLast ? (
            <>
              See my results
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              Next
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
