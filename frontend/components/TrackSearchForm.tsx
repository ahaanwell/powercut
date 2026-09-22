"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { SearchIcon } from "./icons";

export default function TrackSearchForm({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length < 5) {
      setError("Enter a valid complaint reference number");
      return;
    }
    setError("");
    router.push(`/track/${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="reference-id" className="block text-sm font-bold text-blue-950">
        Complaint Reference Number
      </label>
      <div className="mt-2 flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded border border-zinc-300 bg-white px-3 py-2.5">
          <SearchIcon className="h-4 w-4 shrink-0 text-zinc-400" />
          <input
            id="reference-id"
            type="text"
            placeholder="e.g. PCT-2026-370C11B6"
            value={value}
            onChange={(e) => setValue(e.target.value.toUpperCase())}
            className="w-full bg-transparent font-mono text-sm text-zinc-900 placeholder:text-zinc-400 placeholder:font-sans focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="shrink-0 rounded bg-blue-950 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-900"
        >
          Track Status
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
}
