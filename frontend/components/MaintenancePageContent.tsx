import Link from "next/link";
import { BoltIcon, CalendarIcon, MessageIcon, SearchIcon } from "./icons";

const MAINTENANCE_FAQS = [
  {
    q: "Is this the official DISCOM maintenance schedule?",
    a: "No. Like the rest of PowerCut, this list is entirely community-submitted, not sourced from any electricity board's official planned-outage calendar. Always confirm with your local DISCOM for official maintenance windows.",
  },
  {
    q: "Why isn't my area's planned outage listed here?",
    a: "Coverage depends entirely on someone submitting it — there's no automatic feed from any utility. If you know of an upcoming planned outage that isn't listed, the most useful thing you can do is report the actual outage when it happens so others nearby see it.",
  },
  {
    q: "What's the difference between this and reporting an outage?",
    a: "This page lists outages that are known about in advance. If your power is currently out unexpectedly, that's an unplanned outage — head to the report page instead, not this list.",
  },
];

export default function MaintenancePageContent() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: MAINTENANCE_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="rounded-xl border-l-4 border-amber-400 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
          <CalendarIcon className="h-4 w-4 text-amber-500" />
          What Counts as Planned Maintenance?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          A planned maintenance outage is one announced in advance for repairing or upgrading
          transformers, lines, or substations, unlike a sudden fault. This page collects those
          announcements from the community so you can check whether an upcoming or ongoing
          outage in your area was expected before assuming something has gone wrong.
        </p>
      </section>

      <section className="rounded-xl border-l-4 border-red-500 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
          <BoltIcon className="h-4 w-4 text-red-500" />
          Power Out Right Now, Not Listed Here?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          If nothing is scheduled for your PIN code, your outage is most likely unplanned.{" "}
          <Link href="/report" className="font-medium text-blue-900 hover:underline">
            Report the outage
          </Link>{" "}
          so your neighbors know, and{" "}
          <Link href="/track" className="font-medium text-blue-900 hover:underline">
            track your complaint
          </Link>{" "}
          afterward with the reference number you receive.
        </p>
      </section>

      <section className="rounded-xl border-l-4 border-blue-900 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
          <SearchIcon className="h-4 w-4 text-blue-900" />
          Check a Different Area
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Search any{" "}
          <Link href="/" className="font-medium text-blue-900 hover:underline">
            PIN code from the home page
          </Link>{" "}
          to filter this list, or browse maintenance activity more broadly by{" "}
          <Link href="/states" className="font-medium text-blue-900 hover:underline">
            state
          </Link>{" "}
          or{" "}
          <Link href="/cities/mumbai" className="font-medium text-blue-900 hover:underline">
            city
          </Link>
          .
        </p>
      </section>

      <section className="rounded-xl border-l-4 border-zinc-300 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
          <MessageIcon className="h-4 w-4 text-zinc-500" />
          Maintenance FAQ
        </h2>
        <div className="mt-3 divide-y divide-zinc-100">
          {MAINTENANCE_FAQS.map((f) => (
            <details key={f.q} className="group py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-zinc-900 marker:content-none">
                {f.q}
                <span className="shrink-0 text-lg text-zinc-400 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm text-zinc-600">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-4 text-xs text-zinc-500">
          More questions? See the full{" "}
          <Link href="/faq" className="font-medium text-blue-900 hover:underline">
            FAQ page
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
