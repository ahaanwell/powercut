import type { Report } from "@/lib/types";
import { timeAgo } from "@/lib/timeAgo";
import ThumbConfirmButton from "./ThumbConfirmButton";

export default function CompactReportCard({ report }: { report: Report }) {
  const isRestored = report.status === "restored";
  const count = isRestored ? report.restoredCount : report.confirmCount;

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div>
        <p className="font-semibold text-zinc-900">Anonymous Reporter</p>
        <p className="text-xs text-zinc-500">{timeAgo(report.createdAt)}</p>
      </div>
      <div className="flex items-center gap-2">
        <ThumbConfirmButton reportId={report._id} status={report.status} count={count} />
        <span
          className={`rounded-full px-3 py-1.5 text-sm font-bold ${
            isRestored ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {isRestored ? "Power Back" : "Outage"}
        </span>
      </div>
    </div>
  );
}
