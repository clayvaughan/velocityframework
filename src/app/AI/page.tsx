import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { HubSpotFormSlot } from "@/components/HubSpotFormSlot";
import type { Pillar } from "@/lib/resources";

export const metadata: Metadata = {
  title: "AI Tools",
  description:
    "The AI tools Clay actually uses to drive Velocity inside a business. Updated quarterly.",
};

/* ---------------------------------------------------------------------------
   Reasonable-defaults seed list — Clay curates this directly, refines
   post-launch. Each tool lists what it's used for, when not to use it, and a
   starting price tier. Real descriptions get swapped in quarterly.
   --------------------------------------------------------------------------- */
type Tool = {
  name: string;
  url: string;
  useFor: string;
  avoidWhen: string;
  priceTier: string;
  pillar: Pillar;
};

const tools: Tool[] = [
  {
    name: "ChatGPT (Team)",
    url: "https://openai.com/chatgpt/team/",
    useFor:
      "Strategy drafts, customer research synthesis, message map iteration, quick research in meetings.",
    avoidWhen:
      "Anything touching client PII without a signed BAA or internal data governance sign-off.",
    priceTier: "$30/user/month",
    pillar: "heading",
  },
  {
    name: "Claude (Teams)",
    url: "https://www.anthropic.com/claude",
    useFor:
      "Long-form analysis, proposal writing, reviewing contracts and long documents with precise edits.",
    avoidWhen: "Short transactional tasks where ChatGPT is faster.",
    priceTier: "$30/user/month",
    pillar: "heading",
  },
  {
    name: "Fathom",
    url: "https://fathom.video/",
    useFor:
      "Automated meeting notes + CRM sync. Extract action items, talking tracks, and moments of tension.",
    avoidWhen:
      "Confidential 1:1s or board meetings where recording changes the dynamic.",
    priceTier: "Free tier; Pro starts $19/user/month",
    pillar: "hustle",
  },
  {
    name: "Lindy / Zapier AI",
    url: "https://www.lindy.ai/",
    useFor:
      "Lightweight workflow automation — lead routing, scorecard rollups, dashboard nudges.",
    avoidWhen: "Anything requiring audit-grade reliability.",
    priceTier: "Usage-based from $29/month",
    pillar: "hustle",
  },
  {
    name: "Gamma",
    url: "https://gamma.app/",
    useFor:
      "Rapid decks for internal alignment or client pitches — polished without a designer in the loop.",
    avoidWhen: "Print-quality, investor-grade decks — send those to design.",
    priceTier: "Free tier; Plus starts $10/month",
    pillar: "heading",
  },
  {
    name: "Perplexity Enterprise",
    url: "https://www.perplexity.ai/enterprise",
    useFor:
      "Sourced competitive research, industry scans, and trend monitoring with citations you can verify.",
    avoidWhen: "Non-public, internal knowledge bases — use your RAG instead.",
    priceTier: "$40/user/month",
    pillar: "heading",
  },
];

const pillarSection: { pillar: Pillar; heading: string; description: string }[] = [
  {
    pillar: "heart",
    heading: "Heart — team communication, culture feedback",
    description:
      "Tools Clay uses on the culture side: team surveys, communication hygiene, and internal listening.",
  },
  {
    pillar: "heading",
    heading: "Heading — strategy, messaging, research",
    description:
      "Tools that sharpen strategy and messaging: research, positioning, customer analysis, decks.",
  },
  {
    pillar: "hustle",
    heading: "Hustle — sales, CRM, reporting, execution",
    description:
      "Tools that keep the weekly rhythm moving: note capture, CRM hygiene, pipeline visibility.",
  },
];

export default function AIPage() {
  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" /> AI Tools
          </p>
          <h1 className="mt-4 font-velocity text-5xl md:text-7xl uppercase tracking-wider">
            The tools I actually use
          </h1>
          <p className="mt-6 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl">
            The AI tools Clay actually uses to drive Velocity in his business.
            Short list, opinionated, current-quarter only. Updated every three
            months.
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Last updated: April 2026 · initial default list (Clay refines post-launch)
          </p>
        </div>
      </section>

      {pillarSection.map(({ pillar, heading, description }) => {
        const tray = tools.filter((t) => t.pillar === pillar);
        if (tray.length === 0) return null;
        return (
          <section
            key={pillar}
            className="section-padding odd:bg-background even:bg-gradient-section"
          >
            <div className="container-wide">
              <SectionHeader
                eyebrow={`Pillar · ${pillar}`}
                title={heading}
                description={description}
              />
              <ul className="mt-10 grid gap-6 md:grid-cols-2">
                {tray.map((t) => (
                  <li
                    key={t.name}
                    className="rounded-xl border border-border bg-card p-6 shadow-card"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-heading text-lg uppercase tracking-wide">
                        <a
                          href={t.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline-offset-4 hover:underline"
                        >
                          {t.name}
                        </a>
                      </h3>
                      <span className="font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                        {t.priceTier}
                      </span>
                    </div>
                    <dl className="mt-5 space-y-4 text-sm">
                      <div>
                        <dt className="font-heading text-[0.65rem] uppercase tracking-widest text-accent-dark">
                          Use it for
                        </dt>
                        <dd className="mt-1 leading-relaxed">{t.useFor}</dd>
                      </div>
                      <div>
                        <dt className="font-heading text-[0.65rem] uppercase tracking-widest text-destructive">
                          Don&rsquo;t use it for
                        </dt>
                        <dd className="mt-1 leading-relaxed text-muted-foreground">
                          {t.avoidWhen}
                        </dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-narrow text-center">
          <SectionHeader
            align="center"
            eyebrow="Stay current"
            title="Get quarterly updates"
            description="Short email when the list changes. No spam, no drip — just what's new, what's out, and why."
            className="[&_*]:text-primary-foreground"
          />
          <div className="mt-10 mx-auto max-w-xl text-left">
            <HubSpotFormSlot
              formKey="ai_tools_quarterly"
              heading="Notify me when the list updates"
              subheading="Sets ai_tools_subscriber: true"
              fields={[
                { name: "firstname", label: "First name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
              ]}
              workflow="ai_tools_update_v1"
              submitLabel="Subscribe"
            />
          </div>
        </div>
      </section>
    </>
  );
}
