import Link from "next/link";
import { BoltIcon, ChartBarIcon, MessageIcon, SearchIcon } from "./icons";

const STATS_FAQS = [
  {
    q: "Are these official DISCOM outage statistics?",
    a: "No. Every number on this page is calculated purely from reports submitted by PowerCut users — there is no connection to any electricity board's internal data or grid telemetry.",
  },
  {
    q: "How often do these numbers update?",
    a: "The overview refreshes roughly every minute as new reports and confirmations come in, so figures like active outages can change within seconds of someone reporting or confirming restoration.",
  },
  {
    q: "Why do the numbers look low for my area?",
    a: "Coverage depends entirely on how many people nearby are actively reporting. A low count usually means fewer active users in that area rather than fewer real outages — you can help by reporting when your power goes out.",
  },
  {
    q: "What's the difference between total reports and active outages?",
    a: 'Total reports counts every report ever submitted, including ones later marked restored. Active outages counts only reports currently in "Reported" or "Ongoing" status right now.',
  },
];

export default function StatsPageContent() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: STATS_FAQS.map((f) => ({
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

      <div className="grid gap-6 md:grid-cols-3">
        <section className="rounded-xl border-l-4 border-amber-400 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
            <ChartBarIcon className="h-4 w-4 text-amber-500" />
            How These Numbers Are Calculated
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Total reports counts every report ever submitted across every PIN code. Active
            outages counts reports currently marked &ldquo;Reported&rdquo; or
            &ldquo;Ongoing&rdquo; that haven&apos;t been confirmed restored yet. Rankings are
            based on reports and confirmations in the last 24 hours — the same data that powers
            each area&apos;s{" "}
            <Link href="/" className="font-medium text-blue-900 hover:underline">
              Area Power Score
            </Link>
            .
          </p>
        </section>

        <section className="rounded-xl border-l-4 border-blue-900 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
            <BoltIcon className="h-4 w-4 text-blue-900" />
            Why Outage Statistics Matter
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            A single report tells you about one area at one moment. Aggregate statistics let you
            compare that against the bigger picture — whether an outage near you is isolated or
            part of a wider pattern hitting a whole state or city, and combined with each
            area&apos;s 90-day trend, help spot recurring supply issues.
          </p>
        </section>

        <section className="rounded-xl border-l-4 border-emerald-500 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
            <SearchIcon className="h-4 w-4 text-emerald-600" />
            Explore Further
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Browse full directories by{" "}
            <Link href="/states" className="font-medium text-blue-900 hover:underline">
              state
            </Link>
            ,{" "}
            <Link href="/cities/mumbai" className="font-medium text-blue-900 hover:underline">
              city
            </Link>
            , or{" "}
            <Link href="/district/new-delhi" className="font-medium text-blue-900 hover:underline">
              district
            </Link>
            , or check the{" "}
            <Link href="/" className="font-medium text-blue-900 hover:underline">
              live outage map
            </Link>
            . Noticed something missing?{" "}
            <Link href="/report" className="font-medium text-blue-900 hover:underline">
              Report it
            </Link>
            .
          </p>
        </section>
      </div>

      <section className="rounded-xl border-l-4 border-zinc-300 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
          <MessageIcon className="h-4 w-4 text-zinc-500" />
          Statistics FAQ
        </h2>
        <div className="mt-3 divide-y divide-zinc-100">
          {STATS_FAQS.map((f) => (
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
