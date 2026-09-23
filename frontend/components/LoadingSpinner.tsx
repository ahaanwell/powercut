export default function LoadingSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 py-20">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-amber-500"
        role="status"
        aria-label={label}
      />
      <p className="text-sm font-semibold text-zinc-500">{label}</p>
    </div>
  );
}
