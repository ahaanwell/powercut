import Link from "next/link";
import { BoltIcon, ChartBarIcon, MessageIcon, ShieldIcon } from "./icons";

const MECHANICS_FAQS = [
  {
    q: "What happens if two people report conflicting statuses for the same area?",
    a: 'Both reports stay visible with their own timestamps. The pincode\'s "current status" reflects whichever is most recent, while older reports remain in the history so you can see the full picture, including how many people confirmed each one.',
  },
  {
    q: "How exactly does a report get auto-restored?",
    a: 'Once 3 separate "Power is Back" confirmations are logged against a report, its status automatically flips to "Restored" and the restoration timestamp is recorded — no manual review involved.',
  },
  {
    q: "Can I edit or delete a report after submitting it?",
    a: "Reports can't be edited or deleted once submitted, since there's no account tied to them. If details change, submit a fresh report or a restoration confirmation instead.",
  },
  {
    q: "Is there a mobile app?",
    a: "No — PowerCut is a web app that works in any mobile browser, so there's nothing to install. You can add it to your phone's home screen for quick access if you'd like.",
  },
];

export default function HowItWorksContent() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: MECHANICS_FAQS.map((f) => ({
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

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-extrabold text-blue-950">
          Behind the Scenes: How Status Updates Automatically
        </h2>
        <div className="mt-3 space-y-4 text-sm leading-relaxed text-zinc-600">
          <p>
            A report starts life as &ldquo;Reported.&rdquo; If a neighbor confirms it&apos;s
            still ongoing, it moves to &ldquo;Ongoing.&rdquo; Once{" "}
            <strong className="font-semibold text-zinc-800">3 separate confirmations</strong>{" "}
            that power is back come in, the status automatically flips to &ldquo;Restored&rdquo;
            and a restoration timestamp is recorded — nobody has to manually close it out. That
            same history feeds each area&apos;s{" "}
            <span className="font-semibold text-zinc-800">Area Power Score</span>, a rolling
            30-day uptime estimate, and its{" "}
            <span className="font-semibold text-zinc-800">90-day outage trend</span> chart, both
            visible on every pincode&apos;s status page.
          </p>
          <p>
            To keep data honest without requiring accounts, submissions are rate-limited — the
            same device can&apos;t report the same pincode more than once every 10 minutes — and
            every report gets a unique{" "}
            <Link href="/track" className="font-medium text-blue-900 hover:underline">
              complaint reference number
            </Link>{" "}
            you can use to check back on it later.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-extrabold text-blue-950">Every Way to Check Power Status</h2>
        <ul className="mt-3 space-y-2.5">
          {[
            <>
              Search a PIN code or locality name directly from the{" "}
              <Link href="/" className="font-medium text-blue-900 hover:underline">
                home page
              </Link>{" "}
              — the box also autocompletes real localities as you type a full pincode.
            </>,
            <>
              Open the{" "}
              <Link href="/" className="font-medium text-blue-900 hover:underline">
                live outage map
              </Link>{" "}
              to see active reports plotted across India in real time.
            </>,
            <>
              Browse the full{" "}
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
              </Link>{" "}
              directories to see every tracked locality in a region at once.
            </>,
            <>
              Check the{" "}
              <Link href="/stats" className="font-medium text-blue-900 hover:underline">
                statistics dashboard
              </Link>{" "}
              for aggregate numbers — total reports, active outages, and top affected PIN codes.
            </>,
            <>
              Review{" "}
              <Link href="/maintenance" className="font-medium text-blue-900 hover:underline">
                planned maintenance notices
              </Link>{" "}
              before assuming an outage is unplanned.
            </>,
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-600">
              <ChartBarIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-900" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-blue-950">
          <ShieldIcon className="h-5 w-5 text-amber-500" />
          Staying Anonymous
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Reporting and confirming never require a name, phone number, or account. The only thing
          stored alongside a report is a one-way cryptographic hash of the submitting
          device&apos;s IP address, used solely to enforce the 10-minute rate limit — it
          can&apos;t be reversed to identify anyone. Comments left on a pincode&apos;s
          &ldquo;Neighborhood Comments&rdquo; section work the same way, with an optional display
          name you make up yourself.
        </p>
      </section>

      <section className="rounded-xl border-l-4 border-zinc-300 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-blue-950">
          <MessageIcon className="h-5 w-5 text-zinc-500" />
          Mechanics FAQ
        </h2>
        <div className="mt-3 divide-y divide-zinc-100">
          {MECHANICS_FAQS.map((f) => (
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
          , or start{" "}
          <Link href="/report" className="font-medium text-blue-900 hover:underline">
            reporting an outage
          </Link>{" "}
          right now.
        </p>
      </section>

      <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-600/20">
        <BoltIcon className="mb-1 h-4 w-4" />
        PowerCut is an independent, community-driven service. It is not affiliated with
        any government agency, DISCOM, or electricity provider. Reports may be incomplete,
        delayed, inaccurate, or unavailable.
      </div>
    </div>
  );
}
