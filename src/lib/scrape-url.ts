import * as cheerio from "cheerio";

export async function scrapeUrl(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; PublishPet/1.0; Academic Paper Checker)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove non-content elements
  $("script, style, nav, footer, header, aside, iframe, noscript").remove();

  // Try to find the main content area
  const mainContent =
    $("main").text() ||
    $("article").text() ||
    $('[role="main"]').text() ||
    $(".content").text() ||
    $(".main-content").text() ||
    $("body").text();

  // Clean up whitespace
  return mainContent
    .replace(/\s+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
