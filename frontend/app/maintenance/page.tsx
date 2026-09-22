import type { Metadata } from "next";
import Link from "next/link";
import { getUpcomingMaintenance } from "@/lib/api";
import MaintenancePageContent from "@/components/MaintenancePageContent";
import { CalendarIcon, CheckCircleIcon, ShieldIcon, ClockIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Scheduled Maintenance Outages",
  description:
    "Browse community-reported planned electricity maintenance outages by PIN code, city, or state across India.",
  alternates: { canonical: "/maintenance" },
};

type Props = { searchParams: Promise<{ pincode?: string }> };

const TRUST_BADGES = [
  { icon: ShieldIcon, label: "Community Submitted" },
  { icon: CalendarIcon, label: "By PIN Code" },
  { icon: CheckCircleIcon, label: "Always Free" },
  { icon: ClockIcon, label: "Planned Outages Only" },
];

export default async function MaintenancePage({ searchParams }: Props) {
  const { pincode } = await searchParams;
  const { items } = await getUpcomingMaintenance(pincode).catch(() => ({ items: [] }));

  return (
    <div className="bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-900">
            <ShieldIcon className="h-3.5 w-3.5" />
            Citizen Self-Service
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-blue-950 sm:text-4xl">
            Scheduled Maintenance Outages
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Planned, pre-announced maintenance outages shared by the community. This list is not
            official and may be incomplete.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {TRUST_BADGES.map((b) => (
              <span key={b.label} className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <b.icon className="h-4 w-4 text-emerald-600" />
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-5 lg:items-start">
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 bg-blue-950 px-5 py-3">
                <CalendarIcon className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wide text-white">
                  {pincode ? `Maintenance Notices — ${pincode}` : "All Maintenance Notices"}
                </span>
              </div>
              <div className="p-5">
                {pincode && (
                  <p className="mb-4 text-sm text-zinc-600">
                    Filtered to pincode <span className="font-semibold">{pincode}</span>.{" "}
                    <Link href="/maintenance" className="font-medium text-blue-900 hover:underline">
                      Clear filter
                    </Link>
                  </p>
                )}

                {items.length === 0 ? (
                  <p className="rounded-lg bg-zinc-50 p-5 text-sm text-zinc-500 ring-1 ring-zinc-200">
                    No scheduled maintenance outages have been reported
                    {pincode ? ` for ${pincode}` : ""} yet.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li
                        key={item._id}
                        className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Link
                            href={`/pincode/${item.pincode}`}
                            className="font-semibold text-zinc-900 hover:underline"
                          >
                            {item.pincode} {item.area ? `— ${item.area}` : ""}
                          </Link>
                          <span className="text-xs text-zinc-500">{item.state}</span>
                        </div>
                        <p className="mt-1 text-sm text-zinc-600">
                          {new Date(item.scheduledStart).toLocaleString("en-IN")} &ndash;{" "}
                          {new Date(item.scheduledEnd).toLocaleString("en-IN")}
                        </p>
                        {item.description && (
                          <p className="mt-2 text-sm text-zinc-600">{item.description}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:col-span-2">
            <MaintenancePageContent />
          </div>
        </div>
      </div>
    </div>
  );
}
