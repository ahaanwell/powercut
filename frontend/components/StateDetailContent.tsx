import Link from "next/link";
import { BoltIcon, ChartBarIcon, MessageIcon, SearchIcon } from "./icons";

export default function StateDetailContent({ state }: { state: string }) {
  const faqs = [
    {
      q: `Is this ${state}'s official electricity board outage data?`,
      a: `No. Like every state page on PowerCut, this is built entirely from community reports, not sourced from any DISCOM operating in ${state} or any government portal.`,
    },
    {
      q: `How is ${state}'s data collected?`,
      a: `Every report submitted for a PIN code within ${state} is automatically counted toward this page — there's no separate state-level submission process, and no report is independently verified.`,
    },
    {
      q: `My area in ${state} isn't listed — what do I do?`,
      a: `Coverage depends on community participation. If your locality isn't showing up, search its PIN code directly from the home page, or be the first to report an outage there.`,
    },
    {
      q: `Who do I contact for the official electricity complaint number in ${state}?`,
      a: `Contact your local DISCOM directly, or try the common electricity helpline 1912, which is active in many Indian states. PowerCut is a community backup for real-time visibility, not a replacement for your utility's official complaint channel.`,
    },
    {
      q: `Can I see how ${state} compares to other states?`,
      a: `Yes — the statistics dashboard ranks active outages by state, so you can see at a glance how ${state}'s current activity compares to the rest of the country.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
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
          Reporting and Reference Numbers in {state}
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-600">
          <p>
            Anyone experiencing a power cut anywhere in {state} can submit an anonymous report in
            under a minute — no account, phone number, or address needed beyond the PIN code
            itself. Each report generates a unique complaint reference number (formatted like
            PCT-2026-XXXXXXXX) that works the same way a formal grievance ticket does: save it,
            and look up that exact report&apos;s status anytime on the{" "}
            <Link href="/track" className="font-medium text-blue-900 hover:underline">
              Track Complaint
            </Link>{" "}
            page, even weeks later.
          </p>
          <p>
            If you&apos;re unsure whether an outage in {state} is planned or a fault, check the{" "}
            <Link href="/maintenance" className="font-medium text-blue-900 hover:underline">
              scheduled maintenance notices
            </Link>{" "}
            first — if nothing is listed for your pincode, it&apos;s most likely unplanned and
            worth reporting. While waiting for restoration, avoid touching any exposed or fallen
            lines, keep your fridge and freezer closed to preserve food, and unplug sensitive
            electronics to protect them from surges when supply returns.
          </p>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        <section className="rounded-xl border-l-4 border-amber-400 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
            <BoltIcon className="h-4 w-4 text-amber-500" />
            About Power Tracking in {state}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            This page aggregates every community-submitted power cut report tied to a PIN code
            within {state}, updated in real time as new reports and confirmations come in. It
            covers every locality with a valid Indian PIN code — there&apos;s no separate
            registration for an area in {state} to be trackable.
          </p>
        </section>

        <section className="rounded-xl border-l-4 border-blue-900 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
            <ChartBarIcon className="h-4 w-4 text-blue-900" />
            Area Power Score &amp; Trends
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Every PIN code above also has its own Area Power Score — a 30-day uptime estimate —
            and a 90-day outage trend chart. Open any pincode in {state} above to see its full
            history, or check the statewide{" "}
            <Link href="/stats" className="font-medium text-blue-900 hover:underline">
              statistics dashboard
            </Link>{" "}
            for the bigger picture.
          </p>
        </section>

        <section className="rounded-xl border-l-4 border-emerald-500 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
            <SearchIcon className="h-4 w-4 text-emerald-600" />
            Report or Check Another Area
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Experiencing an outage in {state} right now?{" "}
            <Link href="/report" className="font-medium text-blue-900 hover:underline">
              Report it
            </Link>{" "}
            in under a minute, or browse every{" "}
            <Link href="/states" className="font-medium text-blue-900 hover:underline">
              other state
            </Link>{" "}
            from the full directory.
          </p>
        </section>
      </div>

      <section className="rounded-xl border-l-4 border-zinc-300 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-blue-950">
          <MessageIcon className="h-5 w-5 text-zinc-500" />
          {state} FAQ
        </h2>
        <div className="mt-3 divide-y divide-zinc-100">
          {faqs.map((f) => (
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
