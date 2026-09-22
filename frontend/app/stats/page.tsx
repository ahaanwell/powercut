import type { Metadata } from "next";
import Link from "next/link";
import { getStatsOverview } from "@/lib/api";
import { slugify } from "@/lib/slugify";
import StatsPageContent from "@/components/StatsPageContent";
import { ChartBarIcon, CheckCircleIcon, ShieldIcon, ClockIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Outage Statistics",
  description:
    "Live, aggregate statistics on community-reported power outages across India: active outages, top affected PIN codes, and state-by-state breakdowns.",
  alternates: { canonical: "/stats" },
};

const TRUST_BADGES = [
  { icon: ClockIcon, label: "Updates Live" },
  { icon: ShieldIcon, label: "Community Sourced" },
  { icon: CheckCircleIcon, label: "Always Free" },
  { icon: ChartBarIcon, label: "State & City Breakdown" },
];

export default async function StatsPage() {
  const stats = await getStatsOverview().catch(() => null);

  return (
    <div className="bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-900">
            <ChartBarIcon className="h-3.5 w-3.5" />
            Public Data Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-blue-950 sm:text-4xl">
            Outage Statistics
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Aggregate, real-time statistics based entirely on community reports.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {TRUST_BADGES.map((b) => (
              <span key={b.label} className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <b.icon className="h-4 w-4 text-emerald-600" />
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {!stats ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 shadow-sm">
            Statistics are temporarily unavailable.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard label="Total reports (all time)" value={stats.totalReports} />
              <StatCard label="Active outages" value={stats.activeOutages} accent="text-red-600" />
              <StatCard
                label="Restored in last 24h"
                value={stats.restoredToday}
                accent="text-emerald-600"
              />
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 bg-blue-950 px-5 py-3">
                  <ChartBarIcon className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wide text-white">
                    Top Affected PIN Codes (24h)
                  </span>
                </div>
                <div className="p-5">
                  {stats.topPincodes.length === 0 ? (
                    <p className="text-sm text-zinc-500">No reports in the last 24 hours.</p>
                  ) : (
                    <ul className="space-y-2">
                      {stats.topPincodes.map((p) => (
                        <li key={p.pincode}>
                          <Link
                            href={`/pincode/${p.pincode}`}
                            className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-2.5 hover:border-amber-400"
                          >
                            <span className="text-sm">
                              <span className="font-semibold text-zinc-900">{p.pincode}</span>{" "}
                              <span className="text-zinc-400">&middot; {p.state}</span>
                            </span>
                            <span className="font-semibold text-red-600">{p.count}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 bg-blue-950 px-5 py-3">
                  <ChartBarIcon className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wide text-white">
                    Active Outages by State
                  </span>
                </div>
                <div className="p-5">
                  {stats.byState.length === 0 ? (
                    <p className="text-sm text-zinc-500">No active outages right now.</p>
                  ) : (
                    <ul className="space-y-2">
                      {stats.byState.map((s) => (
                        <li key={s.state}>
                          <Link
                            href={`/states/${slugify(s.state)}`}
                            className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-2.5 hover:border-amber-400"
                          >
                            <span className="text-sm font-semibold text-zinc-900">{s.state}</span>
                            <span className="font-semibold text-red-600">{s.count}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mt-10">
          <StatsPageContent />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = "text-zinc-900",
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 text-center shadow-sm">
      <p className={`text-3xl font-bold ${accent}`}>{value}</p>
      <p className="mt-1 text-sm text-zinc-600">{label}</p>
    </div>
  );
}
