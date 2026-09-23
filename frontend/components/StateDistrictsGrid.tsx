"use client";

import Link from "next/link";
import { useState } from "react";
import type { StateDistrictSummary } from "@/lib/types";
import { AlertCircleIcon, CheckCircleIcon, SearchIcon } from "./icons";

export default function StateDistrictsGrid({
  stateSlug,
  districts,
}: {
  stateSlug: string;
  districts: StateDistrictSummary[];
}) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim().toLowerCase();

  const filtered = trimmed
    ? districts.filter((d) => d.name.toLowerCase().includes(trimmed))
    : districts;

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2.5">
          <SearchIcon className="h-4 w-4 shrink-0 text-zinc-400" />
          <input
            type="text"
            placeholder="Search district name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">No districts match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((d) => (
            <Link
              key={d.slug}
              href={`/states/${stateSlug}/district/${d.slug}`}
              className={`rounded-xl border p-4 shadow-sm transition-colors ${
                d.activeCount > 0
                  ? "border-amber-400 bg-amber-50"
                  : "border-zinc-200 bg-white hover:border-amber-300"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`font-bold ${d.activeCount > 0 ? "text-amber-700" : "text-zinc-900"}`}>
                  {d.name}
                </span>
                {d.activeCount > 0 ? (
                  <span className="flex shrink-0 items-center gap-1 text-xs font-bold uppercase tracking-wide text-red-600">
                    <AlertCircleIcon className="h-4 w-4" />
                    {d.activeCount} active
                  </span>
                ) : (
                  <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-500" />
                )}
              </div>
              <p className="mt-1 text-sm text-zinc-500">
                {d.pincodeCount} PIN code{d.pincodeCount === 1 ? "" : "s"} tracked
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
