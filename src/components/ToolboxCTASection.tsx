import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./SectionHeader";

type Props = {
  /**
   * Tailwind background class for the section. Defaults to `bg-gradient-section`
   * (used by Book / Heart / Heading / Hustle today). Homepage overrides to
   * `bg-gradient-subtle` to preserve its existing visual flow with the sections
   * above and below.
   */
  background?: string;
};

export function ToolboxCTASection({ background = "bg-gradient-section" }: Props) {
  return (
    <section className={`section-padding ${background}`}>
      <div className="container-narrow">
        <SectionHeader
          align="center"
          eyebrow="Every tool from the book"
          title="Browse the toolbox"
          description="Twelve tools to help you grow revenue with integrity, tell stories that move people to action, and build systems that scale without chaos. Pick the one that matches what you're working on right now."
        />
        <div className="mt-10 flex justify-center">
          <Button asChild variant="cta" size="lg">
            <Link href="/toolbox">
              Browse the toolbox
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
