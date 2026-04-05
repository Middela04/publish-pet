import { AnalysisResult, IssueCategory } from "@/types";

interface ComplianceScoreProps {
  result: AnalysisResult;
}

const CATEGORY_LABELS: Record<IssueCategory, string> = {
  formatting: "Formatting",
  structure: "Structure",
  wordLimits: "Word/Page Limits",
  citations: "Citations",
};

const CATEGORY_WEIGHTS: Record<IssueCategory, number> = {
  formatting: 20,
  structure: 35,
  wordLimits: 20,
  citations: 25,
};

function getScoreColor(score: number): string {
  if (score >= 80) return "var(--success)";
  if (score >= 60) return "var(--warning)";
  return "var(--danger)";
}

export default function ComplianceScore({ result }: ComplianceScoreProps) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (result.overallScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Overall score ring */}
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--border)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getScoreColor(result.overallScore)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="score-ring"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold"
            style={{ color: getScoreColor(result.overallScore) }}
          >
            {result.overallScore}
          </span>
          <span className="text-xs text-[var(--muted)]">/ 100</span>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="w-full grid grid-cols-2 gap-3">
        {(Object.keys(CATEGORY_LABELS) as IssueCategory[]).map((cat) => {
          const catResult = result.categories[cat];
          return (
            <div key={cat} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--muted)]">
                  {CATEGORY_LABELS[cat]} ({CATEGORY_WEIGHTS[cat]}%)
                </span>
                <span
                  className="font-semibold"
                  style={{ color: getScoreColor(catResult.score) }}
                >
                  {catResult.score}
                </span>
              </div>
              <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${catResult.score}%`,
                    backgroundColor: getScoreColor(catResult.score),
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
