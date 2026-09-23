import Link from "next/link";

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
          <h3 className="font-bold text-zinc-900">How to Check Power Cut Status for Your Area</h3>
          <ol className="mt-1 list-decimal space-y-1.5 pl-5">
            {HOW_TO_STEPS.map((s) => (
              <li key={s.name}>
                <span className="font-semibold text-zinc-800">{s.name}.</span> {s.text}
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-zinc-100 pt-6">
          <h2 className="text-lg font-extrabold text-blue-950">
            Power Cut in My Area &ndash; Check Live Power Outage Status
          </h2>
          <div className="mt-3 space-y-4">
            <p>
              A power cut in my area can happen without warning and can disrupt work, travel,
              businesses, communication, and everyday life. When electricity goes off, the first
              thing most people want to know is whether the problem is limited to their home,
              affecting the surrounding locality, or part of a larger outage.
            </p>
            <p>
              Our power-cut tracking platform helps you quickly check power outage status using
              your 6-digit PIN code or locality. Instead of waiting for information to spread
              through local groups or relying only on word of mouth, you can search your area and
              see recent community-reported power-cut activity.
            </p>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-zinc-900">Check Power Outage Near Me</h3>
          <div className="mt-1 space-y-3">
            <p>
              Looking for a power outage near me? Start by entering your PIN code or locality
              name on our website. The platform displays reported power cuts associated with that
              area, helping you understand whether other people nearby are experiencing the same
              issue.
            </p>
            <p>
              If your electricity is currently off, you can also report the outage. Your report
              is recorded with a unique complaint reference number and can help other people in
              the same area understand that an outage has been reported.
            </p>
            <p>
              The information on the platform is based on reports and confirmations from users.
              This makes it possible to build a local picture of ongoing electricity
              interruptions as people in the affected area share updates.
            </p>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-zinc-900">Power Cut Near My Location</h3>
          <div className="mt-1 space-y-3">
            <p>
              When searching for a power cut near my location, you can use your PIN code or
              search for your locality to find relevant outage activity. You do not need to
              create an account to submit a report or track a complaint.
            </p>
            <p>
              Once an outage has been reported, other users in the same area can confirm that
              their electricity is still unavailable. They can also report when power has
              returned. This community confirmation system helps keep the recorded outage status
              updated.
            </p>
            <p>
              After three restoration confirmations, the reported outage is automatically marked
              as Restored. This provides a simple way to see whether a reported power cut is
              still active or has been confirmed as resolved by people in the affected area.
            </p>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-zinc-900">Check Power Outage Status</h3>
          <div className="mt-1 space-y-3">
            <p>
              Checking the power outage status can help you understand the latest recorded
              situation before making plans or reporting the same issue again. Search your PIN
              code or locality to see available outage information and the latest community
              confirmations.
            </p>
            <p>
              If you have already reported an outage, you can use your complaint reference number
              on the{" "}
              <Link href="/track" className="font-medium text-blue-900 hover:underline">
                Track Complaint
              </Link>{" "}
              page. The reference number lets you check the recorded status without needing an
              account.
            </p>
            <p>
              Because outage information can change as new reports and confirmations are
              submitted, the status shown on the website represents the latest information
              recorded by the community.
            </p>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-zinc-900">Scheduled Power Cuts</h3>
          <div className="mt-1 space-y-3">
            <p>
              Some electricity interruptions may be scheduled power cuts related to maintenance,
              repairs, upgrades, or other planned work by the local electricity provider.
              Scheduled outage information may be announced separately by the relevant
              electricity provider.
            </p>
            <p>
              Our platform can help you discover reported power-cut activity in your area, but it
              should not be treated as an official notice from an electricity provider. For
              confirmed scheduled maintenance timings or official restoration information, users
              should also check announcements from their local electricity provider.
            </p>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-zinc-900">Explore Power-Cut Activity in Your Area</h3>
          <div className="mt-1 space-y-3">
            <p>
              Power cuts are not always isolated incidents. Our website allows you to look beyond
              a single report using the live outage map, statistics dashboard, Area Power Score,
              and 90-day trends.
            </p>
            <p>
              You can also browse tracked activity through{" "}
              <Link href="/states" className="font-medium text-blue-900 hover:underline">
                state, city, and district directories
              </Link>
              . Whether you are checking a power cut in my area, searching for a power outage
              near me, or looking for a power cut near my location, the platform provides a
              convenient way to discover community-reported electricity outage activity and track
              its latest recorded status.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
