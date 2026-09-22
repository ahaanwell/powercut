import type {
  CityDetail,
  CitySummary,
  Comment,
  ContactCategory,
  ContactMessageReceipt,
  DistrictDetail,
  DistrictSummary,
  Geocode,
  GridStatus,
  LocationResult,
  MaintenanceItem,
  NearbyPincode,
  PincodeLocality,
  PincodeScore,
  PincodeStatus,
  PincodeTrend,
  Report,
  StateDetail,
  StateSummary,
  StatsOverview,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(body.message || "Request failed");
  }
  return res.json();
}

export function getPincodeStatus(pincode: string) {
  return apiFetch<PincodeStatus>(`/reports/pincode/${pincode}`, { cache: "no-store" });
}

export function getRecentReports(limit = 50, status?: "active") {
  const statusParam = status ? `&status=${status}` : "";
  return apiFetch<{ reports: Report[] }>(`/reports/recent?limit=${limit}${statusParam}`, {
    next: { revalidate: 30 },
  });
}

export function submitReport(data: {
  pincode: string;
  area?: string;
  description?: string;
  status?: "reported" | "restored";
}) {
  return apiFetch<Report>(`/reports`, { method: "POST", body: JSON.stringify(data) });
}

export function trackReport(referenceId: string) {
  return apiFetch<Report>(`/reports/track/${encodeURIComponent(referenceId)}`, {
    cache: "no-store",
  });
}

export function confirmReport(id: string, type: "still_down" | "restored") {
  return apiFetch<Report>(`/reports/${id}/confirm`, {
    method: "POST",
    body: JSON.stringify({ type }),
  });
}

export function getStatsOverview() {
  return apiFetch<StatsOverview>(`/stats`, { next: { revalidate: 60 } });
}

export function getStates() {
  return apiFetch<{ states: StateSummary[] }>(`/stats/states`, { next: { revalidate: 60 } });
}

export function getCities() {
  return apiFetch<{ cities: CitySummary[] }>(`/stats/cities`, { next: { revalidate: 60 } });
}

export function getCityDetail(slug: string) {
  return apiFetch<CityDetail>(`/stats/cities/${slug}`, { next: { revalidate: 60 } });
}

export function getStateDetail(slug: string) {
  return apiFetch<StateDetail>(`/stats/states/${slug}`, { next: { revalidate: 60 } });
}

export function getDistrictDetail(slug: string) {
  return apiFetch<DistrictDetail>(`/district/${slug}`, { next: { revalidate: 3600 } });
}

export function getDistricts() {
  return apiFetch<{ districts: DistrictSummary[] }>(`/district`, { next: { revalidate: 3600 } });
}

export function getPincodeLocalities(pincode: string) {
  return apiFetch<{ localities: PincodeLocality[] }>(`/pincode/${pincode}/localities`, {
    cache: "no-store",
  });
}

export function getNearbyPincodes(pincode: string) {
  return apiFetch<{ results: NearbyPincode[] }>(`/pincode/${pincode}/nearby`, {
    next: { revalidate: 3600 },
  });
}

export function getPincodeScore(pincode: string) {
  return apiFetch<PincodeScore>(`/stats/pincode/${pincode}/score`, {
    next: { revalidate: 300 },
  });
}

export function searchLocations(q: string) {
  return apiFetch<{ results: LocationResult[] }>(`/reports/search?q=${encodeURIComponent(q)}`, {
    cache: "no-store",
  });
}

export function getUpcomingMaintenance(pincode?: string) {
  const query = pincode ? `?pincode=${pincode}` : "";
  return apiFetch<{ items: MaintenanceItem[] }>(`/maintenance${query}`, {
    next: { revalidate: 300 },
  });
}

export function getPincodeTrend(pincode: string) {
  return apiFetch<PincodeTrend>(`/stats/pincode/${pincode}/trend`, { next: { revalidate: 300 } });
}

export function getPincodeGeocode(pincode: string) {
  return apiFetch<Geocode>(`/pincode/${pincode}/geocode`, { next: { revalidate: 86400 } });
}

export function getPincodeComments(pincode: string, hours = 48) {
  return apiFetch<{ comments: Comment[] }>(`/comments/pincode/${pincode}?hours=${hours}`, {
    cache: "no-store",
  });
}

export function postComment(data: { pincode: string; name?: string; message: string }) {
  return apiFetch<Comment>(`/comments`, { method: "POST", body: JSON.stringify(data) });
}

export function getGridStatus() {
  return apiFetch<GridStatus>(`/pincode/grid`, { next: { revalidate: 120 } });
}

export function submitContactMessage(data: {
  category: ContactCategory;
  message: string;
  name?: string;
  email?: string;
}) {
  return apiFetch<ContactMessageReceipt>(`/contact`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
