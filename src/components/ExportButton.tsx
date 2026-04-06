"use client";

import { useState } from "react";
import { generateDocx } from "@/lib/export-docx";

interface ExportButtonProps {
  text: string;
}

export default function ExportButton({ text }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportDocx = async () => {
    setIsExporting(true);
    try {
      const buffer = await generateDocx(text);
      const blob = new Blob([new Uint8Array(buffer) as BlobPart], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      downloadFile(blob, "paper-corrected.docx");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportTxt = () => {
    const blob = new Blob([text], { type: "text/plain" });
    downloadFile(blob, "paper-corrected.txt");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
      <h2 className="text-lg font-semibold mb-2">Export Corrected Paper</h2>
      <p className="text-sm text-[var(--muted)] mb-4">
        Download your paper with all accepted changes applied.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExportDocx}
          disabled={isExporting}
          className="px-4 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {isExporting ? "Exporting..." : "Export as DOCX"}
        </button>
        <button
          onClick={handleExportTxt}
          className="px-4 py-2 bg-[var(--card)] text-[var(--foreground)] text-sm font-medium rounded-lg border border-[var(--border)] hover:bg-[var(--background)] transition-colors flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export as TXT
        </button>
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-[var(--card)] text-[var(--foreground)] text-sm font-medium rounded-lg border border-[var(--border)] hover:bg-[var(--background)] transition-colors flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
}
