export default function LoadingState() {
  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-12 flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-[var(--border)] rounded-full" />
        <div className="absolute inset-0 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-[var(--foreground)]">
          Analyzing your paper...
        </p>
        <p className="text-sm text-[var(--muted)] mt-1">
          Checking formatting, structure, word limits, and citations against the
          guidelines. This may take a moment.
        </p>
      </div>
    </div>
  );
}
