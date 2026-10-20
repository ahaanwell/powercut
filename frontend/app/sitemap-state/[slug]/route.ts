import { getStateDetail, getStatePincodes } from "@/lib/api";
import { slugify } from "@/lib/slugify";
import { buildUrlsetXml, xmlResponse } from "@/lib/sitemap";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.powercut.info";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const detail = await getStateDetail(slug).catch(() => null);

  if (!detail) {
    return xmlResponse(buildUrlsetXml([]));
  }

  const { pincodes } = await getStatePincodes(slug).catch(() => ({ pincodes: [] }));

  const lastModified = new Date();

  const entries = [
    {
      url: `${SITE_URL}/states/${detail.slug}`,
      lastModified,
      changeFrequency: "hourly" as const,
      priority: 0.5,
    },
    ...detail.districts.map((d) => ({
      url: `${SITE_URL}/states/${detail.slug}/district/${d.slug}`,
      lastModified,
      changeFrequency: "hourly" as const,
      priority: 0.4,
    })),
    ...pincodes.map(({ pincode, area }) => ({
      url: `${SITE_URL}/pincode/${pincode}${area ? `/${slugify(area)}` : ""}`,
      lastModified,
      changeFrequency: "hourly" as const,
      priority: 0.3,
    })),
  ];

  return xmlResponse(buildUrlsetXml(entries));
}
