import type { Metadata } from "next";
import { getDistricts, getStates } from "@/lib/api";
import CoveragePageContent from "@/components/CoveragePageContent";
import {
  BoltIcon,
  CheckCircleIcon,
  ChartBarIcon,
  MapPinIcon,
  ShieldIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Coverage",
  description:
    "See where PowerCut's community-driven coverage is strongest across India — every PIN code, state, and district — and how it grows.",
  alternates: { canonical: "/coverage" },
};

const TRUST_BADGES = [
  { icon: MapPinIcon, label: "Every Indian PIN Code" },
  { icon: ShieldIcon, label: "No Registration Needed" },
  { icon: CheckCircleIcon, label: "Community Powered" },
  { icon: ChartBarIcon, label: "Growing Every Day" },
];

export default async function CoveragePage() {
  const [{ states }, { districts }] = await Promise.all([
    getStates().catch(() => ({ states: [] })),
    getDistricts().catch(() => ({ districts: [] })),
  ]);

  const SNAPSHOT = [
    { label: "States & UTs Tracked", value: states.length || "—" },
    { label: "District Directories", value: districts.length || "—" },
    { label: "PIN Codes Supported", value: "All 6-Digit Codes" },
  ];

  return (
    <div className="bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-900">
            <MapPinIcon className="h-3.5 w-3.5" />
            Nationwide Coverage
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-blue-950 sm:text-4xl">Coverage</h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            PowerCut covers every valid 6-digit Indian PIN code — there&apos;s no
            registration or approval process for an area to be trackable.
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
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 bg-blue-950 px-5 py-3">
            <BoltIcon className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wide text-white">
              Coverage Snapshot
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 p-5 sm:p-6 md:grid-cols-4">
            {SNAPSHOT.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-extrabold text-blue-950 sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-zinc-500">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-4 text-zinc-600">
          <p>
            The quality and freshness of data for any given PIN code depends entirely on how many
            people in that area are actively reporting and confirming outages. Coverage is
            naturally strongest in areas with more active users. If your area has sparse or
            outdated reports, the best way to improve it is to report outages yourself and share
            the tracker with neighbors.
          </p>
        </div>

        <CoveragePageContent />
      </div>
    </div>
  );
}
