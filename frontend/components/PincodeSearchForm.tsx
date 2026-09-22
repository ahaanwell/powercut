"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { resolveSearchDestination } from "@/lib/pincode";

export default function PincodeSearchForm({ large = false }: { large?: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const destination = resolveSearchDestination(value);
    if (!destination) {
      setError("Enter a 6-digit PIN code or an area name");
      return;
    }
    setError("");
    router.push(destination);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <label htmlFor="pincode-search" className="sr-only">
        Search by PIN code or area name
      </label>
      <div className="flex gap-2">
        <input
          id="pincode-search"
          type="text"
          maxLength={60}
          placeholder="Enter PIN code or area name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`w-full rounded-lg border border-zinc-300 px-4 text-zinc-900 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${
            large ? "py-4 text-lg" : "py-2.5"
          }`}
        />
        <button
          type="submit"
          className={`shrink-0 rounded-lg bg-amber-500 font-semibold text-white hover:bg-amber-600 ${
            large ? "px-6 py-4 text-lg" : "px-5 py-2.5"
          }`}
        >
          Check status
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
}
