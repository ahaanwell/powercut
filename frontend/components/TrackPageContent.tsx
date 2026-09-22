import Link from "next/link";
import { BoltIcon, CheckCircleIcon, MessageIcon, SearchIcon } from "./icons";

const TRACK_FAQS = [
  {
    q: "Do I need to log in to track my complaint?",
    a: "No. Tracking works the same way reporting does — anonymously, with no account. The reference number itself is your only key, so keep it somewhere safe if you want to check back later.",
  },
  {
    q: "How long does a reference number stay valid?",
    a: "Indefinitely. Every report is kept in the system, so you can look up its reference number weeks or months later to see its final recorded status.",
  },
  {
    q: "Can I track a complaint someone else submitted?",
    a: "Yes — if they share the reference number with you (for example over WhatsApp), anyone can look up that report's status. No personal information is tied to it.",
  },
  {
    q: "What if the status hasn't updated even though power is back?",
    a: 'Status only updates when someone submits a "Power is Back" confirmation for that area. If you notice power has been restored, help keep the record accurate by confirming it yourself on the pincode\'s status page.',
  },
];

export default function TrackPageContent() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: TRACK_FAQS.map((f) => ({
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
          What Is a Complaint Reference Number?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Every time you{" "}
          <Link href="/report" className="font-medium text-blue-900 hover:underline">
            report a power cut
          </Link>{" "}
          or confirm one has been restored, PowerCut generates a unique reference number
          in the format <span className="font-mono text-zinc-800">PCT-2026-XXXXXXXX</span> —
          similar to how an official grievance portal issues a complaint ID. It works entirely
          without an account: the number itself is proof the report exists, so you can note it
          down or share it and look it up any time afterward.
        </p>
      </section>

      <section className="rounded-xl border-l-4 border-blue-900 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-blue-950">
          <CheckCircleIcon className="h-5 w-5 text-blue-900" />
          What You&apos;ll See When You Track
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Looking up a reference number shows its current status — Reported, Outage Ongoing, or
          Power Restored — along with the PIN code, area, when it was submitted, and how many
          neighbors have confirmed it. From there you can jump straight to that pincode&apos;s
          full status page to see every other recent report nearby, or check the{" "}
          <Link href="/stats" className="font-medium text-blue-900 hover:underline">
            outage statistics
          </Link>{" "}
          for the wider area.
        </p>
      </section>

      <section className="rounded-xl border-l-4 border-emerald-500 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-blue-950">
          <SearchIcon className="h-5 w-5 text-emerald-600" />
          Lost Your Reference Number?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          No reference number, no problem — you don&apos;t need one to check current status. Go
          to the{" "}
          <Link href="/" className="font-medium text-blue-900 hover:underline">
            home page
          </Link>{" "}
          and search your PIN code or locality directly, or browse recent activity by{" "}
          <Link href="/states" className="font-medium text-blue-900 hover:underline">
            state
          </Link>{" "}
          or{" "}
          <Link href="/district/new-delhi" className="font-medium text-blue-900 hover:underline">
            district
          </Link>
          . Reference numbers are only needed to look up one specific report you submitted
          earlier.
        </p>
      </section>

      <section className="rounded-xl border-l-4 border-zinc-300 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-blue-950">
          <MessageIcon className="h-5 w-5 text-zinc-500" />
          Tracking FAQ
        </h2>
        <div className="mt-3 divide-y divide-zinc-100">
          {TRACK_FAQS.map((f) => (
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
