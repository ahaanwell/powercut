import type { Metadata } from "next";
import Link from "next/link";
import { getStates } from "@/lib/api";
import StatesIndexContent from "@/components/StatesIndexContent";
import { MapPinIcon, ChartBarIcon, ShieldIcon, CheckCircleIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Browse Power Outage Reports by State",
  description:
    "Browse live, community-reported power outage activity across every Indian state and union territory.",
  alternates: { canonical: "/states" },
};

const TRUST_BADGES = [
  { icon: MapPinIcon, label: "Every State & UT" },
  { icon: ShieldIcon, label: "Community Sourced" },
  { icon: CheckCircleIcon, label: "Always Free" },
  { icon: ChartBarIcon, label: "Updates Live" },
];

export default async function StatesPage() {
  const { states } = await getStates().catch(() => ({ states: [] }));

  return (
    <div className="bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-900">
            <MapPinIcon className="h-3.5 w-3.5" />
            Regional Directory
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-blue-950 sm:text-4xl">
            Browse by State
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            See active, community-reported outages grouped by state and union territory.
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
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {states.map((s) => (
            <li key={s.state}>
              <Link
                href={`/states/${s.slug}`}
                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm hover:border-amber-400"
              >
                <span className="font-medium text-zinc-900">{s.state}</span>
                <span
                  className={`text-sm font-semibold ${
                    s.activeCount > 0 ? "text-red-600" : "text-zinc-400"
                  }`}
                >
                  {s.activeCount} active
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <StatesIndexContent />
      </div>
    </div>
  );
}
