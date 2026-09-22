import Link from "next/link";
import { CalendarIcon } from "./icons";

export default function DiscomScheduleCard({ pincode }: { pincode: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-center gap-3">
        <CalendarIcon className="h-6 w-6 shrink-0 text-amber-600" />
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-amber-700">
            Outage schedule
          </p>
          <p className="font-bold text-zinc-900">Check planned power cuts</p>
        </div>
      </div>
      <Link
        href={`/maintenance?pincode=${pincode}`}
        className="shrink-0 rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-black hover:bg-amber-300"
      >
        View schedule
      </Link>
    </div>
  );
}
