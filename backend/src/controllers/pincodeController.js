const Report = require("../models/Report");
const PINCODE_DIRECTORY = require("../data/pincodeDirectory.json");

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const cache = new Map();

let allPincodesCache = null;
function getAllPincodes(req, res) {
  if (!allPincodesCache) {
    const map = new Map();
    for (const districts of Object.values(PINCODE_DIRECTORY)) {
      for (const areas of Object.values(districts)) {
        for (const a of areas) {
          if (!map.has(a.pincode)) map.set(a.pincode, a.name);
        }
      }
    }
    allPincodesCache = [...map.entries()]
      .map(([pincode, area]) => ({ pincode, area }))
      .sort((a, b) => a.pincode.localeCompare(b.pincode));
  }
  res.json({ pincodes: allPincodesCache });
}

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

const REVERSE_GEOCODE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const reverseGeocodeCache = new Map();

async function fetchReverseGeocode(lat, lng) {
  const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  const cached = reverseGeocodeCache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const result = await scheduleNominatim(async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`,
        {
          signal: controller.signal,
          headers: { "User-Agent": "PowerCutTracker/1.0 (Node.js server)" },
        }
      );
      clearTimeout(timeout);
      if (!response.ok) return null;
      const data = await response.json();
      const address = data?.address;
      if (!address || data.error) return null;
      const postcode = (address.postcode || "").trim();
      if (!/^[1-9][0-9]{5}$/.test(postcode)) return null;
      return {
        pincode: postcode,
        area:
          address.suburb || address.neighbourhood || address.village || address.town || address.city_district || "",
        district: address.state_district || address.county || address.city || "",
        state: address.state || "",
      };
    } catch {
      return null;
    }
  });

  reverseGeocodeCache.set(key, { data: result, expiresAt: Date.now() + REVERSE_GEOCODE_TTL_MS });
  return result;
}

async function getReverseGeocode(req, res) {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return res.status(400).json({ message: "Invalid coordinates" });
  }

  const result = await fetchReverseGeocode(lat, lng);
  if (!result) {
    return res.status(404).json({ message: "Could not resolve a PIN code for this location" });
  }
  res.json(result);
}

const GRID_CACHE_TTL_MS = 5 * 60 * 1000;
// Kept small deliberately: each new (uncached) pincode here costs ~1.1s on
// the shared, globally-serialized Nominatim queue (see scheduleNominatim
// above) — that queue is shared by every geocode/reverse-geocode call in
// the app, including individual pincode pages' maps. A large batch here
// can starve those other, much smaller requests for a minute or more.
const GRID_PINCODE_LIMIT = 20;
let gridCache = null;
let gridRefreshInFlight = null;

async function refreshGridCache() {
  if (gridRefreshInFlight) return gridRefreshInFlight;

  gridRefreshInFlight = (async () => {
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
    return payload;
  })();

  try {
    return await gridRefreshInFlight;
  } finally {
    gridRefreshInFlight = null;
  }
}

async function getGridStatus(req, res, next) {
  try {
    // Stale-while-revalidate: a live request always gets whatever's in the
    // cache immediately (even if slightly stale) rather than waiting behind
    // the Nominatim queue — a background refresh (also started at server
    // startup and on a timer, see server.js) keeps it current without ever
    // making a user's request pay for it.
    if (gridCache) {
      if (gridCache.expiresAt <= Date.now()) {
        refreshGridCache().catch((err) => console.error("Grid cache refresh failed:", err.message));
      }
      return res.json(gridCache.data);
    }

    const payload = await refreshGridCache();
    res.json(payload);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getLocalities,
  getNearby,
  getGeocode,
  getReverseGeocode,
  getGridStatus,
  getAllPincodes,
  fetchLocalities,
  refreshGridCache,
};
