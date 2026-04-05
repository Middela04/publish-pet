import { Suggestion, SuggestionStatus } from "@/types";
import SuggestionItem from "./SuggestionItem";

interface SuggestionPanelProps {
  suggestions: Suggestion[];
  statuses: Record<number, SuggestionStatus>;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
}

export default function SuggestionPanel({
  suggestions,
  statuses,
  onAccept,
  onReject,
  onAcceptAll,
  onRejectAll,
}: SuggestionPanelProps) {
  if (suggestions.length === 0) {
    return (
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 text-center text-[var(--muted)]">
        <p className="font-medium">No suggestions to show.</p>
        <p className="text-sm">
          The analysis did not produce actionable text changes.
        </p>
      </div>
    );
  }

  const pending = suggestions.filter(
    (s) => (statuses[s.id] || "pending") === "pending"
  ).length;
  const accepted = suggestions.filter(
    (s) => statuses[s.id] === "accepted"
  ).length;
  const rejected = suggestions.filter(
    (s) => statuses[s.id] === "rejected"
  ).length;

  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Suggested Changes</h2>
          <p className="text-sm text-[var(--muted)]">
            {pending} pending &middot; {accepted} accepted &middot; {rejected}{" "}
            rejected
          </p>
        </div>
        {pending > 0 && (
          <div className="flex gap-2">
            <button
              onClick={onAcceptAll}
              className="px-3 py-1.5 bg-[var(--success)] text-white text-xs font-medium rounded-md hover:opacity-90 transition-opacity"
            >
              Accept All
            </button>
            <button
              onClick={onRejectAll}
              className="px-3 py-1.5 bg-[var(--card)] text-[var(--foreground)] text-xs font-medium rounded-md border border-[var(--border)] hover:bg-[var(--background)] transition-colors"
            >
              Reject All
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {suggestions.map((suggestion) => (
          <SuggestionItem
            key={suggestion.id}
            suggestion={suggestion}
            status={statuses[suggestion.id] || "pending"}
            onAccept={() => onAccept(suggestion.id)}
            onReject={() => onReject(suggestion.id)}
          />
        ))}
      </div>
    </div>
  );
}
