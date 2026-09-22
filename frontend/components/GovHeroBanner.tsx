import Link from "next/link";
import { getStatsOverview } from "@/lib/api";
import HeroSearchBar from "./HeroSearchBar";
import { BoltIcon, CheckCircleIcon, ShieldIcon } from "./icons";

export default async function GovHeroBanner() {
  const stats = await getStatsOverview().catch(() => null);

  return (
    <section className="relative overflow-hidden bg-blue-950 pb-20 pt-14 sm:pt-16">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-400">
          <ShieldIcon className="h-3.5 w-3.5" />
          Community Citizen Service Portal
        </p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          Real-Time Power Outage
          <br />
          Reporting &amp; Monitoring System
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-blue-200 sm:text-base">
          A citizen-driven initiative to report, verify, and track electricity supply
          disruptions across India &mdash; enter your PIN code for live status.
        </p>

        <div className="mx-auto mt-8 max-w-2xl rounded-lg bg-white p-3 text-left shadow-xl">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-zinc-500">
            Check Outage Status by PIN Code
          </p>
          <HeroSearchBar />
        </div>

        <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/report"
            className="flex items-center justify-center gap-2 rounded bg-red-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-red-700"
          >
            <BoltIcon className="h-4 w-4" />
            Report Outage
          </Link>
          <Link
            href="/report?status=restored"
            className="flex items-center justify-center gap-2 rounded bg-emerald-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-emerald-700"
          >
            <CheckCircleIcon className="h-4 w-4" />
            Power is Back
          </Link>
        </div>

        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 divide-x divide-blue-800 rounded-lg border border-blue-800 bg-blue-900/40">
          <StatBadge label="Total Reports" value={stats?.totalReports} />
          <StatBadge label="Active Outages" value={stats?.activeOutages} accent="text-red-400" />
          <StatBadge label="Restored (24h)" value={stats?.restoredToday} accent="text-emerald-400" />
        </div>
      </div>
    </section>
  );
}

function StatBadge({
  label,
  value,
  accent = "text-white",
}: {
  label: string;
  value?: number;
  accent?: string;
}) {
  return (
    <div className="px-4 py-4 text-center">
      <p className={`text-2xl font-extrabold ${accent}`}>{value ?? "—"}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-blue-300">{label}</p>
    </div>
  );
}
