import Link from "next/link";
import { getNearbyPincodes } from "@/lib/api";
import { slugify } from "@/lib/slugify";

export default async function NearbyPincodesCard({
  pincode,
  state,
}: {
  pincode: string;
  state: string;
}) {
  const { results } = await getNearbyPincodes(pincode).catch(() => ({ results: [] }));

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-[11px] font-bold uppercase tracking-wide text-zinc-500">
        Other pincodes in {state}
      </h2>
      {results.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-500">No nearby pincode data available.</p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-x-1.5 gap-y-2 text-sm">
          {results.map((r) => (
            <Link
              key={r.pincode}
              href={`/pincode/${r.pincode}`}
              className="font-medium text-amber-700 hover:underline"
            >
              {r.name} ({r.pincode})
            </Link>
          ))}
        </div>
      )}
      <Link
        href={`/states/${slugify(state)}`}
        className="mt-4 block text-[11px] font-bold uppercase tracking-wide text-zinc-500 hover:text-amber-700"
      >
        View all pincodes in {state} &rarr;
      </Link>
    </div>
  );
}
