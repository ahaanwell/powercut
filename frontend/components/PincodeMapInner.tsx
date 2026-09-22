"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type PincodeMapProps = {
  pincode: string;
  locality: string;
  status: "reported" | "ongoing" | "restored" | "no-recent-reports";
  reportCount24h: number;
  lastReportedAt: string | null;
  lat: number;
  lng: number;
};

const markerIcon = L.divIcon({
  className: "",
  html: '<div style="width:18px;height:18px;border-radius:9999px;background:#ef4444;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export default function PincodeMapInner({
  pincode,
  locality,
  status,
  reportCount24h,
  lastReportedAt,
  lat,
  lng,
}: PincodeMapProps) {
  const [interactive, setInteractive] = useState(false);
  const isActive = status === "reported" || status === "ongoing";

  return (
    <div className="relative isolate overflow-hidden rounded-2xl border border-zinc-200 shadow-sm">
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "320px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={markerIcon}>
          <Popup>
            <div style={{ minWidth: 180 }}>
              <p style={{ fontWeight: 700, margin: 0 }}>{locality || pincode}</p>
              <p style={{ margin: "2px 0", color: "#71717a" }}>PINCODE: {pincode}</p>
              <p
                style={{
                  margin: "4px 0",
                  fontWeight: 700,
                  color: isActive ? "#dc2626" : "#059669",
                }}
              >
                {isActive ? "● OUTAGE ACTIVE" : "● NO ACTIVE OUTAGE"}
              </p>
              {reportCount24h > 0 && (
                <p style={{ margin: "2px 0" }}>
                  {reportCount24h} report{reportCount24h === 1 ? "" : "s"} in this area &middot; 24h
                </p>
              )}
              {lastReportedAt && (
                <p style={{ margin: "2px 0", color: "#71717a" }}>
                  Last report: {new Date(lastReportedAt).toLocaleString("en-IN")}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {!interactive && (
        <button
          type="button"
          onClick={() => setInteractive(true)}
          className="absolute inset-0 flex items-end justify-center bg-transparent pb-4"
        >
          <span className="rounded-full bg-black/80 px-4 py-2 text-sm font-bold text-white shadow-lg">
            👆 Tap to interact with map
          </span>
        </button>
      )}
    </div>
  );
}
