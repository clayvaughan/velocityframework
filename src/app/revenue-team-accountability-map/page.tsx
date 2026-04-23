import type { Metadata } from "next";
import { BarChart3, Handshake, Users } from "lucide-react";
import { IntakeForm } from "@/components/revenue-team/IntakeForm";

export const metadata: Metadata = {
  title: "Unified Revenue Team Accountability Map",
  description:
    "Map who owns what across your unified revenue team — marketing, sales, RevOps, and retention. Builds on the Director of Revenue / FRE structure from Chapter 7 of Velocity.",
};

export default function RevenueTeamAccountabilityMapLanding() {
  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Unified Revenue Team Map · Heading pillar
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-5xl md:text-7xl uppercase tracking-wider leading-[0.95]">
            One team, one story, one number.
          </h1>
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-muted-foreground">
            Chapter 7 of <em>Velocity</em> makes the case that unifying sales
            and marketing into one Revenue Department is how growing
            businesses escape the silos problem. This tool is the operating
            document for that unified team — who owns what across marketing,
            sales, RevOps, and account management so nothing falls through
            the cracks.
          </p>
          <p className="mt-6 font-heading text-xs uppercase tracking-[0.2em] text-muted-foreground">
            10–15 minutes · Free · No account
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide grid gap-10 lg:grid-cols-2 lg:gap-16 max-w-5xl items-start">
          <div className="space-y-4">
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
              What you&rsquo;ll leave with
            </p>
            <h2 className="font-velocity text-foreground text-3xl md:text-4xl uppercase tracking-wider">
              The revenue team that unifies marketing, sales, and retention.
            </h2>
            <ul className="mt-4 space-y-4">
              <Bullet icon={<Users className="h-5 w-5 text-accent-dark" />}>
                <strong className="text-foreground">Five seats, pre-filled.</strong>{" "}
                Director of Revenue / FRE, Marketing Lead, Sales Lead,
                Revenue Operations Lead, and Account Management Lead — with
                book-grounded missions, three metrics, and five
                responsibilities each. Keep, edit, or add custom roles.
              </Bullet>
              <Bullet icon={<BarChart3 className="h-5 w-5 text-accent-dark" />}>
                <strong className="text-foreground">A weekly rhythm.</strong>{" "}
                The standing meeting where all four functions look at the
                same numbers together. Day, time, duration, attendees, and
                a six-item default agenda you can edit.
              </Bullet>
              <Bullet icon={<Handshake className="h-5 w-5 text-accent-dark" />}>
                <strong className="text-foreground">A quarterly reflection.</strong>{" "}
                Three dates every 90 days for your leadership to walk each
                seat together. Calendar events and a pre-drafted team email
                are generated for you.
              </Bullet>
            </ul>
          </div>

          <div className="rounded-2xl border-2 border-border bg-card p-6 md:p-8 shadow-card">
            <p className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
              Start your map
            </p>
            <h3 className="mt-3 font-velocity text-foreground text-2xl md:text-3xl uppercase tracking-wider leading-tight">
              Seven fields. Then the real work.
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
            Marketing and sales as one department.
          </h2>
          <p className="mt-4 text-muted-foreground">
            When marketing and sales report to different leaders, the
            business doesn&rsquo;t have a revenue team — it has two
            departments competing for credit. The fix isn&rsquo;t more
            meetings. The fix is a single owner over both functions with one
            scoreboard. That&rsquo;s what the Director of Revenue / Fractional
            Revenue Executive role exists to solve.
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
