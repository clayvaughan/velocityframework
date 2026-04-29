import { NextResponse } from "next/server";

export function pdfErrorResponse(
  error: string,
  status: number
): NextResponse {
  return NextResponse.json(
    { error },
    {
      status,
      headers: {
        "Content-Disposition": "inline",
        "Cache-Control": "private, max-age=0, no-cache",
      },
    }
  );
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
