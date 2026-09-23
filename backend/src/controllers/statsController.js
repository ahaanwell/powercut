const Report = require("../models/Report");
const { PREFIX_STATE_MAP } = require("../utils/pincodeState");
const { CITY_PREFIXES, pincodeRegexForCity } = require("../utils/cityPincodes");
const { scanAreas, withActiveStatus } = require("../utils/areaScan");
const slugify = require("../utils/slugify");
// The full India Post PIN code directory (~148k post offices), bundled so
// state/district area listings are instant and complete instead of relying
// on live, best-effort pincode guessing (see utils/areaScan.js, still used
// for the separate city-based district pages below).
const PINCODE_DIRECTORY = require("../data/pincodeDirectory.json");

function resolveBySlug(names, slug) {
  return names.find((name) => slugify(name) === slug) || null;
}

const AREA_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const cityAreasCache = new Map();
const CITY_SAMPLE_SIZE = 150;
async function getCachedAreas(cache, key, prefixes, sampleSize) {
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }
  const areas = await scanAreas({ prefixes, sampleSize });
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

    // Districts and their real areas/pincodes come from the bundled India
    // Post directory — complete and instant, no live scanning needed. The
    // district list is deliberately drawn from this data's own keys (postal
    // sorting districts) rather than an external administrative-district
    // reference: PIN codes encode postal districts, which routinely diverge
    // from — and lag behind — a state's official admin/revenue districts
    // (e.g. India Post still files Delhi's "South East Delhi" area under the
    // older "South Delhi" postal district, and Karnataka's under "Bangalore"
    // rather than "Bengaluru Urban"). Listing admin-district names here would
    // produce districts that can never have real data behind them.
    const stateDirectory = PINCODE_DIRECTORY[state] || {};

    const [reports, pincodeCounts, activeReports] = await Promise.all([
      Report.find({ state }).sort({ createdAt: -1 }).limit(100),
      Report.aggregate([
        { $match: { state, status: { $in: ["reported", "ongoing"] } } },
        { $group: { _id: "$pincode", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
        { $project: { _id: 0, pincode: "$_id", count: 1 } },
      ]),
      Report.find({ state, status: { $in: ["reported", "ongoing"] } }, { pincode: 1, area: 1 }),
    ]);
    const activeKeys = new Set(
      activeReports.filter((r) => r.area).map((r) => `${r.pincode}|${r.area.trim().toLowerCase()}`)
    );

    let areaCount = 0;
    const districts = Object.entries(stateDirectory).map(([district, districtAreas]) => {
      const pincodes = new Set();
      let activeCount = 0;
      for (const a of districtAreas) {
        pincodes.add(a.pincode);
        if (activeKeys.has(`${a.pincode}|${a.name.toLowerCase()}`)) activeCount += 1;
      }
      areaCount += districtAreas.length;
      return {
        name: district,
        slug: slugify(district),
        pincodeCount: pincodes.size,
        activeCount,
      };
    });
    districts.sort((a, b) => a.name.localeCompare(b.name));

    res.json({ state, slug, reports, pincodeCounts, districts, areaCount });
  } catch (err) {
    next(err);
  }
}

async function getStateDistrictDetail(req, res, next) {
  try {
    const { slug, districtSlug } = req.params;
    const allStates = [...new Set(Object.values(PREFIX_STATE_MAP))];
    const state = resolveBySlug(allStates, slug);
    if (!state) {
      return res.status(404).json({ message: "Unknown state" });
    }

    const stateDirectory = PINCODE_DIRECTORY[state] || {};
    const districtNameMatch = Object.keys(stateDirectory).find(
      (name) => slugify(name) === districtSlug
    );
    if (!districtNameMatch) {
      return res.status(404).json({ message: "Unknown district" });
    }

    const district = districtNameMatch;
    const rawAreas = stateDirectory[districtNameMatch].map((a) => ({ ...a, district }));
    const areas = await withActiveStatus(rawAreas);
    const pincodes = [...new Set(areas.map((a) => a.pincode))];

    const [reports, pincodeCounts] = pincodes.length
      ? await Promise.all([
          Report.find({ state, pincode: { $in: pincodes } }).sort({ createdAt: -1 }).limit(100),
          Report.aggregate([
            { $match: { state, pincode: { $in: pincodes }, status: { $in: ["reported", "ongoing"] } } },
            { $group: { _id: "$pincode", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { _id: 0, pincode: "$_id", count: 1 } },
          ]),
        ])
      : [[], []];

    const activeAreas = areas.filter((a) => a.active).length;

    res.json({
      state,
      stateSlug: slug,
      district,
      districtSlug,
      totalAreas: areas.length,
      activeAreas,
      reports,
      pincodeCounts,
      areas,
    });
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

    const rawAreas = await getCachedAreas(cityAreasCache, slug, CITY_PREFIXES[city], CITY_SAMPLE_SIZE);
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
      await getCachedAreas(cityAreasCache, slug, CITY_PREFIXES[city], CITY_SAMPLE_SIZE);
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
  getStateDistrictDetail,
  getPincodeScore,
  getPincodeTrend,
  listCities,
  getCityDetail,
  warmCityCache,
};
