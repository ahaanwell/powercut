import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStateDistrictDetail } from "@/lib/api";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import DistrictAreaGrid from "@/components/DistrictAreaGrid";
import ReportCard from "@/components/ReportCard";
import ShareButtons from "@/components/ShareButtons";
import DistrictDetailContent from "@/components/DistrictDetailContent";
import { BoltIcon } from "@/components/icons";

type Props = { params: Promise<{ slug: string; districtSlug: string }> };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.powercut.info";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, districtSlug } = await params;
  const data = await getStateDistrictDetail(slug, districtSlug).catch(() => null);
  const district = data?.district || districtSlug;
  const state = data?.state;
  const place = state ? `${district}, ${state}` : district;

  return {
    title: { absolute: `Power Cut in ${place} Today | Areas & Pincodes Live Status` },
    description: data
      ? `Live power cut status for ${data.totalAreas}+ areas in ${place}. Check real-time outage reports by PIN code, updated by the community — free, no login required.`
      : `Live power outage status for every tracked area in ${place}, updated by the community.`,
    alternates: { canonical: `/states/${slug}/district/${districtSlug}` },
  };
}

export default async function StateDistrictPage({ params }: Props) {
  const { slug, districtSlug } = await params;
  const data = await getStateDistrictDetail(slug, districtSlug).catch(() => null);
  if (!data) {
    notFound();
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "States", path: "/states" },
    { name: data.state, path: `/states/${data.stateSlug}` },
    { name: data.district, path: `/states/${data.stateSlug}/district/${data.districtSlug}` },
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <nav className="text-sm text-zinc-500">
        <Link href="/states" className="hover:underline">
          States
        </Link>{" "}
        /{" "}
        <Link href={`/states/${data.stateSlug}`} className="hover:underline">
          {data.state}
        </Link>{" "}
        / {data.district}
      </nav>

      <h1 className="mt-2 flex items-center gap-3 text-4xl font-extrabold text-zinc-900">
        <BoltIcon className="h-8 w-8 text-amber-500" />
        Power Cut in {data.district}, {data.state}
      </h1>
      <p className="mt-2 text-zinc-600">
        {data.totalAreas} areas tracked (sample) &middot;{" "}
        <span className="font-semibold text-red-600">{data.activeAreas} active outage areas</span>
      </p>

      <div className="mt-8">
        <DistrictAreaGrid areas={data.areas} />
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-bold text-zinc-900">Recent Reports</h2>
        {data.reports.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">No reports yet for {data.district}.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {data.reports.map((report) => (
              <ReportCard key={report._id} report={report} showPincode />
            ))}
          </ul>
        )}
      </div>

      <ShareButtons
        url={`${SITE_URL}/states/${data.stateSlug}/district/${data.districtSlug}`}
        text={`Power cut status for ${data.district}, ${data.state}`}
      />

      <DistrictDetailContent
        district={data.district}
        state={data.state}
        totalAreas={data.totalAreas}
        activeAreas={data.activeAreas}
        backHref={`/states/${data.stateSlug}`}
        backLabel={`browse every district in ${data.state}`}
      />
    </div>
  );
}
