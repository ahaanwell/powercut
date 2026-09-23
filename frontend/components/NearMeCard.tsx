"use client";

import { useState } from "react";
import Link from "next/link";
import { getPincodeStatus, getReverseGeocode } from "@/lib/api";
import type { PincodeStatus, ReverseGeocode } from "@/lib/types";
import { slugify } from "@/lib/slugify";
import StatusBadge from "./StatusBadge";
import { MapPinIcon } from "./icons";

type Phase = "idle" | "loading" | "success" | "error";

export default function NearMeCard() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [location, setLocation] = useState<ReverseGeocode | null>(null);
  const [status, setStatus] = useState<PincodeStatus | null>(null);

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setPhase("error");
      setErrorMessage("Your browser doesn't support location detection. Search your PIN code above instead.");
      return;
    }

    setPhase("loading");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const loc = await getReverseGeocode(position.coords.latitude, position.coords.longitude);
          const pinStatus = await getPincodeStatus(loc.pincode);
          setLocation(loc);
          setStatus(pinStatus);
          setPhase("success");
        } catch {
          setPhase("error");
          setErrorMessage("Couldn't match your location to a PIN code. Search manually above instead.");
        }
      },
      (err) => {
        setPhase("error");
        setErrorMessage(
          err.code === err.PERMISSION_DENIED
            ? "Location access was denied. Search your PIN code above instead."
            : "Couldn't detect your location. Search your PIN code above instead."
        );
      },
      { timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  }

  if (phase === "idle" || phase === "loading") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-2.5 text-sm text-zinc-600">
          <MapPinIcon className="h-5 w-5 shrink-0 text-amber-600" />
          <span>Want your area&apos;s status without typing a PIN code?</span>
        </div>
        <button
          type="button"
          onClick={handleUseLocation}
          disabled={phase === "loading"}
          className="shrink-0 rounded-full bg-blue-950 px-5 py-2 text-sm font-bold text-white hover:bg-blue-900 disabled:opacity-60"
        >
          {phase === "loading" ? "Detecting your location…" : "Use My Location"}
        </button>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-2.5 text-sm text-zinc-600">
          <MapPinIcon className="h-5 w-5 shrink-0 text-zinc-400" />
          <span>{errorMessage}</span>
        </div>
        <button
          type="button"
          onClick={handleUseLocation}
          className="shrink-0 rounded-full border border-zinc-300 px-5 py-2 text-sm font-bold text-zinc-700 hover:bg-zinc-50"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!location || !status) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-5 py-4 shadow-sm">
      <div className="flex items-center gap-2.5">
        <MapPinIcon className="h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <p className="font-semibold text-zinc-900">
            {location.area || location.district || location.pincode}
            {location.state ? `, ${location.state}` : ""}
          </p>
          <p className="text-xs text-zinc-500">PIN code {location.pincode} &middot; detected from your location</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <StatusBadge status={status.currentStatus} />
        <Link
          href={`/pincode/${location.pincode}${location.area ? `/${slugify(location.area)}` : ""}`}
          className="text-sm font-bold text-blue-900 hover:underline"
        >
          View Details &rarr;
        </Link>
      </div>
    </div>
  );
}
