/**
 * One-off local smoke test — fetches the real FRE Google Doc, parses it,
 * renders the PDF, and writes to /tmp so we can open and inspect the
 * output before shipping. Safe to delete once verified.
 *
 * Run with: npx tsx scripts/test-fre-job-description-pdf.ts
 */

import React from "react";
import { writeFileSync } from "node:fs";
import { FRE_JOB_DESCRIPTION_DOC_ID } from "@/lib/fre-job-description/constants";
import { fetchFreJobDescriptionDoc } from "@/lib/fre-job-description/doc-fetcher";
import {
  parseFreJobDescription,
  type Block,
} from "@/lib/fre-job-description/parser";
import { FreJobDescriptionReport } from "@/lib/pdf/FreJobDescriptionReport";
import { renderPdfToBuffer } from "@/lib/pdf/render";

async function main() {
  console.log("Fetching Google Doc…");
  const fetched = await fetchFreJobDescriptionDoc(FRE_JOB_DESCRIPTION_DOC_ID);
  if (!fetched.ok) {
    console.error("Fetch failed:", fetched);
    process.exit(1);
  }
  console.log(`Fetched ${fetched.content.length} chars (cached=${fetched.cached}).`);

  const parsed = parseFreJobDescription(fetched.content);
  console.log(`Title: ${parsed.title}`);
  console.log(`Total blocks: ${parsed.blocks.length}`);
  const counts: Record<Block["kind"], number> = {
    heading1: 0,
    heading2: 0,
    paragraph: 0,
    bullet: 0,
  };
  for (const b of parsed.blocks) counts[b.kind] += 1;
  console.log(
    `  H1=${counts.heading1} H2=${counts.heading2} para=${counts.paragraph} bullets=${counts.bullet}`
  );
  console.log("\nH1 sections:");
  for (const b of parsed.blocks) {
    if (b.kind === "heading1") console.log(`  - ${b.text}`);
  }

  console.log("\nRendering PDF…");
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const buffer = await renderPdfToBuffer(
    React.createElement(FreJobDescriptionReport, {
      doc: parsed,
      lastUpdated,
    })
  );

  const outPath = "/tmp/fre-job-description.pdf";
  writeFileSync(outPath, buffer);
  console.log(`Wrote ${buffer.length} bytes to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
