import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStateDetail } from "@/lib/api";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import ReportCard from "@/components/ReportCard";
import DistrictAreaGrid from "@/components/DistrictAreaGrid";
import StateDetailContent from "@/components/StateDetailContent";
import { BoltIcon, MapPinIcon, ShieldIcon, CheckCircleIcon, ChartBarIcon } from "@/components/icons";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getStateDetail(slug).catch(() => null);
  const name = data?.state || slug;
  const areaCount = data?.areas.length;

  return {
    title: { absolute: `Power Cut in ${name} Today | Live Outage Map & PIN Code Status` },
    description: areaCount
      ? `Live power cut status for ${areaCount}+ areas across ${name}. Check real-time outage reports by PIN code, updated by the community — free, no login required.`
      : `Recent community-reported power cuts and restoration updates across ${name}.`,
    alternates: { canonical: `/states/${slug}` },
  };
}

const TRUST_BADGES = [
  { icon: ShieldIcon, label: "Community Sourced" },
  { icon: MapPinIcon, label: "By PIN Code" },
  { icon: CheckCircleIcon, label: "Always Free" },
  { icon: ChartBarIcon, label: "Updates Live" },
];

export default async function StateDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await getStateDetail(slug).catch(() => null);
  if (!data) {
    notFound();
  }

  const activeAreas = data.areas.filter((a) => a.active).length;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "States", path: "/states" },
    { name: data.state, path: `/states/${data.slug}` },
  ]);

  return (
    <div className="bg-zinc-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <nav className="text-sm text-zinc-500">
            <Link href="/states" className="hover:underline">
              States
            </Link>{" "}
            / {data.state}
          </nav>
          <h1 className="mt-2 flex items-center gap-2 text-3xl font-extrabold text-blue-950 sm:text-4xl">
            <BoltIcon className="h-7 w-7 text-amber-500" />
            Power Cut in {data.state}
          </h1>
          {data.areas.length > 0 && (
            <p className="mt-1 text-zinc-600">
              {data.areas.length} areas tracked (sample) &middot;{" "}
              <span className="font-semibold text-red-600">{activeAreas} active outage areas</span>
            </p>
          )}

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
        {data.pincodeCounts.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 bg-blue-950 px-5 py-3">
              <ChartBarIcon className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wide text-white">
                Most Affected PIN Codes
              </span>
            </div>
            <div className="flex flex-wrap gap-2 p-5">
              {data.pincodeCounts.map((p) => (
                <Link
                  key={p.pincode}
                  href={`/pincode/${p.pincode}`}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm font-medium text-zinc-700 hover:border-amber-400"
                >
                  {p.pincode} <span className="text-red-600">({p.count})</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {data.areas.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-zinc-900">Areas &amp; PIN Codes</h2>
            <p className="mt-1 text-sm text-zinc-500">
              A sample of tracked localities across {data.state} &mdash; not an exhaustive
              directory.
            </p>
            <div className="mt-4">
              <DistrictAreaGrid areas={data.areas} />
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-lg font-bold text-zinc-900">Recent Reports</h2>
          {data.reports.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500">No reports yet for {data.state}.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {data.reports.map((report) => (
                <ReportCard key={report._id} report={report} showPincode />
              ))}
            </ul>
          )}
        </div>

        <StateDetailContent state={data.state} />
      </div>
    </div>
  );
}
