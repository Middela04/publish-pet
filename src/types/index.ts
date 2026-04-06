export type Severity = "error" | "warning" | "info";
export type IssueCategory = "formatting" | "structure" | "wordLimits" | "citations";
export type AnalysisStatus = "passed" | "needs_review" | "violations_found";
export type SuggestionStatus = "pending" | "accepted" | "rejected";

export interface Issue {
  category: IssueCategory;
  severity: Severity;
  description: string;
  excerpt: string;
  location: string;
}

export interface Suggestion {
  id: number;
  category: IssueCategory;
  severity: Severity;
  description: string;
  originalText: string;
  suggestedText: string;
  location: string;
}

export interface CategoryResult {
  score: number;
  issues: Issue[];
}

export interface AnalysisResult {
  overallScore: number;
  status: AnalysisStatus;
  categories: {
    formatting: CategoryResult;
    structure: CategoryResult;
    wordLimits: CategoryResult;
    citations: CategoryResult;
  };
  suggestions: Suggestion[];
  summary: string;
}

export interface AppState {
  guidelinesText: string;
  paperText: string;
  paperOriginalText: string;
  isAnalyzing: boolean;
  analysisResult: AnalysisResult | null;
  error: string | null;
  suggestionStatuses: Record<number, SuggestionStatus>;
  correctedPaper: string;
  activeTab: "input" | "results" | "suggestions";
}

export type AppAction =
  | { type: "SET_GUIDELINES"; payload: string }
  | { type: "SET_PAPER"; payload: string }
  | { type: "START_ANALYSIS" }
  | { type: "ANALYSIS_SUCCESS"; payload: AnalysisResult }
  | { type: "ANALYSIS_ERROR"; payload: string }
  | { type: "ACCEPT_SUGGESTION"; payload: number }
  | { type: "REJECT_SUGGESTION"; payload: number }
  | { type: "ACCEPT_ALL" }
  | { type: "REJECT_ALL" }
  | { type: "SET_TAB"; payload: AppState["activeTab"] }
  | { type: "RESET" };
