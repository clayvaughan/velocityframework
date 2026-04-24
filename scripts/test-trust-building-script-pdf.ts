/**
 * One-off local smoke test — fetches the real Bellamere Google Doc, parses
 * it, renders the PDF, and writes to /tmp so we can open and inspect the
 * output before shipping. Safe to delete once verified.
 *
 * Run with: npx tsx scripts/test-trust-building-script-pdf.mts
 */

import React from "react";
import { writeFileSync } from "node:fs";
import { TRUST_BUILDING_SCRIPT_DOC_ID } from "@/lib/trust-building-script/constants";
import { fetchTrustBuildingScriptDoc } from "@/lib/trust-building-script/doc-fetcher";
import {
  parseTrustBuildingScript,
  type Block,
} from "@/lib/trust-building-script/parser";
import { TrustBuildingScriptReport } from "@/lib/pdf/TrustBuildingScriptReport";
import { renderPdfToBuffer } from "@/lib/pdf/render";

async function main() {
  console.log("Fetching Google Doc…");
  const fetched = await fetchTrustBuildingScriptDoc(
    TRUST_BUILDING_SCRIPT_DOC_ID
  );
  if (!fetched.ok) {
    console.error("Fetch failed:", fetched);
    process.exit(1);
  }
  console.log(`Fetched ${fetched.content.length} chars (cached=${fetched.cached}).`);

  const parsed = parseTrustBuildingScript(fetched.content);
  console.log(`Parsed sections: ${parsed.sections.length}`);
  for (const section of parsed.sections) {
    const counts: Record<Block["kind"], number> = {
      objective: 0,
      coaching: 0,
      script: 0,
      step: 0,
      bullet: 0,
      paragraph: 0,
    };
    for (const b of section.blocks) counts[b.kind] += 1;
    console.log(
      `  ${section.number}. ${section.title.slice(0, 60)} — ` +
        `steps=${counts.step} bullets=${counts.bullet} scripts=${counts.script} coaching=${counts.coaching} para=${counts.paragraph}`
    );
  }
  console.log(`Parsed best-practices blocks: ${parsed.bestPractices.length}`);

  console.log("Rendering PDF…");
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const buffer = await renderPdfToBuffer(
    React.createElement(TrustBuildingScriptReport, {
      doc: parsed,
      lastUpdated,
    })
  );

  const outPath = "/tmp/bellamere-trust-building-script.pdf";
  writeFileSync(outPath, buffer);
  console.log(`Wrote ${buffer.length} bytes to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
