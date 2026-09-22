import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCityDetail } from "@/lib/api";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import ReportCard from "@/components/ReportCard";
import DistrictAreaGrid from "@/components/DistrictAreaGrid";
import { BoltIcon } from "@/components/icons";

type Props = { params: Promise<{ slug: string }> };

const CITY_STATE_LABELS: Record<string, string> = {
  Mumbai: "Maharashtra",
  Bengaluru: "Karnataka",
  Pune: "Maharashtra",
  Hyderabad: "Telangana",
  Chennai: "Tamil Nadu",
  Kolkata: "West Bengal",
  Ahmedabad: "Gujarat",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCityDetail(slug).catch(() => null);
  const name = data?.city || slug;
  const state = data ? CITY_STATE_LABELS[data.city] : undefined;
  const place = state ? `${name}, ${state}` : name;
  const areaCount = data?.areas.length;

  return {
    title: { absolute: `Power Cut in ${place} Today | Live Outage Status & PIN Codes` },
    description: areaCount
      ? `Live power cut status for ${areaCount}+ areas in ${place}. Check real-time outage reports by pincode, updated by the community — free, no login required.`
      : `Recent community-reported power cuts and restoration updates across ${place}.`,
    alternates: { canonical: `/cities/${slug}` },
  };
}

export default async function CityDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCityDetail(slug).catch(() => null);
  if (!data) {
    notFound();
  }

  const activeAreas = data.areas.filter((a) => a.active).length;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: data.city, path: `/cities/${data.slug}` },
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <nav className="text-sm text-zinc-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        / {data.city}
      </nav>
      <h1 className="mt-2 flex items-center gap-2 text-3xl font-bold text-zinc-900">
        <BoltIcon className="h-7 w-7 text-amber-500" />
        {data.city}
        {CITY_STATE_LABELS[data.city] && `, ${CITY_STATE_LABELS[data.city]}`}
      </h1>
      {data.areas.length > 0 && (
        <p className="mt-1 text-zinc-600">
          {data.areas.length} areas tracked (sample) &middot;{" "}
          <span className="font-semibold text-red-600">{activeAreas} active outage areas</span>
        </p>
      )}

      {data.pincodeCounts.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-zinc-900">Most affected PIN codes</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.pincodeCounts.map((p) => (
              <Link
                key={p.pincode}
                href={`/pincode/${p.pincode}`}
                className="rounded-full bg-white px-3 py-1 text-sm font-medium text-zinc-700 ring-1 ring-zinc-200 hover:ring-amber-400"
              >
                {p.pincode} <span className="text-red-600">({p.count})</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {data.areas.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-zinc-900">Areas &amp; PIN codes</h2>
          <p className="mt-1 text-sm text-zinc-500">
            A sample of tracked localities across {data.city} &mdash; not an exhaustive directory.
          </p>
          <div className="mt-4">
            <DistrictAreaGrid areas={data.areas} />
          </div>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-lg font-bold text-zinc-900">Recent reports</h2>
        {data.reports.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">No reports yet for {data.city}.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {data.reports.map((report) => (
              <ReportCard key={report._id} report={report} showPincode />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
