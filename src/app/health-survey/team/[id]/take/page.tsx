"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Team-member entrypoint. Seeds a local session id + empty answers for this
 * team quiz and forwards to question 1. Also renders a simple "you're
 * about to take the quiz anonymously" confirmation so people know what
 * they're entering.
 */
export default function TeamTakeEntryPage() {
  const params = useParams<{ id: string }>();
  const teamQuizId = params?.id;
  const router = useRouter();
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!teamQuizId) return;
  }, [teamQuizId]);

  function start() {
    if (!teamQuizId) return;
    setStarting(true);
    // For team members, the "id" in the local session is the team quiz id;
    // answers are flushed to the server on submit as a new team response.
    const key = `velocity-quiz:team:${teamQuizId}`;
    window.localStorage.setItem(
      key,
      JSON.stringify({ id: teamQuizId, answers: {} })
    );
    router.push(`/health-survey/team/${teamQuizId}/take/question/1`);
  }

  return (
    <section className="bg-gradient-hero section-padding">
      <div className="container-narrow max-w-xl">
        <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
          Team Culture Health Check · Anonymous
        </p>
        <h1 className="mt-4 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider">
          Your team leader sent you this link.
        </h1>
        <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground">
          You&rsquo;re about to take the Velocity Culture Health Check. Fifteen
          questions, about five minutes. Your answers are{" "}
          <strong className="text-foreground">anonymous</strong> — only the
          aggregate shows up in your team leader&rsquo;s dashboard. No
          individual response ever surfaces.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Answer honestly. That&rsquo;s the only way this works.
        </p>
        <div className="mt-8">
          <Button type="button" variant="cta" size="lg" onClick={start} disabled={starting}>
            {starting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Starting…
              </>
            ) : (
              "Start the Health Check"
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
