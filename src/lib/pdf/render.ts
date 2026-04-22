/**
 * Thin wrapper around @react-pdf/renderer's `renderToBuffer` that returns a
 * Node Buffer suitable for Next.js Response bodies.
 */

import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";

export async function renderPdfToBuffer(
  doc: ReactElement<DocumentProps>
): Promise<Buffer> {
  return await renderToBuffer(doc);
}
