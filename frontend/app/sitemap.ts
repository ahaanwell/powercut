import type { MetadataRoute } from "next";
import { getAllPincodes, getCities, getStateDetail, getStates } from "@/lib/api";
import { slugify } from "@/lib/slugify";

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

  const stateDistrictLists = await Promise.all(
    states.map((s) => getStateDetail(s.slug).catch(() => null))
  );
  for (const detail of stateDistrictLists) {
    if (!detail) continue;
    for (const d of detail.districts) {
      entries.push({
        url: `${SITE_URL}/states/${detail.slug}/district/${d.slug}`,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 0.4,
      });
    }
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

  const { pincodes } = await getAllPincodes().catch(() => ({ pincodes: [] }));
  for (const { pincode, area } of pincodes) {
    entries.push({
      url: `${SITE_URL}/pincode/${pincode}${area ? `/${slugify(area)}` : ""}`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.3,
    });
  }

  return entries;
}
