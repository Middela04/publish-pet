"use client";

import { useState } from "react";

interface GuidelinesInputProps {
  value: string;
  onChange: (text: string) => void;
}

export default function GuidelinesInput({
  value,
  onChange,
}: GuidelinesInputProps) {
  const [mode, setMode] = useState<"paste" | "url">("paste");
  const [url, setUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const handleFetchUrl = async () => {
    if (!url.trim()) return;
    setIsFetching(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/scrape-guidelines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch guidelines");
      }
      onChange(data.text);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-[var(--foreground)]">
          Submission Guidelines
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
            onClick={() => setMode("url")}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              mode === "url"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            From URL
          </button>
        </div>
      </div>

      {mode === "paste" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the journal's submission guidelines here..."
          className="w-full h-48 p-3 border border-[var(--border)] rounded-lg bg-[var(--card)] text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
        />
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://journal.example.com/author-guidelines"
              className="flex-1 p-3 border border-[var(--border)] rounded-lg bg-[var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            />
            <button
              onClick={handleFetchUrl}
              disabled={isFetching || !url.trim()}
              className="px-4 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isFetching ? "Fetching..." : "Fetch"}
            </button>
          </div>
          {fetchError && (
            <p className="text-xs text-[var(--danger)]">{fetchError}</p>
          )}
          {value && (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-36 p-3 border border-[var(--border)] rounded-lg bg-[var(--card)] text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              placeholder="Fetched guidelines will appear here. You can edit them."
            />
          )}
        </div>
      )}

      {value && (
        <p className="text-xs text-[var(--muted)]">
          {value.split(/\s+/).filter(Boolean).length} words
        </p>
      )}
    </div>
  );
}
