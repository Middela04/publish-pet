"use client";

import GuidelinesInput from "./GuidelinesInput";
import PaperInput from "./PaperInput";

interface InputPanelProps {
  guidelinesText: string;
  paperText: string;
  onGuidelinesChange: (text: string) => void;
  onPaperChange: (text: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export default function InputPanel({
  guidelinesText,
  paperText,
  onGuidelinesChange,
  onPaperChange,
  onAnalyze,
  isAnalyzing,
}: InputPanelProps) {
  const canAnalyze = guidelinesText.trim().length > 0 && paperText.trim().length > 0;

  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
      <h2 className="text-lg font-semibold mb-4">Input Your Documents</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GuidelinesInput value={guidelinesText} onChange={onGuidelinesChange} />
        <PaperInput value={paperText} onChange={onPaperChange} />
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={onAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          className="px-8 py-3 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              Check Compliance
            </>
          )}
        </button>
      </div>
    </div>
  );
}
