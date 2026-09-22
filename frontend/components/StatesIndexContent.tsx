import Link from "next/link";
import { BoltIcon, ChartBarIcon, MessageIcon, SearchIcon } from "./icons";

const STATES_INDEX_FAQS = [
  {
    q: "How many Indian states and union territories are covered?",
    a: "Every Indian state and union territory can be tracked, since coverage is based on PIN code rather than a fixed list of regions. A state page simply aggregates every report submitted for a pincode that falls within that state.",
  },
  {
    q: "Why does one state show far more reports than another?",
    a: "Report counts reflect how many people in that state are actively using PowerCut, not how reliable the electricity supply actually is. A state with fewer active users will show fewer reports even if outages are just as common there.",
  },
  {
    q: "Can I track a union territory the same way as a state?",
    a: "Yes. Union territories like Delhi and Jammu and Kashmir are tracked exactly the same way as states, aggregated from the PIN codes that fall within them.",
  },
  {
    q: "Does each state have its own electricity provider?",
    a: "Yes — electricity distribution in India is handled state-by-state (and sometimes city-by-city) by DISCOMs, which is exactly why outage patterns, complaint processes, and reliability can vary so much from one state page to the next.",
  },
  {
    q: "Can I compare outage activity between two states?",
    a: "Yes. Open the statistics dashboard to see active outages ranked by state side by side, or open any two state pages in separate tabs to compare their tracked areas and recent reports directly.",
  },
];

export default function StatesIndexContent() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: STATES_INDEX_FAQS.map((f) => ({
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
          Understanding State-Wise Power Distribution in India
        </h2>
        <div className="mt-3 space-y-4 text-sm leading-relaxed text-zinc-600">
          <p>
            Unlike a single national grid operator, electricity distribution in India is managed
            state by state — and often city by city within a state — by DISCOMs (distribution
            companies). Some are wholly state-government-run electricity boards, others are
            privatized or run as public-private partnerships, and a few metros have multiple
            DISCOMs operating in different zones of the same city. This fragmented structure is
            exactly why outage frequency, restoration speed, and even complaint helpline numbers
            can differ so much from one state page to the next on PowerCut — there is no
            single national standard to compare against, only what each state&apos;s residents
            report locally.
          </p>
          <div>
            <h3 className="font-bold text-zinc-900">Regional and Seasonal Outage Patterns</h3>
            <p className="mt-1">
              Outage causes also vary by geography and season. Coastal and eastern states see
              spikes during monsoon and cyclone season, when high winds and flooding damage
              overhead lines. Northern plains states often see increased load-shedding during
              summer heatwaves, when air-conditioning demand spikes faster than supply. Hilly and
              northeastern states can face longer restoration times after a fault simply because
              of difficult terrain and fewer redundant line routes. Densely populated urban
              states tend to have more frequent but shorter localized faults, from cable joints
              or transformer overloads, rather than region-wide outages. None of this is unique
              to any one state — it&apos;s worth keeping in mind when comparing why one state
              page looks &ldquo;worse&rdquo; than another at any given time.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        <section className="rounded-xl border-l-4 border-amber-400 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
            <BoltIcon className="h-4 w-4 text-amber-500" />
            How State-Level Tracking Works
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Every report is tied to a 6-digit PIN code, and every PIN code belongs to a state.
            A state page simply rolls up every report from the pincodes within it, so it updates
            automatically as new reports come in — there&apos;s no separate state-level
            submission process. Read more on the{" "}
            <Link href="/how-it-works" className="font-medium text-blue-900 hover:underline">
              how it works
            </Link>{" "}
            page.
          </p>
        </section>

        <section className="rounded-xl border-l-4 border-blue-900 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
            <ChartBarIcon className="h-4 w-4 text-blue-900" />
            Browse Major States
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Jump straight to a few of the most-tracked states:{" "}
            <Link href="/states/maharashtra" className="font-medium text-blue-900 hover:underline">
              Maharashtra
            </Link>
            ,{" "}
            <Link href="/states/uttar-pradesh" className="font-medium text-blue-900 hover:underline">
              Uttar Pradesh
            </Link>
            ,{" "}
            <Link href="/states/karnataka" className="font-medium text-blue-900 hover:underline">
              Karnataka
            </Link>
            ,{" "}
            <Link href="/states/tamil-nadu" className="font-medium text-blue-900 hover:underline">
              Tamil Nadu
            </Link>
            ,{" "}
            <Link href="/states/west-bengal" className="font-medium text-blue-900 hover:underline">
              West Bengal
            </Link>
            ,{" "}
            <Link href="/states/gujarat" className="font-medium text-blue-900 hover:underline">
              Gujarat
            </Link>
            ,{" "}
            <Link href="/states/rajasthan" className="font-medium text-blue-900 hover:underline">
              Rajasthan
            </Link>
            , and{" "}
            <Link href="/states/delhi" className="font-medium text-blue-900 hover:underline">
              Delhi
            </Link>
            . For a live ranking, see the full{" "}
            <Link href="/stats" className="font-medium text-blue-900 hover:underline">
              statistics dashboard
            </Link>
            .
          </p>
        </section>

        <section className="rounded-xl border-l-4 border-emerald-500 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
            <SearchIcon className="h-4 w-4 text-emerald-600" />
            Don&apos;t See Activity for Your State?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            A quiet state page usually just means fewer people nearby have reported yet, not that
            there are no outages.{" "}
            <Link href="/report" className="font-medium text-blue-900 hover:underline">
              Report an outage
            </Link>{" "}
            to be the first, or search your exact PIN code from the{" "}
            <Link href="/" className="font-medium text-blue-900 hover:underline">
              home page
            </Link>{" "}
            for the most precise local status.
          </p>
        </section>
      </div>

      <section className="rounded-xl border-l-4 border-zinc-300 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-blue-950">
          <MessageIcon className="h-5 w-5 text-zinc-500" />
          States Directory FAQ
        </h2>
        <div className="mt-3 divide-y divide-zinc-100">
          {STATES_INDEX_FAQS.map((f) => (
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
