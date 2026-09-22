// Curated list of major Indian metro areas mapped to their known PIN code
// prefixes. Unlike the state mapping, there is no single authoritative
// "city" field from India Post, so this is a fixed, hand-picked list of
// major cities rather than an exhaustive one.
const CITY_PREFIXES = {
  Mumbai: ["400"],
  Bengaluru: ["560"],
  Pune: ["411"],
  "Delhi NCR": ["110", "121", "122", "201"],
  Hyderabad: ["500"],
  Chennai: ["600"],
  Kolkata: ["700"],
  Ahmedabad: ["380"],
};

function pincodeRegexForCity(city) {
  const prefixes = CITY_PREFIXES[city];
  if (!prefixes) return null;
  return new RegExp(`^(${prefixes.join("|")})`);
}

module.exports = { CITY_PREFIXES, pincodeRegexForCity };
