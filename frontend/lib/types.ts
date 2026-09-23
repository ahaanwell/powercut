export type ReportStatus = "reported" | "ongoing" | "restored";

export type ContactCategory = "bug" | "feedback" | "general";

export interface ContactMessageReceipt {
  _id: string;
  category: ContactCategory;
  createdAt: string;
}

export interface Report {
  _id: string;
  pincode: string;
  state: string;
  area?: string;
  description?: string;
  status: ReportStatus;
  confirmCount: number;
  restoredCount: number;
  restoredAt?: string | null;
  referenceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PincodeStatus {
  pincode: string;
  state: string;
  currentStatus: ReportStatus | "no-recent-reports";
  lastReportedAt: string | null;
  reports: Report[];
}

export interface StatsOverview {
  totalReports: number;
  activeOutages: number;
  restoredToday: number;
  topPincodes: { pincode: string; count: number; state: string }[];
  byState: { state: string; count: number }[];
}

export interface StateSummary {
  state: string;
  slug: string;
  activeCount: number;
}

export interface StateDetail {
  state: string;
  slug: string;
  reports: Report[];
  pincodeCounts: { pincode: string; count: number }[];
  districts: StateDistrictSummary[];
  areaCount: number;
}

export interface StateDistrictSummary {
  name: string;
  slug: string;
  pincodeCount: number;
  activeCount: number;
}

export interface StateDistrictDetail {
  state: string;
  stateSlug: string;
  district: string;
  districtSlug: string;
  totalAreas: number;
  activeAreas: number;
  reports: Report[];
  pincodeCounts: { pincode: string; count: number }[];
  areas: DistrictArea[];
}

export interface CitySummary {
  city: string;
  slug: string;
  activeCount: number;
}

export interface CityDetail {
  city: string;
  slug: string;
  reports: Report[];
  pincodeCounts: { pincode: string; count: number }[];
  areas: DistrictArea[];
}

export interface DistrictArea {
  name: string;
  pincode: string;
  active: boolean;
}

export interface DistrictSummary {
  slug: string;
  name: string;
}

export interface DistrictDetail {
  district: string;
  state: string;
  slug: string;
  totalAreas: number;
  activeAreas: number;
  areas: DistrictArea[];
}

export interface PincodeLocality {
  name: string;
  district: string;
  state: string;
}

export interface LocationResult {
  pincode: string;
  area?: string;
  state: string;
  lastReportedAt: string;
}

export interface NearbyPincode {
  pincode: string;
  name: string;
  district: string;
  state: string;
}

export interface ReverseGeocode {
  pincode: string;
  area: string;
  district: string;
  state: string;
}

export type RiskLevel = "low" | "moderate" | "high";

export interface PincodeScore {
  pincode: string;
  sampleSize: number;
  uptimePercent?: number;
  riskLevel?: RiskLevel;
  activeOutages24h: number;
  totalReports30d: number;
}

export type TrendLevel = "none" | "low" | "high";

export interface TrendPoint {
  label: string;
  count: number;
  level: TrendLevel;
}

export interface PincodeTrend {
  pincode: string;
  points: TrendPoint[];
}

export interface Geocode {
  lat: number | null;
  lng: number | null;
}

export interface Comment {
  _id: string;
  pincode: string;
  name?: string;
  message: string;
  createdAt: string;
}

export interface GridPoint {
  pincode: string;
  lat: number;
  lng: number;
  status: ReportStatus;
  count: number;
  state: string;
}

export interface GridStatus {
  points: GridPoint[];
  generatedAt: string;
}

export interface MaintenanceItem {
  _id: string;
  pincode: string;
  state: string;
  area?: string;
  description?: string;
  scheduledStart: string;
  scheduledEnd: string;
}
