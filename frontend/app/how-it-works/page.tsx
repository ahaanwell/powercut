import type { Metadata } from "next";
import HowItWorksContent from "@/components/HowItWorksContent";
import {
  BoltIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldIcon,
  SearchIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "See exactly how PowerCut's community-driven power outage reporting, confirmation, and tracking system works, step by step.",
  alternates: { canonical: "/how-it-works" },
};

const TRUST_BADGES = [
  { icon: CheckCircleIcon, label: "Free, Always" },
  { icon: ShieldIcon, label: "100% Anonymous" },
  { icon: ClockIcon, label: "Updates in Real Time" },
  { icon: BoltIcon, label: "No Account Needed" },
];

const STEPS = [
  {
    name: "Search your PIN code or locality",
    body: "Enter your area's 6-digit PIN code (or start typing a locality name) on the home page to see recent, community-reported outage activity there.",
  },
  {
    name: "Report a power cut",
    body: "If your power is out, submit a quick, anonymous report with your PIN code and optional area/details. It appears immediately for others nearby and receives a unique complaint reference number.",
  },
  {
    name: "Confirm status",
    body: 'Other users in the same area can confirm a report is still ongoing ("still down"), or confirm power is back. After 3 restoration confirmations, the status updates to "Restored" automatically.',
  },
  {
    name: "Track your complaint",
    body: "Save your reference number and look it up anytime on the Track Complaint page to see the latest recorded status, with no account required.",
  },
  {
    name: "Explore the bigger picture",
    body: "Check the live outage map, the statistics dashboard, or an area's Area Power Score and 90-day trend to understand patterns beyond a single report.",
  },
  {
    name: "Browse by region",
    body: "Use the state, city, and district directories to see tracked activity across a whole region, not just your own pincode.",
  },
];

export default function HowItWorksPage() {
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How PowerCut Works",
    description:
      "The complete process for reporting, confirming, and tracking power outages on PowerCut.",
    step: STEPS.map((s) => ({
      "@type": "HowToStep",
      name: s.name,
      text: s.body,
    })),
  };

  return (
    <div className="bg-zinc-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-900">
            <SearchIcon className="h-3.5 w-3.5" />
            Citizen Self-Service
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-blue-950 sm:text-4xl">
            How PowerCut Works
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            PowerCut is a crowd-sourced platform for tracking electricity outages across
            India, organized by PIN code — not an official utility feed.
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
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 bg-blue-950 px-5 py-3">
            <BoltIcon className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wide text-white">
              The Complete Process
            </span>
          </div>
          <ol className="grid gap-6 p-5 sm:p-6 md:grid-cols-2">
            {STEPS.map((step, i) => (
              <li key={step.name} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h2 className="font-semibold text-zinc-900">{step.name}</h2>
                  <p className="mt-1 text-sm text-zinc-600">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <HowItWorksContent />
      </div>
    </div>
  );
}
