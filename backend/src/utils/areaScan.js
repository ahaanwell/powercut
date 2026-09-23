const { fetchLocalities } = require("../controllers/pincodeController");
const Report = require("../models/Report");

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await fn(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

/**
 * Scans a sample of candidate pincodes under each given prefix, aggregating
 * every post office India Post returns for them (optionally filtered to one
 * exact district name). This is a best-effort sample, not an exhaustive
 * directory — the public postal API only supports exact 6-digit lookups, so
 * full coverage of a city/state would require many thousands of calls.
 *
 * Samples are spread evenly across the *entire* possible suffix range for
 * each prefix (e.g. 0000–9999 for a 2-digit prefix), rather than clustered
 * right after the prefix itself. A narrow front-loaded scan only ever finds
 * whichever city/district got allocated the very first block of codes under
 * that prefix (often the postal region's biggest city) — anything allocated
 * later in the range (e.g. Madhubani's 847xxx codes under Bihar's shared "84"
 * prefix) would never be sampled at all. Spreading the same request budget
 * across the full range instead gives every district a real chance of
 * being discovered. Results are deduplicated by pincode+name.
 */
async function scanAreas({ prefixes, sampleSize = 150, filterDistrict = null, concurrency = 15 }) {
  const candidates = [];
  for (const prefix of prefixes) {
    const suffixLength = 6 - prefix.length;
    const spaceSize = 10 ** suffixLength;
    const count = Math.min(sampleSize, spaceSize);
    const step = Math.max(1, Math.floor(spaceSize / count));
    for (let k = 0; k < count; k += 1) {
      const i = k * step;
      candidates.push(`${prefix}${String(i).padStart(suffixLength, "0")}`);
    }
  }

  const perPincode = await mapWithConcurrency(candidates, concurrency, async (pincode) => {
    const localities = await fetchLocalities(pincode);
    const filtered = filterDistrict
      ? localities.filter((l) => (l.district || "").toLowerCase() === filterDistrict.toLowerCase())
      : localities;
    return filtered.map((l) => ({
      name: l.name.trim(),
      pincode,
      district: l.district ? l.district.trim() : null,
      state: l.state ? l.state.trim() : null,
    }));
  });

  const seen = new Set();
  const areas = [];
  for (const list of perPincode) {
    for (const area of list) {
      const key = `${area.pincode}|${area.name}`;
      if (!seen.has(key)) {
        seen.add(key);
        areas.push(area);
      }
    }
  }
  areas.sort((a, b) => a.name.localeCompare(b.name));
  return areas;
}

/** Cross-references a scanned area list against active reports (matched by pincode + area name). */
async function withActiveStatus(areas) {
  const pincodesInvolved = [...new Set(areas.map((a) => a.pincode))];
  if (pincodesInvolved.length === 0) return areas.map((a) => ({ ...a, active: false }));

  const activeReports = await Report.find(
    { pincode: { $in: pincodesInvolved }, status: { $in: ["reported", "ongoing"] } },
    { pincode: 1, area: 1 }
  );
  const activeKeys = new Set(
    activeReports.filter((r) => r.area).map((r) => `${r.pincode}|${r.area.trim().toLowerCase()}`)
  );

  return areas.map((a) => ({ ...a, active: activeKeys.has(`${a.pincode}|${a.name.toLowerCase()}`) }));
}

module.exports = { scanAreas, withActiveStatus, mapWithConcurrency };
