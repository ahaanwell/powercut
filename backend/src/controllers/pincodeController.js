const Report = require("../models/Report");

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const cache = new Map();

async function fetchLocalities(pincode) {
  const cached = cache.get(pincode);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  let localities = [];
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      const result = Array.isArray(data) ? data[0] : null;
      if (result?.Status === "Success" && Array.isArray(result.PostOffice)) {
        localities = result.PostOffice.map((po) => ({
          name: po.Name,
          district: po.District,
          state: po.State,
        }));
      }
    }
  } catch {
    // Best-effort enhancement; fall through with an empty list rather than failing the request.
  }

  cache.set(pincode, { data: localities, expiresAt: Date.now() + CACHE_TTL_MS });
  return localities;
}

async function getLocalities(req, res) {
  const { pincode } = req.params;
  if (!/^[1-9][0-9]{5}$/.test(pincode)) {
    return res.status(400).json({ message: "Invalid pincode format" });
  }
  const localities = await fetchLocalities(pincode);
  res.json({ localities });
}

const NEARBY_CANDIDATE_COUNT = 15;
const NEARBY_RESULT_LIMIT = 8;

async function getNearby(req, res) {
  const { pincode } = req.params;
  if (!/^[1-9][0-9]{5}$/.test(pincode)) {
    return res.status(400).json({ message: "Invalid pincode format" });
  }

  const prefix = pincode.slice(0, 3);
  const candidates = [];
  for (let i = 1; i <= NEARBY_CANDIDATE_COUNT; i += 1) {
    const candidate = `${prefix}${String(i).padStart(3, "0")}`;
    if (candidate !== pincode) candidates.push(candidate);
  }

  const results = [];
  for (const candidate of candidates) {
    if (results.length >= NEARBY_RESULT_LIMIT) break;
    const localities = await fetchLocalities(candidate);
    if (localities.length > 0) {
      results.push({
        pincode: candidate,
        name: localities[0].name,
        district: localities[0].district,
        state: localities[0].state,
      });
    }
  }

  res.json({ results });
}

const GEOCODE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const geocodeCache = new Map();

// Nominatim's usage policy caps unauthenticated use at ~1 request/second;
// this chain serializes every outgoing geocode call process-wide.
let nominatimChain = Promise.resolve();
function scheduleNominatim(task) {
  const run = nominatimChain.then(async () => {
    const result = await task();
    await new Promise((resolve) => setTimeout(resolve, 1100));
    return result;
  });
  nominatimChain = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

async function fetchGeocode(pincode, locality) {
  const cached = geocodeCache.get(pincode);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const query = locality
    ? [locality.name, locality.district, locality.state, "India"].filter(Boolean).join(", ")
    : `${pincode}, India`;

  const coords = await scheduleNominatim(async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(
          query
        )}`,
        {
          signal: controller.signal,
          headers: { "User-Agent": "PowerCutTracker/1.0 (Node.js server)" },
        }
      );
      clearTimeout(timeout);
      if (!response.ok) return null;
      const data = await response.json();
      if (Array.isArray(data) && data[0]) {
        return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
      }
      return null;
    } catch {
      return null;
    }
  });

  geocodeCache.set(pincode, { data: coords, expiresAt: Date.now() + GEOCODE_TTL_MS });
  return coords;
}

async function getGeocode(req, res) {
  const { pincode } = req.params;
  if (!/^[1-9][0-9]{5}$/.test(pincode)) {
    return res.status(400).json({ message: "Invalid pincode format" });
  }
  const localities = await fetchLocalities(pincode);
  const coords = await fetchGeocode(pincode, localities[0]);
  res.json(coords || { lat: null, lng: null });
}

const GRID_CACHE_TTL_MS = 5 * 60 * 1000;
const GRID_PINCODE_LIMIT = 60;
let gridCache = null;

async function getGridStatus(req, res, next) {
  try {
    if (gridCache && gridCache.expiresAt > Date.now()) {
      return res.json(gridCache.data);
    }

    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const grouped = await Report.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$pincode",
          status: { $first: "$status" },
          state: { $first: "$state" },
          count: { $sum: 1 },
        },
      },
      { $limit: GRID_PINCODE_LIMIT },
    ]);

    const points = [];
    for (const g of grouped) {
      const localities = await fetchLocalities(g._id);
      const coords = await fetchGeocode(g._id, localities[0]);
      if (coords) {
        points.push({
          pincode: g._id,
          lat: coords.lat,
          lng: coords.lng,
          status: g.status,
          count: g.count,
          state: g.state,
        });
      }
    }

    const payload = { points, generatedAt: new Date().toISOString() };
    gridCache = { data: payload, expiresAt: Date.now() + GRID_CACHE_TTL_MS };
    res.json(payload);
  } catch (err) {
    next(err);
  }
}

module.exports = { getLocalities, getNearby, getGeocode, getGridStatus, fetchLocalities };
