"use client";

import { useState, useRef } from "react";

interface PaperInputProps {
  value: string;
  onChange: (text: string) => void;
}

export default function PaperInput({ value, onChange }: PaperInputProps) {
  const [mode, setMode] = useState<"paste" | "upload">("paste");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{
    wordCount?: number;
    pageCount?: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-paper", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to parse file");
      }
      onChange(data.text);
      setMetadata(data.metadata);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
      setFileName(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-[var(--foreground)]">
          Research Paper
        </label>
        <div className="flex bg-[var(--background)] rounded-lg p-0.5">
          <button
            onClick={() => setMode("paste")}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              mode === "paste"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Paste Text
          </button>
          <button
            onClick={() => setMode("upload")}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              mode === "upload"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Upload File
          </button>
        </div>
      </div>

      {mode === "paste" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your research paper text here..."
          className="w-full h-48 p-3 border border-[var(--border)] rounded-lg bg-[var(--card)] text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
        />
      ) : (
        <div className="flex flex-col gap-2">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-36 border-2 border-dashed border-[var(--border)] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[var(--primary)] hover:bg-indigo-50/30 transition-colors"
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[var(--muted)]">
                  Processing {fileName}...
                </p>
              </div>
            ) : fileName && value ? (
              <div className="flex flex-col items-center gap-2">
                <svg
                  className="w-8 h-8 text-[var(--success)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-medium">{fileName}</p>
                <p className="text-xs text-[var(--muted)]">
                  Click or drop to replace
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <svg
                  className="w-8 h-8 text-[var(--muted)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-sm text-[var(--muted)]">
                  Drop a file here or click to browse
                </p>
                <p className="text-xs text-[var(--muted)]">
                  Supports PDF, DOCX, and TXT
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.md"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="hidden"
          />
          {uploadError && (
            <p className="text-xs text-[var(--danger)]">{uploadError}</p>
          )}
          {value && mode === "upload" && (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-36 p-3 border border-[var(--border)] rounded-lg bg-[var(--card)] text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              placeholder="Extracted text will appear here. You can edit it."
            />
          )}
        </div>
      )}

      <div className="flex gap-3 text-xs text-[var(--muted)]">
        {value && (
          <span>{value.split(/\s+/).filter(Boolean).length} words</span>
        )}
        {metadata?.pageCount && <span>{metadata.pageCount} pages</span>}
      </div>
    </div>
  );
}
