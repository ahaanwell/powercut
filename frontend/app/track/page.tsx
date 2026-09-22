import type { Metadata } from "next";
import TrackSearchForm from "@/components/TrackSearchForm";
import TrackPageContent from "@/components/TrackPageContent";
import { ClockIcon, CheckCircleIcon, ShieldIcon, SearchIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Track Your Complaint",
  description:
    "Look up the live status of any power outage report using its complaint reference number — free, anonymous, no login required.",
  alternates: { canonical: "/track" },
};

const TRUST_BADGES = [
  { icon: ShieldIcon, label: "No Login Required" },
  { icon: SearchIcon, label: "Instant Lookup" },
  { icon: CheckCircleIcon, label: "Always Free" },
  { icon: ClockIcon, label: "Live Status" },
];

export default function TrackPage() {
  return (
    <div className="bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-900">
            <ShieldIcon className="h-3.5 w-3.5" />
            Citizen Self-Service
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-blue-950 sm:text-4xl">
            Track Your Complaint
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Enter the complaint reference number you received when you reported a power outage
            to check its current status.
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
                <SearchIcon className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wide text-white">
                  Complaint Lookup
                </span>
              </div>
              <div className="p-5">
                <TrackSearchForm />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <TrackPageContent />
          </div>
        </div>
      </div>
    </div>
  );
}
