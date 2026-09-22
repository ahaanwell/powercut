import { getGridStatus } from "@/lib/api";
import LiveGridMap from "./LiveGridMap";
import LiveClock from "./LiveClock";

export default async function LiveGridSection() {
  const { points } = await getGridStatus().catch(() => ({ points: [] }));

  return (
    <div className="overflow-hidden rounded-2xl bg-black shadow-sm">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-white">
          Live Grid Status
        </h2>
        <LiveClock className="text-xs font-semibold text-zinc-400" />
      </div>

      {points.length === 0 ? (
        <p className="px-5 py-16 text-center text-sm text-zinc-400">
          No location data yet &mdash; the map fills in as reports come in.
        </p>
      ) : (
        <LiveGridMap points={points} />
      )}
    </div>
  );
}
