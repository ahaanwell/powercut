const Report = require("../models/Report");
const { PREFIX_STATE_MAP, getPrefixesForState } = require("../utils/pincodeState");
const { CITY_PREFIXES, pincodeRegexForCity } = require("../utils/cityPincodes");
const { scanAreas, withActiveStatus } = require("../utils/areaScan");
const slugify = require("../utils/slugify");

function resolveBySlug(names, slug) {
  return names.find((name) => slugify(name) === slug) || null;
}

const AREA_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const cityAreasCache = new Map();
const stateAreasCache = new Map();
const CITY_SCAN_RANGE = { from: 1, to: 150 };
const STATE_SCAN_RANGE = { from: 1, to: 60 };

async function getCachedAreas(cache, key, prefixes, range) {
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }
  const areas = await scanAreas({ prefixes, from: range.from, to: range.to });
  cache.set(key, { data: areas, expiresAt: Date.now() + AREA_CACHE_TTL_MS });
  return areas;
}

async function getOverallStats(req, res, next) {
  try {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [totalReports, activeOutages, restoredToday, topPincodes, byState] = await Promise.all([
      Report.countDocuments(),
      Report.countDocuments({ status: { $in: ["reported", "ongoing"] } }),
      Report.countDocuments({ status: "restored", restoredAt: { $gte: since24h } }),
      Report.aggregate([
        { $match: { createdAt: { $gte: since24h } } },
        { $group: { _id: "$pincode", count: { $sum: 1 }, state: { $first: "$state" } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, pincode: "$_id", count: 1, state: 1 } },
      ]),
      Report.aggregate([
        { $match: { status: { $in: ["reported", "ongoing"] } } },
        { $group: { _id: "$state", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { _id: 0, state: "$_id", count: 1 } },
      ]),
    ]);

    res.json({ totalReports, activeOutages, restoredToday, topPincodes, byState });
  } catch (err) {
    next(err);
  }
}

async function listStates(req, res, next) {
  try {
    const counts = await Report.aggregate([
      { $match: { status: { $in: ["reported", "ongoing"] } } },
      { $group: { _id: "$state", activeCount: { $sum: 1 } } },
      { $project: { _id: 0, state: "$_id", activeCount: 1 } },
    ]);
    const countMap = new Map(counts.map((c) => [c.state, c.activeCount]));

    const allStates = [...new Set(Object.values(PREFIX_STATE_MAP))].sort();
    const states = allStates.map((state) => ({
      state,
      slug: slugify(state),
      activeCount: countMap.get(state) || 0,
    }));

    res.json({ states });
  } catch (err) {
    next(err);
  }
}

async function getStateDetail(req, res, next) {
  try {
    const { slug } = req.params;
    const allStates = [...new Set(Object.values(PREFIX_STATE_MAP))];
    const state = resolveBySlug(allStates, slug);
    if (!state) {
      return res.status(404).json({ message: "Unknown state" });
    }

    const reports = await Report.find({ state }).sort({ createdAt: -1 }).limit(100);

    const pincodeCounts = await Report.aggregate([
      { $match: { state, status: { $in: ["reported", "ongoing"] } } },
      { $group: { _id: "$pincode", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      { $project: { _id: 0, pincode: "$_id", count: 1 } },
    ]);

    const prefixes = getPrefixesForState(state);
    const rawAreas = await getCachedAreas(stateAreasCache, slug, prefixes, STATE_SCAN_RANGE);
    const areas = await withActiveStatus(rawAreas);

    res.json({ state, slug, reports, pincodeCounts, areas });
  } catch (err) {
    next(err);
  }
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function riskLevelFor(uptimePercent) {
  if (uptimePercent >= 95) return "low";
  if (uptimePercent >= 80) return "moderate";
  return "high";
}

async function getPincodeScore(req, res, next) {
  try {
    const { pincode } = req.params;
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      return res.status(400).json({ message: "Invalid pincode format" });
    }

    const since = new Date(Date.now() - THIRTY_DAYS_MS);
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const reports = await Report.find({ pincode, createdAt: { $gte: since } });

    const activeOutages24h = reports.filter(
      (r) => r.createdAt >= since24h && r.status !== "restored"
    ).length;

    if (reports.length === 0) {
      return res.json({ pincode, sampleSize: 0, activeOutages24h: 0, totalReports30d: 0 });
    }

    const now = Date.now();
    let totalDowntimeMs = 0;
    for (const r of reports) {
      const start = r.createdAt.getTime();
      const end = r.status === "restored" && r.restoredAt ? r.restoredAt.getTime() : now;
      totalDowntimeMs += Math.max(0, end - start);
    }
    totalDowntimeMs = Math.min(totalDowntimeMs, THIRTY_DAYS_MS);

    const uptimePercent = Math.round((100 - (totalDowntimeMs / THIRTY_DAYS_MS) * 100) * 10) / 10;

    res.json({
      pincode,
      sampleSize: reports.length,
      uptimePercent,
      riskLevel: riskLevelFor(uptimePercent),
      activeOutages24h,
      totalReports30d: reports.length,
    });
  } catch (err) {
    next(err);
  }
}

const TREND_BUCKET_COUNT = 7;
const TREND_BUCKET_DAYS = 13;
const TREND_DAY_MS = 24 * 60 * 60 * 1000;

function trendLevelFor(count) {
  if (count === 0) return "none";
  if (count >= 5) return "high";
  return "low";
}

async function getPincodeTrend(req, res, next) {
  try {
    const { pincode } = req.params;
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      return res.status(400).json({ message: "Invalid pincode format" });
    }

    const bucketMs = TREND_BUCKET_DAYS * TREND_DAY_MS;
    const rangeStart = new Date(Date.now() - TREND_BUCKET_COUNT * bucketMs);

    const reports = await Report.find(
      { pincode, createdAt: { $gte: rangeStart } },
      { createdAt: 1 }
    );

    const buckets = Array.from({ length: TREND_BUCKET_COUNT }, (_, i) => {
      const start = new Date(rangeStart.getTime() + i * bucketMs);
      return { start, count: 0 };
    });

    for (const r of reports) {
      const offset = r.createdAt.getTime() - rangeStart.getTime();
      const index = Math.min(TREND_BUCKET_COUNT - 1, Math.max(0, Math.floor(offset / bucketMs)));
      buckets[index].count += 1;
    }

    const points = buckets.map((b) => ({
      label: b.start.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count: b.count,
      level: trendLevelFor(b.count),
    }));

    res.json({ pincode, points });
  } catch (err) {
    next(err);
  }
}

async function listCities(req, res, next) {
  try {
    const cities = await Promise.all(
      Object.keys(CITY_PREFIXES).map(async (city) => {
        const activeCount = await Report.countDocuments({
          status: { $in: ["reported", "ongoing"] },
          pincode: pincodeRegexForCity(city),
        });
        return { city, slug: slugify(city), activeCount };
      })
    );
    res.json({ cities });
  } catch (err) {
    next(err);
  }
}

async function getCityDetail(req, res, next) {
  try {
    const { slug } = req.params;
    const city = resolveBySlug(Object.keys(CITY_PREFIXES), slug);
    const regex = city ? pincodeRegexForCity(city) : null;
    if (!regex) {
      return res.status(404).json({ message: "Unknown city" });
    }

    const reports = await Report.find({ pincode: regex }).sort({ createdAt: -1 }).limit(100);

    const pincodeCounts = await Report.aggregate([
      { $match: { pincode: regex, status: { $in: ["reported", "ongoing"] } } },
      { $group: { _id: "$pincode", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      { $project: { _id: 0, pincode: "$_id", count: 1 } },
    ]);

    const rawAreas = await getCachedAreas(cityAreasCache, slug, CITY_PREFIXES[city], CITY_SCAN_RANGE);
    const areas = await withActiveStatus(rawAreas);

    res.json({ city, slug, reports, pincodeCounts, areas });
  } catch (err) {
    next(err);
  }
}

async function warmCityCache() {
  for (const city of Object.keys(CITY_PREFIXES)) {
    const slug = slugify(city);
    try {
      await getCachedAreas(cityAreasCache, slug, CITY_PREFIXES[city], CITY_SCAN_RANGE);
      console.log(`[warm] cached areas for city: ${city}`);
    } catch (err) {
      console.error(`[warm] failed for city ${city}:`, err.message);
    }
  }
}

module.exports = {
  getOverallStats,
  listStates,
  getStateDetail,
  getPincodeScore,
  getPincodeTrend,
  listCities,
  getCityDetail,
  warmCityCache,
};
