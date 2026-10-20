import { buildUrlsetXml, xmlResponse } from "@/lib/sitemap";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.powercut.info";

const STATIC_ROUTES = [
  "",
  "/report",
  "/track",
  "/states",
  "/stats",
  "/maintenance",
  "/how-it-works",
  "/coverage",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
];

export const dynamic = "force-dynamic";

export async function GET() {
  const lastModified = new Date();
  const entries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === "" ? ("hourly" as const) : ("weekly" as const),
    priority: route === "" ? 1 : 0.6,
  }));

  return xmlResponse(buildUrlsetXml(entries));
}
