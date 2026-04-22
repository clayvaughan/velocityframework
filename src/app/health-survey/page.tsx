import type { Metadata } from "next";
import { ClipboardCheck } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { HubSpotFormSlot } from "@/components/HubSpotFormSlot";

export const metadata: Metadata = {
  title: "Team Culture Health Check",
  description:
    "A 5-minute culture diagnostic across five dimensions — Trust, Communication, Accountability, Purpose Alignment, Hospitality.",
};

/**
 * Placeholder for the Culture Health Check quiz. Real 15–20 question Typeform
 * quiz lands in Week 9–10 per the production schedule. For now, this page
 * captures interest and sets expectations.
 */
export default function HealthSurveyPage() {
  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark inline-flex items-center gap-2">
            <ClipboardCheck className="h-3.5 w-3.5" /> Diagnostic
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-5xl md:text-7xl uppercase tracking-wider">
            Team Culture Health Check
          </h1>
          <p className="mt-6 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl">
            In 5 minutes, you&rsquo;ll know where your team culture is strong
            and where toxins are sneaking in. Answer honestly. You can take
            this yourself, or send it to your whole team for an anonymous
            team-wide read.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6">
            <SectionHeader
              eyebrow="What it measures"
              title="Five dimensions of culture"
            />
            <ul className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  t: "Trust",
                  d: "Do people bring up bad news as fast as good?",
                },
                {
                  t: "Communication",
                  d: "Is the same information reaching everyone, or does it splinter?",
                },
                {
                  t: "Accountability",
                  d: "Does ownership travel with the task, or get lost?",
                },
                {
                  t: "Purpose Alignment",
                  d: "Can everyone connect their work to the company's point?",
                },
                {
                  t: "Hospitality",
                  d: "Do new people and outsiders feel welcome here?",
                },
              ].map((x) => (
                <li
                  key={x.t}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <p className="font-heading text-sm uppercase tracking-wide">
                    {x.t}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {x.d}
                  </p>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground pt-2">
              Each dimension is scored 1–5. The full quiz is 15–20 questions
              and takes about 5 minutes. Results come with a written
              interpretation and a recommended next step.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <p className="font-heading text-xs uppercase tracking-widest text-accent-dark">
                Coming soon
              </p>
              <h3 className="mt-2 font-heading text-xl uppercase tracking-wide">
                The quiz goes live soon
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Drop your email and we&rsquo;ll send you the link the moment
                the Culture Health Check is live. You&rsquo;ll also get the
                Culture Action Plan download that pairs with your score.
              </p>
              <div className="mt-6">
                <HubSpotFormSlot
                  formKey="culture_health_check_waitlist"
                  heading="Tell me when it's ready"
                  subheading="Tagged as pillar_interest: heart · health_check_waitlist"
                  fields={[
                    { name: "firstname", label: "First name", required: true },
                    {
                      name: "email",
                      label: "Email",
                      type: "email",
                      required: true,
                    },
                    {
                      name: "company_size",
                      label: "Company size",
                      type: "select",
                    },
                    {
                      name: "take_for",
                      label: "For yourself or your whole team?",
                      type: "select",
                    },
                  ]}
                  workflow="health_check_waitlist_v1"
                  submitLabel="Notify me"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
