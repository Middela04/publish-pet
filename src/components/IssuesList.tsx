import { AnalysisResult, Issue, IssueCategory, Severity } from "@/types";

interface IssuesListProps {
  result: AnalysisResult;
}

const CATEGORY_LABELS: Record<IssueCategory, string> = {
  formatting: "Formatting",
  structure: "Structure",
  wordLimits: "Word/Page Limits",
  citations: "Citations",
};

const SEVERITY_CONFIG: Record<
  Severity,
  { label: string; className: string; icon: string }
> = {
  error: {
    label: "Error",
    className: "bg-red-100 text-red-800 border-red-200",
    icon: "!!",
  },
  warning: {
    label: "Warning",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "!",
  },
  info: {
    label: "Info",
    className: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "i",
  },
};

export default function IssuesList({ result }: IssuesListProps) {
  const allIssues: Issue[] = Object.values(result.categories).flatMap(
    (c) => c.issues
  );

  if (allIssues.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--muted)]">
        <svg
          className="w-12 h-12 mx-auto mb-2 text-[var(--success)]"
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
        <p className="font-medium">No issues found!</p>
        <p className="text-sm">Your paper appears to follow the guidelines.</p>
      </div>
    );
  }

  const grouped = (Object.keys(CATEGORY_LABELS) as IssueCategory[])
    .map((cat) => ({
      category: cat,
      issues: result.categories[cat].issues,
    }))
    .filter((g) => g.issues.length > 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[var(--danger)]" />
          {allIssues.filter((i) => i.severity === "error").length} errors
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[var(--warning)]" />
          {allIssues.filter((i) => i.severity === "warning").length} warnings
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          {allIssues.filter((i) => i.severity === "info").length} info
        </span>
      </div>

      {grouped.map(({ category, issues }) => (
        <div key={category}>
          <h4 className="text-sm font-semibold mb-2">
            {CATEGORY_LABELS[category]} ({issues.length})
          </h4>
          <div className="flex flex-col gap-2">
            {issues.map((issue, idx) => {
              const config = SEVERITY_CONFIG[issue.severity];
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-sm ${config.className}`}
                >
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-xs mt-0.5 shrink-0">
                      {config.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{issue.description}</p>
                      {issue.excerpt && (
                        <p className="mt-1 text-xs opacity-80 truncate">
                          &ldquo;{issue.excerpt}&rdquo;
                        </p>
                      )}
                      {issue.location && (
                        <p className="mt-1 text-xs opacity-60">
                          {issue.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
