import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDistrictDetail } from "@/lib/api";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import DistrictAreaGrid from "@/components/DistrictAreaGrid";
import ShareButtons from "@/components/ShareButtons";
import { BoltIcon } from "@/components/icons";

type Props = { params: Promise<{ slug: string }> };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.powercut.info";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getDistrictDetail(slug).catch(() => null);
  const name = data?.district || slug;
  const state = data?.state;
  const place = state ? `${name}, ${state}` : name;
  const areaCount = data?.totalAreas;

  return {
    title: { absolute: `Power Cut in ${place} Today | Areas & Pincodes Live Status` },
    description: areaCount
      ? `Live power cut status for ${areaCount}+ areas in ${place}. Check real-time outage reports by pincode, updated by the community — free, no login required.`
      : `Live power outage status for every tracked area in ${place}, updated by the community.`,
    alternates: { canonical: `/district/${slug}` },
  };
}

export default async function DistrictPage({ params }: Props) {
  const { slug } = await params;
  const data = await getDistrictDetail(slug).catch(() => null);
  if (!data) {
    notFound();
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: data.district, path: `/district/${slug}` },
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <h1 className="flex items-center gap-3 text-4xl font-extrabold text-zinc-900">
        <BoltIcon className="h-8 w-8 text-amber-500" />
        Power Cut in {data.district}, {data.state}
      </h1>
      <p className="mt-2 text-zinc-600">
        {data.totalAreas} areas tracked &middot;{" "}
        <span className="font-semibold text-red-600">{data.activeAreas} active outage areas</span>
      </p>

      <div className="mt-8">
        <DistrictAreaGrid areas={data.areas} />
      </div>

      <ShareButtons
        url={`${SITE_URL}/district/${slug}`}
        text={`Power cut status for ${data.district}`}
      />
    </div>
  );
}
