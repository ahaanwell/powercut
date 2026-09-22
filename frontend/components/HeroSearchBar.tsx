"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { isValidPincode, resolveSearchDestination } from "@/lib/pincode";
import { getPincodeLocalities } from "@/lib/api";
import type { PincodeLocality } from "@/lib/types";
import { MapPinIcon } from "./icons";

export default function HeroSearchBar() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [localities, setLocalities] = useState<PincodeLocality[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setValue(next);
    setError("");

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!isValidPincode(next)) {
      setLocalities([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    setOpen(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const { localities: results } = await getPincodeLocalities(next.trim());
        if (mountedRef.current) setLocalities(results);
      } catch {
        if (mountedRef.current) setLocalities([]);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    }, 300);
  }

  function goToPincode(pincode: string) {
    setOpen(false);
    router.push(`/pincode/${pincode}`);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const destination = resolveSearchDestination(value);
    if (!destination) {
      setError("Enter a 6-digit PIN code or an area name");
      return;
    }
    setError("");
    setOpen(false);
    router.push(destination);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <label htmlFor="hero-pincode-search" className="sr-only">
          Search by PIN code or area name
        </label>
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white p-1 shadow-sm">
          <input
            ref={inputRef}
            id="hero-pincode-search"
            type="text"
            maxLength={60}
            autoComplete="off"
            placeholder="Pincode or Area Name"
            value={value}
            onChange={handleChange}
            onFocus={() => localities.length > 0 && setOpen(true)}
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.focus()}
            aria-label="Focus PIN code field"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-amber-600 hover:bg-zinc-200"
          >
            <MapPinIcon className="h-4 w-4" />
          </button>
          <button
            type="submit"
            className="shrink-0 rounded-md bg-amber-500 px-5 py-2 text-sm font-bold text-white hover:bg-amber-600"
          >
            Check
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </form>

      {open && isValidPincode(value) && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
          {loading ? (
            <p className="px-4 py-3 text-sm text-zinc-500">Searching localities&hellip;</p>
          ) : localities.length === 0 ? (
            <button
              type="button"
              onClick={() => goToPincode(value.trim())}
              className="w-full px-4 py-3 text-left text-sm text-zinc-600 hover:bg-zinc-50"
            >
              No localities found for {value.trim()}. Check outage status anyway &rarr;
            </button>
          ) : (
            <ul className="max-h-80 divide-y divide-zinc-100 overflow-y-auto">
              {localities.map((loc, i) => (
                <li key={`${loc.name}-${i}`}>
                  <button
                    type="button"
                    onClick={() => goToPincode(value.trim())}
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-amber-50"
                  >
                    <span>
                      <span className="block font-semibold text-zinc-900">{loc.name}</span>
                      <span className="block text-sm text-zinc-500">
                        {loc.district}, {loc.state}
                      </span>
                    </span>
                    <span className="shrink-0 font-bold text-amber-600">{value.trim()}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
