import { PDFParse } from "pdf-parse";

export async function parsePdf(
  buffer: Buffer
): Promise<{ text: string; pages: number }> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  const result = await parser.getText();
  await parser.destroy();
  return { text: result.text, pages: result.total };
}
