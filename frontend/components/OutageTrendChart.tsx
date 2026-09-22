import { getPincodeTrend } from "@/lib/api";
import type { TrendLevel } from "@/lib/types";
import { ChartBarIcon } from "./icons";

const LEVEL_COLOR: Record<TrendLevel, string> = {
  low: "bg-emerald-500",
  high: "bg-red-500",
  none: "bg-zinc-300",
};

const LEVEL_LABEL: Record<TrendLevel, string> = {
  low: "Low (<5)",
  high: "High (≥5)",
  none: "No reports",
};

export default async function OutageTrendChart({ pincode }: { pincode: string }) {
  const trend = await getPincodeTrend(pincode).catch(() => null);
  const points = trend?.points ?? [];
  const maxCount = Math.max(1, ...points.map((p) => p.count));

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-zinc-500">
        <ChartBarIcon className="h-4 w-4 text-amber-600" />
        90-day outage trend
      </h2>

      {points.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">Not enough data yet to show a trend.</p>
      ) : (
        <>
          <div className="mt-5 flex h-32 items-end gap-1.5 border-b border-zinc-200">
            {points.map((p, i) => {
              const heightPercent = p.count === 0 ? 3 : Math.max(8, (p.count / maxCount) * 100);
              return (
                <div
                  key={i}
                  title={`${p.label}: ${p.count} report${p.count === 1 ? "" : "s"}`}
                  className={`max-w-[24px] flex-1 rounded-t ${LEVEL_COLOR[p.level]}`}
                  style={{ height: `${heightPercent}%` }}
                />
              );
            })}
          </div>
          <div className="mt-1.5 flex gap-1.5">
            {points.map((p, i) => (
              <span key={i} className="flex-1 text-center text-[10px] text-zinc-500">
                {p.label}
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-600">
            {(["low", "high", "none"] as TrendLevel[]).map((level) => (
              <span key={level} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${LEVEL_COLOR[level]}`} />
                {LEVEL_LABEL[level]}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
