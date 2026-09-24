import Link from "next/link";
import { BoltIcon, ChartBarIcon, MessageIcon, SearchIcon } from "./icons";

export default function DistrictDetailContent({
  district,
  state,
  totalAreas,
  activeAreas,
  backHref,
  backLabel,
}: {
  district: string;
  state: string;
  totalAreas: number;
  activeAreas: number;
  backHref: string;
  backLabel: string;
}) {
  const faqs = [
    {
      q: `Is this ${district}'s official electricity board outage data?`,
      a: `No. Like every district page on PowerCut, this is built entirely from community reports, not sourced from any DISCOM operating in ${district} or any government portal.`,
    },
    {
      q: `How is ${district}'s data collected?`,
      a: `Every report submitted for a PIN code within ${district} is automatically counted toward this page — there's no separate district-level submission process, and no report is independently verified.`,
    },
    {
      q: `My area in ${district} isn't listed — what do I do?`,
      a: `Coverage depends on community participation and what India Post's own postal records track for this district. If your locality isn't showing up, search its PIN code directly from the home page, or be the first to report an outage there.`,
    },
    {
      q: `Who do I contact for the official electricity complaint number in ${district}?`,
      a: `Contact your local DISCOM directly, or try the common electricity helpline 1912, active in many Indian states. PowerCut is a community backup for real-time visibility, not a replacement for your utility's official complaint channel.`,
    },
    {
      q: `Can I see how ${district} compares to other areas in ${state}?`,
      a: `Yes — the statistics dashboard ranks active outages by state, and ${state}'s own page lists every district PowerCut tracks, so you can see at a glance how ${district}'s current activity compares.`,
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
          Power Cut in {district} &ndash; Check Live Power Outage Status
        </h2>
        <div className="mt-3 space-y-5 text-sm leading-relaxed text-zinc-600">
          <p>
            Experiencing a power cut in {district}? Search your PIN code or locality to check
            recent community-reported outages and the latest recorded power outage status in your
            area. You can also{" "}
            <Link href="/report" className="font-medium text-blue-900 hover:underline">
              report an outage
            </Link>{" "}
            and track it using a unique complaint reference number.
          </p>
          <div>
            <h3 className="font-bold text-zinc-900">
              Can I Check Power Outage Status in {district}?
            </h3>
            <p className="mt-1">
              Yes. You can check the power outage status in {district} by searching your PIN code
              or locality. See whether an outage has been reported, whether users have confirmed
              that power is still down, or whether restoration has been confirmed.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-zinc-900">Scheduled Power Cuts in {district}</h3>
            <p className="mt-1">
              Scheduled power cuts in {district} may occur due to maintenance, repairs, or network
              work. Check your local electricity provider for official schedules and timings. Our
              platform helps you view community-reported power-cut activity in different areas of{" "}
              {district}.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border-l-4 border-amber-400 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
            <BoltIcon className="h-4 w-4 text-amber-500" />
            About Power Tracking in {district}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            This page aggregates every community-submitted power cut report tied to a PIN code
            within {district}
            {totalAreas > 0
              ? `, currently tracking ${totalAreas} area${totalAreas === 1 ? "" : "s"}`
              : ""}
            {activeAreas > 0
              ? `, with ${activeAreas} area${activeAreas === 1 ? "" : "s"} showing an active outage right now`
              : ""}
            . Coverage is sourced from India Post&apos;s own postal directory, so it reflects real,
            verifiable localities — not a random guess.
          </p>
        </section>

        <section className="rounded-xl border-l-4 border-blue-900 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
            <ChartBarIcon className="h-4 w-4 text-blue-900" />
            Area Power Score &amp; Trends
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Every PIN code above also has its own Area Power Score — a 30-day uptime estimate —
            and a 90-day outage trend chart. Open any pincode in {district} above to see its full
            history, or check the statewide{" "}
            <Link href="/stats" className="font-medium text-blue-900 hover:underline">
              statistics dashboard
            </Link>{" "}
            for the bigger picture.
          </p>
        </section>

        <section className="rounded-xl border-l-4 border-emerald-500 bg-white p-5 shadow-sm md:col-span-2">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
            <SearchIcon className="h-4 w-4 text-emerald-600" />
            Report or Check Another Area
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Experiencing an outage in {district} right now?{" "}
            <Link href="/report" className="font-medium text-blue-900 hover:underline">
              Report it
            </Link>{" "}
            in under a minute, or{" "}
            <Link href={backHref} className="font-medium text-blue-900 hover:underline">
              {backLabel}
            </Link>
            .
          </p>
        </section>
      </div>

      <section className="rounded-xl border-l-4 border-zinc-300 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-blue-950">
          <MessageIcon className="h-5 w-5 text-zinc-500" />
          {district} FAQ
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
