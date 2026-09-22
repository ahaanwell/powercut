import type { MetadataRoute } from "next";
import { getCities, getStates } from "@/lib/api";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
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

  const [{ states }, { cities }] = await Promise.all([
    getStates().catch(() => ({ states: [] })),
    getCities().catch(() => ({ cities: [] })),
  ]);

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "hourly" : "weekly",
    priority: route === "" ? 1 : 0.6,
  }));

  for (const s of states) {
    entries.push({
      url: `${SITE_URL}/states/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.5,
    });
  }

  for (const c of cities) {
    entries.push({
      url: `${SITE_URL}/cities/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.5,
    });
  }

  for (const slug of DISTRICT_SLUGS) {
    entries.push({
      url: `${SITE_URL}/district/${slug}`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.5,
    });
  }

  return entries;
}
