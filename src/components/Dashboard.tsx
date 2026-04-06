import { AnalysisResult, AnalysisStatus } from "@/types";
import ComplianceScore from "./ComplianceScore";
import IssuesList from "./IssuesList";

interface DashboardProps {
  result: AnalysisResult;
}

const STATUS_CONFIG: Record<
  AnalysisStatus,
  { label: string; description: string; className: string }
> = {
  passed: {
    label: "Passed",
    description: "Your paper meets the submission guidelines.",
    className: "bg-green-50 border-green-200 text-green-800",
  },
  needs_review: {
    label: "Needs Review",
    description: "Some items should be reviewed before submission.",
    className: "bg-yellow-50 border-yellow-200 text-yellow-800",
  },
  violations_found: {
    label: "Violations Found",
    description: "Critical issues must be fixed before submission.",
    className: "bg-red-50 border-red-200 text-red-800",
  },
};

export default function Dashboard({ result }: DashboardProps) {
  const status = STATUS_CONFIG[result.status];

  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
      <h2 className="text-lg font-semibold mb-4">Compliance Dashboard</h2>

      {/* Status banner */}
      <div className={`p-4 rounded-lg border mb-6 ${status.className}`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold">{status.label}</span>
        </div>
        <p className="mt-1 text-sm">{status.description}</p>
        <p className="mt-2 text-sm opacity-80">{result.summary}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score */}
        <div>
          <h3 className="text-sm font-semibold mb-4 text-[var(--muted)]">
            COMPLIANCE SCORE
          </h3>
          <ComplianceScore result={result} />
        </div>

        {/* Issues */}
        <div>
          <h3 className="text-sm font-semibold mb-4 text-[var(--muted)]">
            ISSUES FOUND
          </h3>
          <div className="max-h-96 overflow-y-auto pr-2">
            <IssuesList result={result} />
          </div>
        </div>
      </div>
    </div>
  );
}
