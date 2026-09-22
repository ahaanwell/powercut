import { getStatsOverview } from "@/lib/api";

export default async function NoticesTicker() {
  const stats = await getStatsOverview().catch(() => null);

  const notices = [
    `${stats?.activeOutages ?? "—"} active outage(s) being tracked right now`,
    `This is an independent, community-run platform — not affiliated with any government agency or DISCOM`,
    `${stats?.totalReports ?? "—"} total reports logged by the community since launch`,
    `Report outages anonymously to help your neighbors stay informed`,
    `${stats?.restoredToday ?? "—"} outage(s) marked restored in the last 24 hours`,
  ];
  const loop = [...notices, ...notices];

  return (
    <div className="overflow-hidden border-b border-blue-900 bg-blue-950 py-1 text-white">
      <div className="flex items-center">
        <span className="z-10 shrink-0 bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-950">
          Notice
        </span>
        <div className="flex w-max shrink-0 animate-[marquee_35s_linear_infinite] gap-16 whitespace-nowrap px-4 text-xs">
          {loop.map((n, i) => (
            <span key={i}>{n}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
