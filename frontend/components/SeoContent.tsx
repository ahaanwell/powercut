const HOW_TO_STEPS = [
  {
    name: "Enter your PIN code",
    text: "Go to the search box on the PowerCut home page and enter your area's 6-digit Indian PIN code, or start typing your locality name.",
  },
  {
    name: "Check the live status",
    text: 'You\'ll see the current status for that PIN code — "No Reports Yet," "Outage," or "Restored" — along with when it was last updated.',
  },
  {
    name: "Review recent reports",
    text: "Open the PIN code's page to see recent reports from that area, including how many neighbors have confirmed the outage is still ongoing.",
  },
  {
    name: "Report or confirm if needed",
    text: 'If your power is out and nothing is showing, submit a free report. If power has come back, tap "Power is Back" to help keep the status accurate for others.',
  },
];

export default function SeoContent() {
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Check Power Cut Status by PIN Code",
    description:
      "Step-by-step guide to checking live, community-reported electricity outage status for any Indian PIN code on PowerCut.",
    step: HOW_TO_STEPS.map((s) => ({
      "@type": "HowToStep",
      name: s.name,
      text: s.text,
    })),
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      <h2 className="text-xl font-extrabold text-blue-950">
        Track Power Cuts Across India by PIN Code
      </h2>

      <div className="mt-3 space-y-6 text-sm leading-relaxed text-zinc-600">
        <p>
          PowerCut is a free, community-driven power outage tracker that lets you check
          the current electricity supply status for any area in India using just a 6-digit PIN
          code. Instead of waiting on hold with your local electricity board or refreshing an
          official outage map that may only update once a shift, you can search your pincode or
          locality and instantly see whether a power cut has been reported nearby, how long it
          has lasted, how many neighbors have confirmed it, and whether it has already been
          restored. It works the same way for a single residential building, an entire housing
          society, or a commercial district — anywhere a valid Indian PIN code applies.
        </p>

        <section>
          <h3 className="font-bold text-zinc-900">What Is a Power Cut and Why Does It Happen?</h3>
          <p className="mt-1">
            A power cut, or electricity outage, is any interruption in the supply of electricity
            to a home, building, or area. In India, outages generally fall into a few categories.
            <strong className="font-semibold text-zinc-800"> Scheduled maintenance</strong>{" "}
            outages are planned in advance by the local DISCOM (distribution company) to repair
            or upgrade transformers, lines, or substations, and are usually announced ahead of
            time.{" "}
            <strong className="font-semibold text-zinc-800">Unscheduled faults</strong> happen
            without warning — a blown fuse, a tripped circuit breaker, a damaged transformer, a
            fallen tree on a line, or a cable fault — and are the most common reason for a sudden,
            localized power cut.{" "}
            <strong className="font-semibold text-zinc-800">Weather-related outages</strong> spike
            during monsoon season and storms, when high winds, flooding, or lightning strikes
            damage overhead lines and substations.{" "}
            <strong className="font-semibold text-zinc-800">Load shedding</strong>, where supply
            is deliberately reduced during periods of peak demand or generation shortfall, is
            less common today than it was a decade ago, but still occurs in some regions during
            heatwaves or supply constraints. Because these causes affect different areas at
            different times, an outage that hits one street may leave the next one completely
            unaffected — which is exactly why hyperlocal, PIN-code-level reporting is useful.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-zinc-900">How to Check Power Cut Status for Your Area</h3>
          <ol className="mt-1 list-decimal space-y-1.5 pl-5">
            {HOW_TO_STEPS.map((s) => (
              <li key={s.name}>
                <span className="font-semibold text-zinc-800">{s.name}.</span> {s.text}
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h3 className="font-bold text-zinc-900">How Outage Reporting &amp; Verification Works</h3>
          <p className="mt-1">
            Anyone can anonymously report a power cut for their area in a few seconds — no
            account or sign-up required. Each report is timestamped and grouped by pincode, and
            neighbors in the same area can confirm whether the outage is still ongoing or has
            already been resolved. Once enough confirmations come in, the status automatically
            updates from &ldquo;Reported&rdquo; to &ldquo;Restored,&rdquo; so the information
            stays current without depending on any single person continuing to check back. Every
            report also receives a unique complaint reference number (for example,
            PCT-2026-XXXXXXXX) that you can use on the Track Complaint page to look up its status
            later, similar to how a formal grievance-tracking system works.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-zinc-900">
            Understanding Your Area&apos;s Power Score and Outage Trends
          </h3>
          <p className="mt-1">
            Every tracked PIN code has an Area Power Score — an estimated 30-day uptime
            percentage calculated from how long reported outages in that area lasted before
            being marked restored. A score above 95% is labeled low risk, 80&ndash;95% moderate
            risk, and below 80% high risk. Alongside the score, a 90-day outage trend chart shows
            whether an area has had a spike in reports recently or has been consistently stable,
            making it easier to spot recurring load-shedding or infrastructure patterns over
            time rather than judging an area by a single outage.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-zinc-900">
            Coverage Across States, Cities &amp; Districts
          </h3>
          <p className="mt-1">
            Because tracking is organized by PIN code, every Indian state and union territory —
            from Maharashtra, Karnataka, and Tamil Nadu to Uttar Pradesh, West Bengal, and
            Delhi — can be searched. Dedicated directories are also available for major metro
            areas, including Mumbai, Delhi NCR, Bengaluru, Pune, Hyderabad, Chennai, Kolkata, and
            Ahmedabad, plus district-level area listings such as New Delhi, North Delhi, and
            South Delhi. The live outage map and state, city, and district pages make it easy to
            browse electricity supply status beyond just your own pincode, whether you&apos;re
            checking on family in another city or researching outage patterns for a whole
            region.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-zinc-900">What to Do During a Power Outage</h3>
          <p className="mt-1">
            If your power goes out, first check your own building&apos;s MCB or fuse box and any
            shared meter room to rule out a local trip before assuming it&apos;s an area-wide
            cut. Keep your refrigerator and freezer closed as much as possible to preserve food.
            Unplug sensitive electronics and appliances to protect them from surges when power
            returns. Keep a charged flashlight or power bank on hand rather than relying on
            candles indoors. Never approach or touch a fallen power line — treat every downed
            line as live and report it to your DISCOM immediately. For the official electricity
            complaint helpline in most Indian states, you can also dial{" "}
            <a href="tel:1912" className="font-semibold text-blue-900 hover:underline">
              1912
            </a>
            . Reporting the outage on PowerCut alongside contacting your utility helps
            your neighbors know they&apos;re not alone while waiting for restoration.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-zinc-900">Why Community-Reported Data Matters — and Its Limits</h3>
          <p className="mt-1">
            PowerCut is an independent, community-driven project and is not affiliated
            with any government agency, DISCOM, or electricity provider, and it does not have
            access to official grid telemetry. Its value comes entirely from real people
            reporting what they&apos;re experiencing in real time, which means coverage is
            naturally strongest in areas with active users and can be sparse or outdated
            elsewhere. Reports may occasionally be incomplete, delayed, or inaccurate. Treat it
            as a fast, crowd-sourced pulse check on your area — a useful first signal, not a
            replacement for your utility&apos;s official outage information in an emergency.
          </p>
        </section>
      </div>
    </div>
  );
}
