import type { Metadata } from "next";
import ReportForm from "@/components/ReportForm";
import ReportPageContent from "@/components/ReportPageContent";
import { CheckCircleIcon, ClockIcon, ShieldIcon, BoltIcon } from "@/components/icons";

type Props = {
  searchParams: Promise<{ status?: string; pincode?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const isRestored = params.status === "restored";
  return {
    title: isRestored ? "Report Power Restored" : "Report a Power Cut Near You",
    description: isRestored
      ? "Let your neighbors know electricity supply has been restored in your area. Anonymous, no account needed — takes under a minute."
      : "Report a power cut or electricity outage for your PIN code in seconds. Anonymous, free, and no account needed — get a complaint reference number to track its status.",
    alternates: { canonical: "/report" },
  };
}

const TRUST_BADGES = [
  { icon: CheckCircleIcon, label: "Free, Always" },
  { icon: ShieldIcon, label: "100% Anonymous" },
  { icon: ClockIcon, label: "Under 1 Minute" },
  { icon: BoltIcon, label: "Instant Reference ID" },
];

export default async function ReportPage({ searchParams }: Props) {
  const params = await searchParams;
  const initialStatus = params.status === "restored" ? "restored" : "reported";
  const isRestored = initialStatus === "restored";

  return (
    <div className="bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-900">
            <ShieldIcon className="h-3.5 w-3.5" />
            Citizen Self-Service
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-blue-950 sm:text-4xl">
            {isRestored ? "Report that power is back" : "Report a power cut"}
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            {isRestored
              ? "Let others in your area know that power has been restored."
              : "Your report helps others in your area know about outages in real time."}{" "}
            Reports are anonymous and take less than a minute.
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
          <div className="lg:sticky lg:top-24 lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 bg-blue-950 px-5 py-3">
                <ShieldIcon className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wide text-white">
                  {isRestored ? "Restoration Report Form" : "Outage Report Form"}
                </span>
              </div>
              <div className="p-5">
                <ReportForm defaultPincode={params.pincode} initialStatus={initialStatus} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <ReportPageContent />
          </div>
        </div>
      </div>
    </div>
  );
}
