import { buildUrlsetXml, xmlResponse } from "@/lib/sitemap";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.powercut.info";

const DISTRICT_SLUGS = [
  "new-delhi",
  "north-delhi",
  "south-delhi",
  "mumbai",
  "bangalore",
  "pune",
  "hyderabad",
  "chennai",
  "kolkata",
  "ahmedabad",
];

export const dynamic = "force-dynamic";

export async function GET() {
  const lastModified = new Date();
  const entries = DISTRICT_SLUGS.map((slug) => ({
    url: `${SITE_URL}/district/${slug}`,
    lastModified,
    changeFrequency: "hourly" as const,
    priority: 0.5,
  }));

  return xmlResponse(buildUrlsetXml(entries));
}
