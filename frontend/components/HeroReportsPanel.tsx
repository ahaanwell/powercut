import Link from "next/link";
import { getRecentReports } from "@/lib/api";
import { timeAgo } from "@/lib/timeAgo";
import { BoltIcon } from "./icons";

export default async function HeroReportsPanel() {
  const { reports } = await getRecentReports(6).catch(() => ({ reports: [] }));

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
          <BoltIcon className="h-5 w-5 text-amber-600" />
          Live Reports
        </h2>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 ring-1 ring-inset ring-amber-600/20">
          <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
          LIVE
        </span>
      </div>
      {reports.length === 0 ? (
        <p className="rounded-xl bg-white p-4 text-sm text-zinc-500 shadow-sm ring-1 ring-zinc-200">
          No recent reports right now.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {reports.map((r) => {
            const isRestored = r.status === "restored";
            return (
              <li key={r._id}>
                <Link
                  href={`/pincode/${r.pincode}`}
                  className={`flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-zinc-200 ${
                    isRestored ? "hover:ring-emerald-400" : "hover:ring-amber-400"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${isRestored ? "bg-emerald-500" : "bg-red-500"}`}
                    />
                    <div>
                      <p className="font-semibold text-zinc-900">{r.area || r.pincode}</p>
                      <p className="text-xs text-zinc-500">
                        <span className={`font-bold ${isRestored ? "text-emerald-600" : "text-red-600"}`}>
                          {isRestored ? "RESTORED" : "ACTIVE"}
                        </span>{" "}
                        &middot; {timeAgo(isRestored ? r.restoredAt || r.updatedAt : r.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-zinc-500">{r.pincode}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
