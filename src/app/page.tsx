"use client";

import { useReducer, useCallback } from "react";
import Header from "@/components/Header";
import InputPanel from "@/components/InputPanel";
import Dashboard from "@/components/Dashboard";
import SuggestionPanel from "@/components/SuggestionPanel";
import ExportButton from "@/components/ExportButton";
import LoadingState from "@/components/LoadingState";
import type {
  AppState,
  AppAction,
  AnalysisResult,
  Suggestion,
} from "@/types";

const initialState: AppState = {
  guidelinesText: "",
  paperText: "",
  paperOriginalText: "",
  isAnalyzing: false,
  analysisResult: null,
  error: null,
  suggestionStatuses: {},
  correctedPaper: "",
  activeTab: "input",
};

function applySuggestion(paper: string, suggestion: Suggestion): string {
  if (!suggestion.originalText) return paper;
  return paper.replace(suggestion.originalText, suggestion.suggestedText);
}

function revertSuggestion(paper: string, suggestion: Suggestion): string {
  if (!suggestion.suggestedText) return paper;
  return paper.replace(suggestion.suggestedText, suggestion.originalText);
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_GUIDELINES":
      return { ...state, guidelinesText: action.payload };

    case "SET_PAPER":
      return { ...state, paperText: action.payload };

    case "START_ANALYSIS":
      return {
        ...state,
        isAnalyzing: true,
        error: null,
        analysisResult: null,
        suggestionStatuses: {},
        paperOriginalText: state.paperText,
        correctedPaper: state.paperText,
        activeTab: "input",
      };

    case "ANALYSIS_SUCCESS":
      return {
        ...state,
        isAnalyzing: false,
        analysisResult: action.payload,
        activeTab: "results",
      };

    case "ANALYSIS_ERROR":
      return {
        ...state,
        isAnalyzing: false,
        error: action.payload,
        activeTab: "input",
      };

    case "ACCEPT_SUGGESTION": {
      const suggestion = state.analysisResult?.suggestions.find(
        (s) => s.id === action.payload
      );
      if (!suggestion) return state;
      return {
        ...state,
        suggestionStatuses: {
          ...state.suggestionStatuses,
          [action.payload]: "accepted",
        },
        correctedPaper: applySuggestion(state.correctedPaper, suggestion),
      };
    }

    case "REJECT_SUGGESTION": {
      const prevStatus = state.suggestionStatuses[action.payload];
      const suggestion = state.analysisResult?.suggestions.find(
        (s) => s.id === action.payload
      );
      let corrected = state.correctedPaper;
      if (prevStatus === "accepted" && suggestion) {
        corrected = revertSuggestion(corrected, suggestion);
      }
      return {
        ...state,
        suggestionStatuses: {
          ...state.suggestionStatuses,
          [action.payload]: "rejected",
        },
        correctedPaper: corrected,
      };
    }

    case "ACCEPT_ALL": {
      if (!state.analysisResult) return state;
      const newStatuses = { ...state.suggestionStatuses };
      let corrected = state.correctedPaper;
      for (const s of state.analysisResult.suggestions) {
        if ((newStatuses[s.id] || "pending") === "pending") {
          newStatuses[s.id] = "accepted";
          corrected = applySuggestion(corrected, s);
        }
      }
      return { ...state, suggestionStatuses: newStatuses, correctedPaper: corrected };
    }

    case "REJECT_ALL": {
      if (!state.analysisResult) return state;
      const newStatuses = { ...state.suggestionStatuses };
      let corrected = state.correctedPaper;
      for (const s of state.analysisResult.suggestions) {
        if (newStatuses[s.id] === "accepted") {
          corrected = revertSuggestion(corrected, s);
        }
        if ((newStatuses[s.id] || "pending") !== "rejected") {
          newStatuses[s.id] = "rejected";
        }
      }
      return { ...state, suggestionStatuses: newStatuses, correctedPaper: corrected };
    }

    case "SET_TAB":
      return { ...state, activeTab: action.payload };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleAnalyze = useCallback(async () => {
    dispatch({ type: "START_ANALYSIS" });

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guidelines: state.guidelinesText,
          paper: state.paperText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      dispatch({
        type: "ANALYSIS_SUCCESS",
        payload: data as AnalysisResult,
      });
    } catch (err) {
      dispatch({
        type: "ANALYSIS_ERROR",
        payload: err instanceof Error ? err.message : "Analysis failed",
      });
    }
  }, [state.guidelinesText, state.paperText]);

  const hasResults = state.analysisResult !== null;
  const hasSuggestions =
    state.analysisResult && state.analysisResult.suggestions.length > 0;

  return (
    <div className="flex flex-col min-h-full">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab navigation (when results exist) */}
        {hasResults && (
          <div className="flex gap-1 mb-6 bg-[var(--background)] rounded-lg p-1 w-fit">
            {(
              [
                { key: "input", label: "Input" },
                { key: "results", label: "Dashboard" },
                { key: "suggestions", label: "Suggestions" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() =>
                  dispatch({ type: "SET_TAB", payload: tab.key })
                }
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  state.activeTab === tab.key
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-6">
          {/* Error banner */}
          {state.error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
              <p className="font-medium">Analysis Failed</p>
              <p className="text-sm mt-1">{state.error}</p>
              <button
                onClick={() => dispatch({ type: "RESET" })}
                className="mt-2 text-sm underline"
              >
                Start over
              </button>
            </div>
          )}

          {/* Input section */}
          {(state.activeTab === "input" || !hasResults) && (
            <InputPanel
              guidelinesText={state.guidelinesText}
              paperText={state.paperText}
              onGuidelinesChange={(text) =>
                dispatch({ type: "SET_GUIDELINES", payload: text })
              }
              onPaperChange={(text) =>
                dispatch({ type: "SET_PAPER", payload: text })
              }
              onAnalyze={handleAnalyze}
              isAnalyzing={state.isAnalyzing}
            />
          )}

          {/* Loading */}
          {state.isAnalyzing && <LoadingState />}

          {/* Dashboard */}
          {state.activeTab === "results" && state.analysisResult && (
            <Dashboard result={state.analysisResult} />
          )}

          {/* Suggestions */}
          {state.activeTab === "suggestions" && state.analysisResult && (
            <>
              <SuggestionPanel
                suggestions={state.analysisResult.suggestions}
                statuses={state.suggestionStatuses}
                onAccept={(id) =>
                  dispatch({ type: "ACCEPT_SUGGESTION", payload: id })
                }
                onReject={(id) =>
                  dispatch({ type: "REJECT_SUGGESTION", payload: id })
                }
                onAcceptAll={() => dispatch({ type: "ACCEPT_ALL" })}
                onRejectAll={() => dispatch({ type: "REJECT_ALL" })}
              />
              {hasSuggestions && <ExportButton text={state.correctedPaper} />}
            </>
          )}

          {/* Export also visible from results tab */}
          {state.activeTab === "results" && state.analysisResult && (
            <ExportButton text={state.correctedPaper} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-[var(--muted)]">
          Publish Pet &mdash; AI-powered journal submission compliance checker
        </div>
      </footer>
    </div>
  );
}
