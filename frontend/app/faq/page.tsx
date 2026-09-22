import type { Metadata } from "next";
import Link from "next/link";
import { FAQS } from "@/lib/faqs";
import {
  MessageIcon,
  ShieldIcon,
  CheckCircleIcon,
  SearchIcon,
  ClockIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to every common question about PowerCut's outage reporting, complaint tracking, privacy, and coverage across India.",
  alternates: { canonical: "/faq" },
};

const TRUST_BADGES = [
  { icon: CheckCircleIcon, label: "Always Free" },
  { icon: ShieldIcon, label: "100% Anonymous" },
  { icon: ClockIcon, label: "Updated Regularly" },
  { icon: MessageIcon, label: `${FAQS.length} Questions Answered` },
];

const TOPIC_LINKS = [
  { href: "/report", label: "Reporting an Outage" },
  { href: "/track", label: "Tracking a Complaint" },
  { href: "/coverage", label: "Coverage Details" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/contact", label: "Contact Us" },
];

const CATEGORIES = [...new Set(FAQS.map((f) => f.category))];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="bg-zinc-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-900">
            <SearchIcon className="h-3.5 w-3.5" />
            Citizen Self-Service
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-blue-950 sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Answers to common questions about PowerCut&apos;s outage reporting, complaint
            tracking, privacy, and coverage.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {TRUST_BADGES.map((b) => (
              <span key={b.label} className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <b.icon className="h-4 w-4 text-emerald-600" />
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-5 lg:items-start">
          <div className="lg:col-span-3 lg:order-2">
            <div className="space-y-6">
              {CATEGORIES.map((category) => (
                <div
                  key={category}
                  className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
                >
                  <div className="flex items-center gap-2 bg-blue-950 px-5 py-3">
                    <MessageIcon className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wide text-white">
                      {category}
                    </span>
                  </div>
                  <dl className="divide-y divide-zinc-100 p-5">
                    {FAQS.filter((f) => f.category === category).map((f) => (
                      <div key={f.q} className="py-3 first:pt-0 last:pb-0">
                        <dt className="font-semibold text-zinc-900">{f.q}</dt>
                        <dd className="mt-1 text-sm leading-relaxed text-zinc-600">{f.a}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:order-1 lg:col-span-2">
            <div className="rounded-xl border-l-4 border-amber-400 bg-white p-5 shadow-sm">
              <h2 className="text-base font-extrabold text-blue-950">Browse by Topic</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Looking for more detail than a quick answer? These pages cover each topic in
                depth.
              </p>
              <ul className="mt-3 space-y-2">
                {TOPIC_LINKS.map((t) => (
                  <li key={t.href}>
                    <Link
                      href={t.href}
                      className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2.5 text-sm font-semibold text-blue-950 hover:border-amber-400"
                    >
                      {t.label}
                      <span aria-hidden>&rarr;</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-600/20">
              PowerCut is an independent, community-driven service. It is not affiliated
              with any government agency, DISCOM, or electricity provider.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
