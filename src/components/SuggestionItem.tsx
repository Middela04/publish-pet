import { Suggestion, SuggestionStatus, Severity } from "@/types";

interface SuggestionItemProps {
  suggestion: Suggestion;
  status: SuggestionStatus;
  onAccept: () => void;
  onReject: () => void;
}

const SEVERITY_DOT: Record<Severity, string> = {
  error: "bg-[var(--danger)]",
  warning: "bg-[var(--warning)]",
  info: "bg-blue-500",
};

export default function SuggestionItem({
  suggestion,
  status,
  onAccept,
  onReject,
}: SuggestionItemProps) {
  const isResolved = status !== "pending";

  return (
    <div
      className={`border border-[var(--border)] rounded-lg overflow-hidden transition-opacity ${
        isResolved ? "opacity-60" : ""
      }`}
    >
      {/* Header */}
      <div className="px-4 py-2 bg-[var(--background)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${SEVERITY_DOT[suggestion.severity]}`}
          />
          <span className="text-sm font-medium">{suggestion.description}</span>
        </div>
        <span className="text-xs text-[var(--muted)]">
          {suggestion.location}
        </span>
      </div>

      {/* Side-by-side diff */}
      <div className="grid grid-cols-2 divide-x divide-[var(--border)]">
        {/* Original */}
        <div className="p-4">
          <p className="text-xs font-semibold text-[var(--muted)] mb-2">
            ORIGINAL
          </p>
          <div className="text-sm bg-red-50 p-2 rounded border border-red-100">
            <span className="diff-removed">{suggestion.originalText}</span>
          </div>
        </div>

        {/* Suggested */}
        <div className="p-4">
          <p className="text-xs font-semibold text-[var(--muted)] mb-2">
            SUGGESTED
          </p>
          <div className="text-sm bg-green-50 p-2 rounded border border-green-100">
            <span className="diff-added">{suggestion.suggestedText}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-[var(--background)] flex items-center justify-between">
        {status === "pending" ? (
          <div className="flex gap-2">
            <button
              onClick={onAccept}
              className="px-4 py-1.5 bg-[var(--success)] text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
            >
              Accept Change
            </button>
            <button
              onClick={onReject}
              className="px-4 py-1.5 bg-[var(--card)] text-[var(--foreground)] text-sm font-medium rounded-md border border-[var(--border)] hover:bg-[var(--background)] transition-colors"
            >
              Reject Change
            </button>
          </div>
        ) : (
          <span
            className={`text-sm font-medium ${
              status === "accepted" ? "text-[var(--success)]" : "text-[var(--muted)]"
            }`}
          >
            {status === "accepted" ? "Accepted" : "Rejected"}
          </span>
        )}
      </div>
    </div>
  );
}
