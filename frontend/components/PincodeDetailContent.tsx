import Link from "next/link";
import { slugify } from "@/lib/slugify";
import {
  BoltIcon,
  ShieldIcon,
  ChartBarIcon,
  MessageIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from "./icons";

export default function PincodeDetailContent({
  pincode,
  place,
  district,
  state,
  reportCount,
}: {
  pincode: string;
  place: string;
  district: string;
  state: string;
  reportCount: number;
}) {
  const stateSlug = slugify(state);
  const locationLabel = [place, district, state].filter(Boolean).join(", ");

  const faqs = [
    {
      q: `Is this official electricity board data for ${place || pincode}?`,
      a: `No. PowerCut is an independent, community-run platform, not affiliated with any government agency or DISCOM operating in ${state || "this area"}. Every report on this page comes from someone in the area submitting it directly.`,
    },
    {
      q: `How current is the status shown for ${pincode}?`,
      a: `As current as the latest report. Each report card shows exactly when it was submitted, so check the timestamp rather than assuming the status is still accurate if the most recent report is old — outages get resolved without always being marked restored.`,
    },
    {
      q: `Can I get a reference number for my report?`,
      a: `Yes. Every report submitted through this page generates a unique reference number (formatted like PCT-2026-XXXXXXXX) that you can look up anytime on the Track Complaint page, similar to a formal grievance ticket.`,
    },
    {
      q: `No one has reported anything here yet — what does that mean?`,
      a: `It means either the power is on and nobody has needed to report, or an outage is happening but no one nearby has submitted a report yet. Coverage depends entirely on community participation, so an empty report list isn't a guarantee of uninterrupted power.`,
    },
    {
      q: `Who do I contact for an official complaint about ${pincode}?`,
      a: `Contact your local DISCOM directly, or try the common electricity helpline 1912, active in many Indian states. This page is a community backup for real-time visibility, not a replacement for your utility's official complaint channel.`,
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
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-blue-950">
          <BoltIcon className="h-5 w-5 text-amber-500" />
          About {place || `PIN code ${pincode}`}
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-600">
          <p>
            This page tracks real-time, community-reported power cut activity for{" "}
            {locationLabel || `PIN code ${pincode}`}
            {district ? `, part of ${district} district` : ""}. It combines recent outage
            reports, restoration confirmations, and historical activity from the{" "}
            {reportCount > 0
              ? `${reportCount} report${reportCount === 1 ? "" : "s"} logged so far`
              : "reports submitted"}{" "}
            to give a live picture of local conditions — updated the moment someone in the area
            submits a report.
          </p>
          <p>
            Every report is anonymous and takes under a minute to submit, with no account or
            phone number required beyond the PIN code itself. This is community-generated
            information reflecting what local reporters have observed, not an official statement
            from the electricity distribution company.
          </p>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        <section className="rounded-xl border-l-4 border-blue-900 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
            <ShieldIcon className="h-4 w-4 text-blue-900" />
            Understanding the Status
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-600">
            <p className="flex items-start gap-2">
              <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <span>
                <span className="font-semibold text-zinc-900">Outage</span> — recent community
                reports indicate a power cut is ongoing in this area.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                <span className="font-semibold text-zinc-900">Restored</span> — the most recent
                reports indicate electricity has come back.
              </span>
            </p>
            <p>
              If reports look mixed or old, lean on the timestamp of the latest one and check{" "}
              <Link href={`/states/${stateSlug}`} className="font-medium text-blue-900 hover:underline">
                nearby areas in {state}
              </Link>{" "}
              rather than assuming a single report still holds.
            </p>
          </div>
        </section>

        <section className="rounded-xl border-l-4 border-emerald-500 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
            <ChartBarIcon className="h-4 w-4 text-emerald-600" />
            What the Area Power Score Means
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            The Area Power Score above is a 30-day grid uptime estimate calculated from every
            report logged for this PIN code — it&apos;s an informational indicator of recent reporting
            patterns, not an official reliability rating issued by any electricity provider. With
            very few reports, treat the score as a rough signal rather than a precise figure.
          </p>
        </section>

        <section className="rounded-xl border-l-4 border-amber-400 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
            <BoltIcon className="h-4 w-4 text-amber-500" />
            Reporting Here
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Use Report Outage above the moment your power goes out, and Power Back once it
            returns, so this page&apos;s status reflects reality for your neighbors. Each report gets
            a reference number you can{" "}
            <Link href="/track" className="font-medium text-blue-900 hover:underline">
              look up later
            </Link>{" "}
            on the Track Complaint page.
          </p>
        </section>
      </div>

      <section className="rounded-xl border-l-4 border-zinc-300 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-blue-950">
          <MessageIcon className="h-5 w-5 text-zinc-500" />
          FAQ for {place || pincode}
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
