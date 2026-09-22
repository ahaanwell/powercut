import Link from "next/link";
import { FAQS } from "@/lib/faqs";
import { MessageIcon } from "./icons";

export default function FaqAccordion() {
  const featured = FAQS.slice(0, 6);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: featured.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
        <h2 className="flex items-center gap-2 text-xl font-extrabold text-blue-950">
          <MessageIcon className="h-5 w-5 text-amber-500" />
          Frequently Asked Questions
        </h2>
        <Link href="/faq" className="text-sm font-bold text-blue-900 hover:underline">
          View Full FAQ &rarr;
        </Link>
      </div>

      <div className="mt-4 divide-y divide-zinc-100">
        {featured.map((f) => (
          <details key={f.q} className="group py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-zinc-900 marker:content-none">
              {f.q}
              <span className="shrink-0 text-lg text-zinc-400 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm text-zinc-600">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
