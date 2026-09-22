// Approximate mapping of Indian PIN code first-two-digit prefixes to states/UTs,
// based on the India Post PIN zone structure. Border districts can be imprecise
// since India Post zones don't align perfectly with state boundaries.
const PREFIX_STATE_MAP = {
  11: "Delhi",
  12: "Haryana",
  13: "Haryana",
  14: "Punjab",
  15: "Punjab",
  16: "Punjab",
  17: "Himachal Pradesh",
  18: "Jammu and Kashmir",
  19: "Jammu and Kashmir",
  20: "Uttar Pradesh",
  21: "Uttar Pradesh",
  22: "Uttar Pradesh",
  23: "Uttar Pradesh",
  24: "Uttar Pradesh",
  25: "Uttar Pradesh",
  26: "Uttar Pradesh",
  27: "Uttar Pradesh",
  28: "Uttar Pradesh",
  30: "Rajasthan",
  31: "Rajasthan",
  32: "Rajasthan",
  33: "Rajasthan",
  34: "Rajasthan",
  36: "Gujarat",
  37: "Gujarat",
  38: "Gujarat",
  39: "Gujarat",
  40: "Maharashtra",
  41: "Maharashtra",
  42: "Maharashtra",
  43: "Maharashtra",
  44: "Maharashtra",
  45: "Madhya Pradesh",
  46: "Madhya Pradesh",
  47: "Madhya Pradesh",
  48: "Madhya Pradesh",
  49: "Chhattisgarh",
  50: "Telangana",
  51: "Andhra Pradesh",
  52: "Andhra Pradesh",
  53: "Andhra Pradesh",
  56: "Karnataka",
  57: "Karnataka",
  58: "Karnataka",
  59: "Karnataka",
  60: "Tamil Nadu",
  61: "Tamil Nadu",
  62: "Tamil Nadu",
  63: "Tamil Nadu",
  64: "Tamil Nadu",
  67: "Kerala",
  68: "Kerala",
  69: "Kerala",
  70: "West Bengal",
  71: "West Bengal",
  72: "West Bengal",
  73: "West Bengal",
  74: "West Bengal",
  75: "Odisha",
  76: "Odisha",
  77: "Odisha",
  78: "Assam",
  79: "North Eastern States",
  80: "Bihar",
  81: "Bihar",
  82: "Bihar",
  83: "Jharkhand",
  84: "Jharkhand",
  85: "Bihar",
};

function getStateFromPincode(pincode) {
  if (!/^[1-9][0-9]{5}$/.test(pincode)) return "Unknown";
  const prefix = Number(pincode.slice(0, 2));
  return PREFIX_STATE_MAP[prefix] || "Other";
}

function getPrefixesForState(state) {
  return Object.entries(PREFIX_STATE_MAP)
    .filter(([, name]) => name.toLowerCase() === state.toLowerCase())
    .map(([prefix]) => prefix);
}

module.exports = { getStateFromPincode, getPrefixesForState, PREFIX_STATE_MAP };
