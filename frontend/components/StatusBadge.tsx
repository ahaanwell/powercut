import type { ReportStatus } from "@/lib/types";

const STYLES: Record<string, string> = {
  reported: "bg-amber-100 text-amber-800 ring-amber-600/20",
  ongoing: "bg-red-100 text-red-800 ring-red-600/20",
  restored: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  "no-recent-reports": "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
};

const LABELS: Record<string, string> = {
  reported: "Reported",
  ongoing: "Outage ongoing",
  restored: "Power restored",
  "no-recent-reports": "No recent reports",
};

export default function StatusBadge({
  status,
}: {
  status: ReportStatus | "no-recent-reports";
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset ${
        STYLES[status] ?? STYLES["no-recent-reports"]
      }`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
