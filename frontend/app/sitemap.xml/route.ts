import { getStates } from "@/lib/api";
import { buildSitemapIndexXml, xmlResponse } from "@/lib/sitemap";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.powercut.info";

export const dynamic = "force-dynamic";

export async function GET() {
  const { states } = await getStates().catch(() => ({ states: [] }));
  const lastModified = new Date();

  const entries = [
    { url: `${SITE_URL}/sitemap-static.xml`, lastModified },
    { url: `${SITE_URL}/sitemap-content.xml`, lastModified },
    ...states.map((s) => ({
      url: `${SITE_URL}/sitemap-${s.slug}.xml`,
      lastModified,
    })),
  ];

  return xmlResponse(buildSitemapIndexXml(entries));
}
