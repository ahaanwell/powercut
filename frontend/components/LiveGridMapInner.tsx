"use client";

import { useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { GridPoint } from "@/lib/types";
import { ExpandIcon } from "./icons";

const INDIA_CENTER: [number, number] = [22.6, 80];

function statusColor(status: GridPoint["status"]): string {
  return status === "restored" ? "#22c55e" : "#ef4444";
}

export default function LiveGridMapInner({ points }: { points: GridPoint[] }) {
  const [interactive, setInteractive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function toggleFullscreen() {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  }

  return (
    <div ref={containerRef} className="relative isolate bg-black">
      <MapContainer
        center={INDIA_CENTER}
        zoom={4}
        scrollWheelZoom={false}
        style={{ height: "420px", width: "100%", background: "#0a0a0a" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles-dark"
        />
        {points.map((p) => (
          <CircleMarker
            key={p.pincode}
            center={[p.lat, p.lng]}
            radius={5}
            pathOptions={{
              weight: 0,
              fillColor: statusColor(p.status),
              fillOpacity: 0.95,
            }}
          >
            <Popup>
              <div style={{ minWidth: 160 }}>
                <p style={{ fontWeight: 700, margin: 0 }}>{p.pincode}</p>
                <p style={{ margin: "2px 0", color: "#71717a" }}>{p.state}</p>
                <p
                  style={{
                    margin: "4px 0",
                    fontWeight: 700,
                    color: p.status === "restored" ? "#059669" : "#dc2626",
                  }}
                >
                  {p.status === "restored" ? "● Power Restored" : "● Outage Reported"}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label="Toggle fullscreen"
        className="absolute right-3 top-3 z-[1000] flex h-9 w-9 items-center justify-center rounded-lg bg-white text-zinc-700 shadow hover:bg-zinc-50"
      >
        <ExpandIcon className="h-4 w-4" />
      </button>

      <div className="absolute bottom-3 right-3 z-[998] rounded-lg bg-black/75 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Outage reported
        </div>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Power restored
        </div>
      </div>

      {!interactive && (
        <button
          type="button"
          onClick={() => setInteractive(true)}
          className="absolute inset-0 z-[999] flex items-center justify-center bg-transparent"
        >
          <span className="rounded-full bg-black/80 px-4 py-2 text-sm font-bold text-white shadow-lg">
            👆 Tap to interact with map
          </span>
        </button>
      )}
    </div>
  );
}
