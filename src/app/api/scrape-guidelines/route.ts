import { NextResponse } from "next/server";
import { scrapeUrl } from "@/lib/scrape-url";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const text = await scrapeUrl(url);

    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: "Could not extract meaningful content from the URL" },
        { status: 422 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to scrape URL" },
      { status: 500 }
    );
  }
}
