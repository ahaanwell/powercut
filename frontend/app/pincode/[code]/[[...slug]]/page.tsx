import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPincodeGeocode, getPincodeLocalities, getPincodeStatus } from "@/lib/api";
import type { ReportStatus } from "@/lib/types";
import { isValidPincode } from "@/lib/pincode";
import { timeAgo } from "@/lib/timeAgo";
import { slugify } from "@/lib/slugify";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import CompactReportCard from "@/components/CompactReportCard";
import NearbyPincodesCard from "@/components/NearbyPincodesCard";
import PincodeScoreCard from "@/components/PincodeScoreCard";
import PincodeStatTiles from "@/components/PincodeStatTiles";
import DiscomScheduleCard from "@/components/DiscomScheduleCard";
import OutageTrendChart from "@/components/OutageTrendChart";
import NotifyMeButton from "@/components/NotifyMeButton";
import NeighborhoodComments from "@/components/NeighborhoodComments";
import PincodeMap from "@/components/PincodeMap";
import QuickReportButtons from "@/components/QuickReportButtons";
import PincodeDetailContent from "@/components/PincodeDetailContent";
import { AlertCircleIcon, CheckCircleIcon, PhoneIcon } from "@/components/icons";

// The optional [[...slug]] segment (e.g. /pincode/800001/bank-road) is a
// cosmetic, SEO-friendly locality suffix only — lookups are always keyed by
// `code` alone, and the canonical URL always points at the bare /pincode/{code}
// form regardless of which slug (if any) was used to reach this page.
type Props = { params: Promise<{ code: string; slug?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const [status, localitiesRes] = await Promise.all([
    getPincodeStatus(code).catch(() => null),
    getPincodeLocalities(code).catch(() => ({ localities: [] })),
  ]);

  const locality = status?.reports[0]?.area || localitiesRes.localities[0]?.name || "";
  const state = status?.state;
  const place = [locality, code, state].filter(Boolean).join(", ");
  const reportCount = status?.reports.length ?? 0;

  return {
    title: { absolute: `Power Cut in ${place} Today | Live Status & Reports` },
    description: reportCount
      ? `Live power cut status for PIN code ${code}${locality ? ` (${locality})` : ""}${state ? `, ${state}` : ""} — ${reportCount} recent report${reportCount === 1 ? "" : "s"}. Check status, report an outage, or confirm restoration.`
      : `Live, community-reported power outage status, recent reports, and restoration updates for PIN code ${code}.`,
    alternates: { canonical: `/pincode/${code}` },
  };
}

const STATUS_DISPLAY = {
  reported: { label: "Outage", pill: "bg-red-50 text-red-700 ring-red-600/20", icon: AlertCircleIcon },
  ongoing: { label: "Outage", pill: "bg-red-50 text-red-700 ring-red-600/20", icon: AlertCircleIcon },
  restored: {
    label: "Restored",
    pill: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    icon: CheckCircleIcon,
  },
  "no-recent-reports": {
    label: "No Reports Yet",
    pill: "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
    icon: AlertCircleIcon,
  },
} as const;

function countRecentReports(reports: { createdAt: string }[], hours: number): number {
  const since = Date.now() - hours * 60 * 60 * 1000;
  return reports.filter((r) => new Date(r.createdAt).getTime() >= since).length;
}

// Geocoding goes through Nominatim, which the backend serializes to ~1
// request/second across the whole app (its usage policy) — on a busy
// backend that queue can back up behind unrelated requests (e.g. the live
// grid map warming up). Fetching it here, in its own Suspense boundary,
// means a slow/queued geocode never blocks the rest of the page from
// rendering immediately.
async function PincodeMapSection({
  pincode,
  locality,
  status,
  reportCount24h,
  lastReportedAt,
}: {
  pincode: string;
  locality: string;
  status: ReportStatus | "no-recent-reports";
  reportCount24h: number;
  lastReportedAt: string | null;
}) {
  const geocode = await getPincodeGeocode(pincode).catch(() => ({ lat: null, lng: null }));
  return (
    <PincodeMap
      pincode={pincode}
      locality={locality}
      status={status}
      reportCount24h={reportCount24h}
      lastReportedAt={lastReportedAt}
      lat={geocode.lat}
      lng={geocode.lng}
    />
  );
}

const MAP_SKELETON = (
  <div className="flex h-80 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 text-sm text-zinc-500">
    Loading map&hellip;
  </div>
);

const CARD_SKELETON = (
  <div className="h-40 animate-pulse rounded-2xl border border-zinc-200 bg-white shadow-sm" />
);

export default async function PincodeStatusPage({ params }: Props) {
  const { code } = await params;
  if (!isValidPincode(code)) {
    notFound();
  }

  const [data, localitiesRes] = await Promise.all([
    getPincodeStatus(code).catch(() => null),
    getPincodeLocalities(code).catch(() => ({ localities: [] })),
  ]);
  if (!data) {
    notFound();
  }

  const localities = localitiesRes.localities;
  const primaryLocality = data.reports[0]?.area || localities[0]?.name || "";
  const district = localities[0]?.district || "";
  const status = STATUS_DISPLAY[data.currentStatus];
  const StatusIcon = status.icon;

  const subtitleParts = [data.pincode, primaryLocality, district, data.state].filter(Boolean);

  const reportCount24h = countRecentReports(data.reports, 24);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: data.state, path: `/states/${slugify(data.state)}` },
    ...(district
      ? [
          {
            name: district,
            path: `/states/${slugify(data.state)}/district/${slugify(district)}`,
          },
        ]
      : []),
    { name: `PIN Code ${data.pincode}`, path: `/pincode/${data.pincode}` },
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <nav className="flex flex-wrap items-center gap-1 text-xs font-bold uppercase tracking-wide text-zinc-500">
        <Link href="/" className="hover:text-zinc-900">
          Home
        </Link>
        <span>/</span>
        <Link href={`/states/${slugify(data.state)}`} className="hover:text-zinc-900">
          {data.state}
        </Link>
        {district && (
          <>
            <span>/</span>
            <Link
              href={`/states/${slugify(data.state)}/district/${slugify(district)}`}
              className="hover:text-zinc-900"
            >
              {district}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-amber-600">{data.pincode}</span>
      </nav>

      <div className="mt-4 grid gap-6 lg:grid-cols-5 lg:items-start">
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            {data.lastReportedAt && (
              <p className="text-right text-xs text-zinc-500">
                Updated {timeAgo(data.lastReportedAt)}
              </p>
            )}

            <div className="text-center">
              <h1 className="mt-2 flex items-center justify-center gap-2 text-3xl font-bold text-zinc-900">
                <StatusIcon
                  className={`h-7 w-7 ${
                    data.currentStatus === "restored" ? "text-emerald-600" : "text-red-600"
                  }`}
                />
                {primaryLocality || data.pincode}
              </h1>
              <p className="mt-2 text-zinc-500">{subtitleParts.join(", ")}</p>

              <span
                className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold ring-1 ring-inset ${status.pill}`}
              >
                {status.label}
              </span>
            </div>

            <div className="mt-6">
              <QuickReportButtons pincode={data.pincode} />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-600">
              <span>Call your electricity provider.</span>
              <a
                href="tel:1912"
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-1.5 font-bold text-black hover:bg-amber-300"
              >
                <PhoneIcon className="h-4 w-4" />
                1912
              </a>
            </div>
          </div>

          <Suspense fallback={MAP_SKELETON}>
            <PincodeMapSection
              pincode={data.pincode}
              locality={primaryLocality}
              status={data.currentStatus}
              reportCount24h={reportCount24h}
              lastReportedAt={data.lastReportedAt}
            />
          </Suspense>

          <div>
            <h2 className="text-lg font-bold text-zinc-900">Recent Reports in this Area</h2>
            {data.reports.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-500">
                No reports yet for this PIN code. Be the first to report an outage above.
              </p>
            ) : (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {data.reports.map((report) => (
                  <CompactReportCard key={report._id} report={report} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <Suspense fallback={CARD_SKELETON}>
            <NearbyPincodesCard pincode={data.pincode} state={data.state} />
          </Suspense>
          <Suspense fallback={CARD_SKELETON}>
            <PincodeScoreCard pincode={data.pincode} areaLabel={primaryLocality || data.pincode} />
          </Suspense>
          <Suspense fallback={CARD_SKELETON}>
            <PincodeStatTiles pincode={data.pincode} />
          </Suspense>
          <Suspense fallback={CARD_SKELETON}>
            <DiscomScheduleCard pincode={data.pincode} />
          </Suspense>
          <Suspense fallback={CARD_SKELETON}>
            <OutageTrendChart pincode={data.pincode} />
          </Suspense>
          <NotifyMeButton pincode={data.pincode} />
          <Suspense fallback={CARD_SKELETON}>
            <NeighborhoodComments pincode={data.pincode} />
          </Suspense>
        </div>
      </div>

      <PincodeDetailContent
        pincode={data.pincode}
        place={primaryLocality}
        district={district}
        state={data.state}
        reportCount={data.reports.length}
      />
    </div>
  );
}
