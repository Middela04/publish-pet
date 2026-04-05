import { NextResponse } from "next/server";
import { parsePdf } from "@/lib/parse-pdf";
import { parseDocx } from "@/lib/parse-docx";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const name = file.name.toLowerCase();
    let text: string;
    let pageCount: number | undefined;

    if (name.endsWith(".pdf")) {
      const result = await parsePdf(buffer);
      text = result.text;
      pageCount = result.pages;
    } else if (name.endsWith(".docx")) {
      const result = await parseDocx(buffer);
      text = result.text;
    } else if (name.endsWith(".txt") || name.endsWith(".md")) {
      text = buffer.toString("utf-8");
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a PDF, DOCX, or TXT file." },
        { status: 400 }
      );
    }

    const wordCount = text.split(/\s+/).filter(Boolean).length;

    return NextResponse.json({
      text,
      metadata: { wordCount, pageCount },
    });
  } catch (error) {
    console.error("Parse error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to parse file" },
      { status: 500 }
    );
  }
}
