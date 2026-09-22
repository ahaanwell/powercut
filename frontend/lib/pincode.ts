export const PINCODE_REGEX = /^[1-9][0-9]{5}$/;

export function isValidPincode(value: string): boolean {
  return PINCODE_REGEX.test(value.trim());
}

/** Resolves a free-text search box value (pincode or area name) to a destination route. */
export function resolveSearchDestination(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length < 2) return null;
  if (isValidPincode(trimmed)) return `/pincode/${trimmed}`;
  return `/search?q=${encodeURIComponent(trimmed)}`;
}
