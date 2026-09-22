import Link from "next/link";
import { BoltIcon, CheckCircleIcon, MessageIcon, SendIcon } from "./icons";

const REPORT_FAQS = [
  {
    q: "Is reporting a power cut really anonymous?",
    a: "Yes. You don't need an account, email, or phone number to submit a report. We only store a one-way cryptographic hash of your device's IP address, used solely to prevent spam — it can't be reversed to identify you.",
  },
  {
    q: "What if I report by mistake, or my power comes back right away?",
    a: 'No problem — open your report\'s pincode page and tap "Power is Back" (or submit a new restored report) to update the status for your neighbors.',
  },
  {
    q: "Why was my report rejected or rate-limited?",
    a: "To keep data trustworthy, the same device can't submit more than one report for the same PIN code within a 10-minute window. If you tried to report again quickly, wait a few minutes and try again.",
  },
  {
    q: "How is my report verified?",
    a: 'It isn\'t independently verified by any authority — that\'s the trade-off of anonymous, real-time reporting. Instead, neighbors in the same area can confirm a report is "still down," and once enough confirmations come in, or another report marks it restored, the status updates automatically.',
  },
];

const GUIDELINES = [
  "Only report an outage you are personally experiencing or can confirm is real.",
  "Add your area or locality name if you can — it helps neighbors recognize the report and makes locality-level pages more accurate.",
  "Keep details factual and brief — no personal information is needed.",
];

export default function ReportPageContent() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: REPORT_FAQS.map((f) => ({
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

      <section className="rounded-xl border-l-4 border-amber-400 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-blue-950">
          <BoltIcon className="h-5 w-5 text-amber-500" />
          Why Report a Power Cut?
        </h2>
        <div className="mt-2 space-y-3 text-sm leading-relaxed text-zinc-600">
          <p>
            A single report does more than update one pincode. It feeds directly into the{" "}
            <Link href="/" className="font-medium text-blue-900 hover:underline">
              live outage map
            </Link>{" "}
            on the home page, contributes to that area&apos;s Area Power Score and 90-day outage
            trend, and helps your neighbors decide whether to call an electrician or simply wait
            it out. Without real reports from real people, the areas around you stay blank —
            reporting is what makes the{" "}
            <Link href="/states" className="font-medium text-blue-900 hover:underline">
              state
            </Link>
            ,{" "}
            <Link href="/cities/mumbai" className="font-medium text-blue-900 hover:underline">
              city
            </Link>
            , and{" "}
            <Link href="/district/new-delhi" className="font-medium text-blue-900 hover:underline">
              district
            </Link>{" "}
            directories useful in the first place.
          </p>
          <p>
            Before reporting, it&apos;s worth checking whether the outage is actually planned
            maintenance rather than a fault — see the{" "}
            <Link href="/maintenance" className="font-medium text-blue-900 hover:underline">
              planned outage notices
            </Link>{" "}
            for your area first. If nothing is listed there, it&apos;s almost certainly an
            unplanned cut worth reporting.
          </p>
        </div>
      </section>

      <section className="rounded-xl border-l-4 border-blue-900 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-blue-950">
          <SendIcon className="h-4 w-4 text-blue-900" />
          What Happens After You Submit
        </h2>
        <div className="mt-2 space-y-3 text-sm leading-relaxed text-zinc-600">
          <p>
            Your report is published immediately — there&apos;s no approval queue. You&apos;ll
            get a unique complaint reference number (like PCT-2026-XXXXXXXX) that you can look up
            any time on the{" "}
            <Link href="/track" className="font-medium text-blue-900 hover:underline">
              Track Complaint
            </Link>{" "}
            page, even without saving the page or creating an account. From there, other users
            nearby can confirm the outage is ongoing or mark it restored, and the status updates
            automatically once enough confirmations come in. You can read the full mechanics on
            the{" "}
            <Link href="/how-it-works" className="font-medium text-blue-900 hover:underline">
              how it works
            </Link>{" "}
            page.
          </p>
        </div>
      </section>

      <section className="rounded-xl border-l-4 border-emerald-500 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-blue-950">
          <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
          Reporting Guidelines
        </h2>
        <ul className="mt-3 space-y-2.5">
          {GUIDELINES.map((g) => (
            <li key={g} className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-600">
              <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>{g}</span>
            </li>
          ))}
          <li className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-600">
            <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            <span>
              If you&apos;re unsure of your PIN code, you can look it up first from the{" "}
              <Link href="/" className="font-medium text-blue-900 hover:underline">
                home page search
              </Link>
              .
            </span>
          </li>
        </ul>
      </section>

      <section className="rounded-xl border-l-4 border-zinc-300 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-blue-950">
          <MessageIcon className="h-5 w-5 text-zinc-500" />
          Reporting FAQ
        </h2>
        <div className="mt-3 divide-y divide-zinc-100">
          {REPORT_FAQS.map((f) => (
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
