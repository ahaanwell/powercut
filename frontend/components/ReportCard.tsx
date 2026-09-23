import Link from "next/link";
import type { Report } from "@/lib/types";
import { slugify } from "@/lib/slugify";
import StatusBadge from "./StatusBadge";
import ConfirmButtons from "./ConfirmButtons";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function ReportCard({
  report,
  showConfirm = false,
  showPincode = false,
}: {
  report: Report;
  showConfirm?: boolean;
  showPincode?: boolean;
}) {
  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {showPincode ? (
            <Link
              href={`/pincode/${report.pincode}${report.area ? `/${slugify(report.area)}` : ""}`}
              className="font-semibold text-zinc-900 hover:underline"
            >
              {report.pincode}
              {report.area ? ` — ${report.area}` : ""}
            </Link>
          ) : (
            <span className="font-semibold text-zinc-900">{report.area || report.pincode}</span>
          )}
          <StatusBadge status={report.status} />
        </div>
        <span className="text-xs text-zinc-500">{timeAgo(report.createdAt)}</span>
      </div>
      {report.description && <p className="mt-2 text-sm text-zinc-600">{report.description}</p>}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-zinc-500">
          {report.confirmCount} confirmed still down &middot; {report.restoredCount} confirmed restored
        </span>
        {showConfirm && report.status !== "restored" && <ConfirmButtons reportId={report._id} />}
      </div>
    </li>
  );
}
