import type { Metadata } from "next";
import Link from "next/link";
import { isValidPincode } from "@/lib/pincode";
import { searchLocations } from "@/lib/api";
import { slugify } from "@/lib/slugify";

export const metadata: Metadata = {
  title: "Search results",
  robots: { index: false, follow: true },
};

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const { results } = query.length >= 2
    ? await searchLocations(query).catch(() => ({ results: [] }))
    : { results: [] };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-zinc-900">Search results</h1>
      <p className="mt-2 text-zinc-600">
        {query ? (
          <>
            Showing matches for &ldquo;{query}&rdquo;
          </>
        ) : (
          "Enter a PIN code or area name to search."
        )}
      </p>

      {isValidPincode(query) && (
        <Link
          href={`/pincode/${query}`}
          className="mt-6 flex items-center justify-between rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 hover:border-amber-400"
        >
          <span className="font-medium text-zinc-900">Go directly to PIN code {query}</span>
          <span className="text-amber-700">&rarr;</span>
        </Link>
      )}

      <div className="mt-6">
        {query.length < 2 ? null : results.length === 0 ? (
          <p className="rounded-lg bg-white p-4 text-sm text-zinc-500 ring-1 ring-zinc-200">
            No areas matching &ldquo;{query}&rdquo; have been reported yet. Try searching a 6-digit
            PIN code instead, or{" "}
            <Link href="/report" className="font-medium text-amber-700 hover:underline">
              be the first to report
            </Link>{" "}
            an outage there.
          </p>
        ) : (
          <ul className="space-y-2">
            {results.map((r) => (
              <li key={r.pincode}>
                <Link
                  href={`/pincode/${r.pincode}${r.area ? `/${slugify(r.area)}` : ""}`}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm hover:border-amber-400"
                >
                  <span className="font-medium text-zinc-900">
                    {r.area ? `${r.area} — ${r.pincode}` : r.pincode}
                  </span>
                  <span className="text-sm text-zinc-500">{r.state}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
