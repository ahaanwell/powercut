import { getPincodeScore } from "@/lib/api";
import type { RiskLevel } from "@/lib/types";
import { AlertCircleIcon, ShieldIcon } from "./icons";

const RISK_LABELS: Record<RiskLevel, string> = {
  low: "Low Outage Risk",
  moderate: "Moderate Outage Risk",
  high: "High Outage Risk",
};

const RISK_STYLES: Record<RiskLevel, { text: string; bar: string; pill: string }> = {
  low: {
    text: "text-emerald-600",
    bar: "bg-emerald-500",
    pill: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  moderate: {
    text: "text-amber-600",
    bar: "bg-amber-500",
    pill: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
  high: {
    text: "text-red-600",
    bar: "bg-red-500",
    pill: "bg-red-50 text-red-700 ring-red-600/20",
  },
};

export default async function PincodeScoreCard({
  pincode,
  areaLabel,
}: {
  pincode: string;
  areaLabel: string;
}) {
  const score = await getPincodeScore(pincode).catch(() => null);
  const risk = score?.riskLevel;
  const styles = risk ? RISK_STYLES[risk] : null;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2.5">
        <ShieldIcon className="h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <p className="font-bold text-zinc-900">Area Power Score</p>
          <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-500">
            30-day grid uptime
          </p>
        </div>
      </div>

      {!score || score.sampleSize === 0 || score.uptimePercent === undefined || !styles ? (
        <p className="mt-4 text-sm text-zinc-500">
          Not enough community reports yet to estimate a score for this area.
        </p>
      ) : (
        <>
          <p className={`mt-4 text-3xl font-extrabold ${styles.text}`}>
            {score.uptimePercent}% <span className="text-sm font-bold">UPTIME</span>
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className={`h-full rounded-full ${styles.bar}`}
              style={{ width: `${Math.max(2, score.uptimePercent)}%` }}
            />
          </div>
          <span
            className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${styles.pill}`}
          >
            <AlertCircleIcon className="h-3.5 w-3.5" />
            {risk && RISK_LABELS[risk]}
          </span>
          <p className="mt-3 text-xs text-zinc-500">
            Based on {score.sampleSize} crowdsourced report{score.sampleSize === 1 ? "" : "s"} &middot;
            Area {areaLabel}
          </p>
        </>
      )}
    </div>
  );
}
