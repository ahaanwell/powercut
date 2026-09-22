"use client";

import Link from "next/link";
import { useState } from "react";
import type { DistrictArea } from "@/lib/types";
import { AlertCircleIcon, CheckCircleIcon, SearchIcon } from "./icons";

export default function DistrictAreaGrid({ areas }: { areas: DistrictArea[] }) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim().toLowerCase();

  const filtered = trimmed
    ? areas.filter((a) => a.name.toLowerCase().includes(trimmed) || a.pincode.includes(trimmed))
    : areas;

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2.5">
          <SearchIcon className="h-4 w-4 shrink-0 text-zinc-400" />
          <input
            type="text"
            placeholder="Search pincode or area name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
        </div>
        <button
          type="button"
          className="shrink-0 rounded-full bg-amber-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-amber-600"
        >
          Search
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">No areas match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((a) => (
            <Link
              key={`${a.pincode}-${a.name}`}
              href={`/pincode/${a.pincode}`}
              className={`rounded-xl border p-4 shadow-sm transition-colors ${
                a.active
                  ? "border-amber-400 bg-amber-50"
                  : "border-zinc-200 bg-white hover:border-amber-300"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`font-bold ${a.active ? "text-amber-700" : "text-zinc-900"}`}>
                  {a.name}
                </span>
                {a.active ? (
                  <AlertCircleIcon className="h-5 w-5 shrink-0 text-amber-600" />
                ) : (
                  <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-500" />
                )}
              </div>
              <p className="mt-1 text-sm text-zinc-500">{a.pincode}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
