import Link from "next/link";
import { BoltIcon, ChartBarIcon, MessageIcon, SearchIcon } from "./icons";

const COVERAGE_FAQS = [
  {
    q: "Is my rural or small-town PIN code covered?",
    a: "Yes. Every valid 6-digit Indian PIN code can be searched, reported on, and tracked — coverage isn't limited to the cities and districts featured in the directories.",
  },
  {
    q: "Why are only a handful of cities and districts listed as directories?",
    a: "The city and district directory pages are a curated shortlist of major metros to make browsing easier — they're a navigation convenience, not the limit of what's trackable. Any other PIN code works exactly the same through direct search.",
  },
  {
    q: "How can I help improve coverage in my area?",
    a: "Report outages when they happen and share the tracker with neighbors, your building's residents' group, or local community channels. Coverage only grows through real people reporting real outages.",
  },
  {
    q: "Does using PowerCut cost anything?",
    a: "No. Searching, reporting, confirming, and tracking are all completely free, with no account, subscription, or hidden limits.",
  },
];

export default function CoveragePageContent() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: COVERAGE_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="mt-10 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <section className="rounded-xl border-l-4 border-amber-400 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
            <BoltIcon className="h-4 w-4 text-amber-500" />
            What &ldquo;Covered&rdquo; Actually Means
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            There&apos;s no approval process or waitlist for an area to become trackable — every
            valid Indian PIN code works the moment someone searches or reports on it. What varies
            is data freshness: an area with active local users will have current, reliable
            reports, while a quiet one may show nothing simply because nobody has reported yet.
          </p>
        </section>

        <section className="rounded-xl border-l-4 border-blue-900 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
            <ChartBarIcon className="h-4 w-4 text-blue-900" />
            How Coverage Grows Organically
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Coverage isn&apos;t purchased or licensed from any data provider — it grows one
            report at a time, entirely from people experiencing outages and choosing to log them.
            The more people in an area who report and confirm, the more accurate that
            area&apos;s{" "}
            <span className="font-semibold text-zinc-800">Area Power Score</span> and outage
            trend become over time.
          </p>
        </section>

        <section className="rounded-xl border-l-4 border-emerald-500 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
            <SearchIcon className="h-4 w-4 text-emerald-600" />
            Improve Coverage in Your Area
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Notice sparse or outdated reports nearby? The fastest fix is to{" "}
            <Link href="/report" className="font-medium text-blue-900 hover:underline">
              report the next outage you experience
            </Link>{" "}
            and share PowerCut with neighbors or a local community group — coverage is
            only as good as the people using it.
          </p>
        </section>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-extrabold text-blue-950">
          State, City &amp; District Directories Explained
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Beyond searching a single PIN code, PowerCut organizes coverage into browsable
          directories: every{" "}
          <Link href="/states" className="font-medium text-blue-900 hover:underline">
            state and union territory
          </Link>{" "}
          rolls up reports from all the PIN codes within it; a shortlist of major metros like{" "}
          <Link href="/cities/mumbai" className="font-medium text-blue-900 hover:underline">
            Mumbai
          </Link>{" "}
          and{" "}
          <Link href="/cities/delhi-ncr" className="font-medium text-blue-900 hover:underline">
            Delhi NCR
          </Link>{" "}
          get dedicated city pages; and select metro areas also have{" "}
          <Link href="/district/new-delhi" className="font-medium text-blue-900 hover:underline">
            district-level directories
          </Link>{" "}
          listing every tracked locality by name. None of these are exhaustive — they&apos;re
          navigation aids layered on top of the same underlying PIN-code data that covers the
          entire country.
        </p>
      </section>

      <section className="rounded-xl border-l-4 border-zinc-300 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-blue-950">
          <MessageIcon className="h-5 w-5 text-zinc-500" />
          Coverage FAQ
        </h2>
        <div className="mt-3 divide-y divide-zinc-100">
          {COVERAGE_FAQS.map((f) => (
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

      <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-600/20">
        We do not source data from DISCOMs, government portals, or any official utility feed —
        all coverage comes directly from user submissions.
      </div>
    </div>
  );
}
