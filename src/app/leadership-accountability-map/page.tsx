import type { Metadata } from "next";
import { ClipboardList, Compass, Users } from "lucide-react";
import { IntakeForm } from "@/components/accountability/IntakeForm";

export const metadata: Metadata = {
  title: "Leadership Accountability Map",
  description:
    "Name the five seats every growing business needs to fill. Assign owners, missions, and accountability — so ownership stops falling through the cracks.",
};

export default function LeadershipAccountabilityMapLanding() {
  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Leadership Accountability Map · Heart pillar
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-5xl md:text-7xl uppercase tracking-wider leading-[0.95]">
            Clarity is the first act of leadership.
          </h1>
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-muted-foreground">
            &ldquo;No ownership&rdquo; and &ldquo;unclear authority&rdquo; are
            two of the cultural toxins Clay names in <em>Velocity</em> — the
            kind that look like &ldquo;everyone is busy&rdquo; on the surface
            but quietly kill growth underneath. This tool is the execution
            layer. Name the seats. Assign the owners. Lock the reflection
            rhythm. In 15 minutes.
          </p>
          <p className="mt-6 font-heading text-xs uppercase tracking-[0.2em] text-muted-foreground">
            10–15 minutes · Free · No account
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide grid gap-10 lg:grid-cols-2 lg:gap-16 max-w-5xl">
          <div className="space-y-4">
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
              What you&rsquo;ll leave with
            </p>
            <h2 className="font-velocity text-foreground text-3xl md:text-4xl uppercase tracking-wider">
              A map that eliminates ownership confusion.
            </h2>
            <ul className="mt-4 space-y-4">
              <Bullet icon={<Users className="h-5 w-5 text-accent-dark" />}>
                <strong className="text-foreground">Five seats, pre-filled.</strong>{" "}
                Visionary, Integrator, Director of Revenue, Director of
                Operations, Director of Business Administration — with Clay&rsquo;s
                exact mission statements and responsibilities as the starting
                template. Keep, edit, or add custom roles.
              </Bullet>
              <Bullet icon={<ClipboardList className="h-5 w-5 text-accent-dark" />}>
                <strong className="text-foreground">A PDF you can hand to your team.</strong>{" "}
                Branded, shareable, one page per seat. Pre-drafted email to
                your leadership team and calendar events for each reflection
                date.
              </Bullet>
              <Bullet icon={<Compass className="h-5 w-5 text-accent-dark" />}>
                <strong className="text-foreground">A 90-day reflection rhythm.</strong>{" "}
                Three dates locked in your calendar. One question to ask at
                each: is the right person in this seat, do they Get It, Want
                It, and have Capacity to do it?
              </Bullet>
            </ul>
          </div>

          <div className="rounded-2xl border-2 border-border bg-card p-6 md:p-8 shadow-card">
            <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
              Start your map
            </p>
            <h3 className="mt-3 font-velocity text-foreground text-2xl md:text-3xl uppercase tracking-wider leading-tight">
              Five fields. Then the real work.
            </h3>
            <div className="mt-6">
              <IntakeForm />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-section">
        <div className="container-wide max-w-3xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            From the book
          </p>
          <h2 className="mt-3 font-velocity text-foreground text-3xl md:text-4xl uppercase tracking-wider">
            Heart has to come first. Without it, the rest won&rsquo;t last.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Ownership confusion shows up as &ldquo;everyone is busy, yet key
            tasks fall through the cracks because someone else will handle
            it.&rdquo; The Leadership Accountability Map is how you replace
            that toxin with clarity — one seat at a time.
          </p>
        </div>
      </section>
    </>
  );
}

function Bullet({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full border border-border bg-card">
        {icon}
      </span>
      <div className="text-sm md:text-base leading-relaxed text-muted-foreground">
        {children}
      </div>
    </li>
  );
}
