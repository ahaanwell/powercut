import Link from "next/link";
import { getDistricts, getStates } from "@/lib/api";
import { BoltIcon, CalendarIcon } from "./icons";

type PillItem = { key: string; label: string; href: string; count?: number };

export default async function BrowseByRegion() {
  const [{ states }, { districts }] = await Promise.all([
    getStates().catch(() => ({ states: [] })),
    getDistricts().catch(() => ({ districts: [] })),
  ]);

  const districtItems: PillItem[] = districts.map((d) => ({
    key: d.slug,
    label: d.name,
    href: `/district/${d.slug}`,
  }));
  const stateItems: PillItem[] = states.map((s) => ({
    key: s.slug,
    label: s.state,
    href: `/states/${s.slug}`,
    count: s.activeCount,
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-900 bg-blue-950 px-5 py-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-amber-400">
            Discom Outage Schedule
          </p>
          <p className="flex items-center gap-2 font-bold text-white">
            <CalendarIcon className="h-4 w-4 text-amber-400" />
            Check planned power cut
          </p>
        </div>
        <Link href="/maintenance" className="text-sm font-bold text-amber-400 hover:underline">
          View Schedules &rarr;
        </Link>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-blue-950">
            <BoltIcon className="h-5 w-5 text-amber-500" />
            Browse Outages by Region
          </h2>
          <Link href="/states" className="text-sm font-bold text-blue-900 hover:underline">
            View All States &rarr;
          </Link>
        </div>

        <RegionRow title="Browse by Cities" items={districtItems} />
        <RegionRow title="Browse by State" items={stateItems} isLast />
      </div>
    </div>
  );
}

function RegionRow({ title, items, isLast = false }: { title: string; items: PillItem[]; isLast?: boolean }) {
  if (items.length === 0) return null;

  return (
    <div className={`mt-6 ${!isLast ? "border-b border-zinc-100 pb-6" : ""}`}>
      <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-500">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-semibold text-blue-950 hover:border-amber-400 hover:bg-amber-50"
          >
            {item.label}
            {item.count !== undefined && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  item.count > 0 ? "bg-red-600 text-white" : "bg-zinc-200 text-zinc-500"
                }`}
              >
                {item.count}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
