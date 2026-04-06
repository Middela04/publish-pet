import { Document, Packer, Paragraph, TextRun } from "docx";

export async function generateDocx(text: string): Promise<Uint8Array> {
  const paragraphs = text.split("\n\n").map(
    (para) =>
      new Paragraph({
        children: [new TextRun({ text: para.replace(/\n/g, " ") })],
        spacing: { after: 200 },
      })
  );

  const doc = new Document({
    sections: [
      {
        children: paragraphs,
      },
    ],
  });

  return Packer.toBuffer(doc);
}

export function generateTxt(text: string): Blob {
  return new Blob([text], { type: "text/plain" });
}
