import { getPincodeScore } from "@/lib/api";

export default async function PincodeStatTiles({ pincode }: { pincode: string }) {
  const score = await getPincodeScore(pincode).catch(() => null);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center shadow-sm">
        <p className="text-2xl font-extrabold text-zinc-900">{score?.activeOutages24h ?? "—"}</p>
        <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-zinc-500">
          Active outages (24h)
        </p>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center shadow-sm">
        <p className="text-2xl font-extrabold text-zinc-900">{score?.totalReports30d ?? "—"}</p>
        <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-zinc-500">
          Total reports (30d)
        </p>
      </div>
    </div>
  );
}
