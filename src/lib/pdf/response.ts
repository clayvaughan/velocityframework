import { NextResponse } from "next/server";

/**
 * TEMPORARY: includes full error name/message/stack in the JSON response
 * when an Error is passed. Helps surface the real production failure
 * while we're still hunting the root cause of "PDF render failed". Strip
 * the `detail` payload once the underlying bug is fixed.
 */
export function pdfErrorResponse(
  error: string,
  status: number,
  cause?: unknown
): NextResponse {
  const detail =
    cause instanceof Error
      ? { name: cause.name, message: cause.message, stack: cause.stack }
      : cause !== undefined
        ? { value: String(cause) }
        : undefined;
  return NextResponse.json(
    detail ? { error, detail } : { error },
    {
      status,
      headers: {
        "Content-Disposition": "inline",
        "Cache-Control": "private, max-age=0, no-cache",
      },
    }
  );
}

/**
 * TEMPORARY: shared helper used by every PDF route's catch block. Logs
 * the full error to Replit's deployment logs (so it shows up under the
 * given `label`) AND echoes name/message/stack into the HTTP response
 * body so a curl from anywhere shows the real failure. Remove once the
 * underlying bug is fixed.
 */
export function logAndReturnPdfRenderError(
  label: string,
  cause: unknown
): NextResponse {
  const err =
    cause instanceof Error ? cause : new Error(String(cause));
  console.error(`[${label}] PDF render failed`, {
    name: err.name,
    message: err.message,
    stack: err.stack,
    cwd: process.cwd(),
    nodeVersion: process.version,
  });
  return pdfErrorResponse("PDF render failed.", 500, err);
}

export function pdfSuccessResponse(
  buffer: Buffer,
  filename: string
): NextResponse {
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, max-age=0, no-cache",
    },
  });
}
