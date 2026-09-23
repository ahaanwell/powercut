const { scanAreas, withActiveStatus } = require("../utils/areaScan");

// Curated districts to browse, keyed by URL slug. Each is scanned across a
// bounded numeric range of pincodes under its known prefix, then filtered
// down to only the post offices India Post tags with `filterDistrict` (its
// official district field). `name` is the display label — for "New Delhi"
// this is the colloquial Lutyens-area name, but India Post's own district
// field for that entire area is actually "Central Delhi", with "New Delhi"
// reserved narrowly for just the GPO office itself, so we filter on the
// former to get the full, recognizable area list.
const DISTRICTS = {
  "new-delhi": { name: "New Delhi", state: "Delhi", filterDistrict: "Central Delhi", prefixes: ["110"] },
  "north-delhi": { name: "North Delhi", state: "Delhi", filterDistrict: "North Delhi", prefixes: ["110"] },
  "south-delhi": { name: "South Delhi", state: "Delhi", filterDistrict: "South Delhi", prefixes: ["110"] },
  mumbai: { name: "Mumbai", state: "Maharashtra", filterDistrict: "Mumbai", prefixes: ["400"] },
  bangalore: { name: "Bangalore", state: "Karnataka", filterDistrict: "Bangalore", prefixes: ["560"] },
  pune: { name: "Pune", state: "Maharashtra", filterDistrict: "Pune", prefixes: ["411"] },
  hyderabad: { name: "Hyderabad", state: "Telangana", filterDistrict: "Hyderabad", prefixes: ["500"] },
  chennai: { name: "Chennai", state: "Tamil Nadu", filterDistrict: "Chennai", prefixes: ["600"] },
  kolkata: { name: "Kolkata", state: "West Bengal", filterDistrict: "Kolkata", prefixes: ["700"] },
  ahmedabad: { name: "Ahmedabad", state: "Gujarat", filterDistrict: "Ahmedabad", prefixes: ["380"] },
};

const SCAN_SAMPLE_SIZE = 150;

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const areasCache = new Map();

async function getDistrictAreas(slug) {
  const config = DISTRICTS[slug];
  if (!config) return null;

  const cached = areasCache.get(slug);
  if (cached && cached.expiresAt > Date.now()) {
    return { config, areas: cached.data };
  }

  const areas = await scanAreas({
    prefixes: config.prefixes,
    sampleSize: SCAN_SAMPLE_SIZE,
    filterDistrict: config.filterDistrict,
  });
  areasCache.set(slug, { data: areas, expiresAt: Date.now() + CACHE_TTL_MS });
  return { config, areas };
}

async function listDistricts(req, res) {
  res.json({
    districts: Object.entries(DISTRICTS).map(([slug, c]) => ({ slug, name: c.name })),
  });
}

async function getDistrictDetail(req, res, next) {
  try {
    const { slug } = req.params;
    const result = await getDistrictAreas(slug);
    if (!result) {
      return res.status(404).json({ message: "Unknown district" });
    }

    const withStatus = await withActiveStatus(result.areas);
    const activeAreas = withStatus.filter((a) => a.active).length;

    res.json({
      district: result.config.name,
      state: result.config.state,
      slug,
      totalAreas: withStatus.length,
      activeAreas,
      areas: withStatus,
    });
  } catch (err) {
    next(err);
  }
}

async function warmDistrictCache() {
  for (const slug of Object.keys(DISTRICTS)) {
    try {
      await getDistrictAreas(slug);
      console.log(`[warm] cached areas for district: ${slug}`);
    } catch (err) {
      console.error(`[warm] failed for district ${slug}:`, err.message);
    }
  }
}

module.exports = { listDistricts, getDistrictDetail, getDistrictAreas, warmDistrictCache, DISTRICTS };
