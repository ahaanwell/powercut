import { MessageIcon } from "./icons";

const LOCAL_FAQS = [
  {
    q: "How Can I Check If There Is a Power Cut in My Area?",
    a: "You can check the current power status for your area to quickly find out whether an outage has been reported.",
  },
  {
    q: "Why Is There a Power Outage in My Area?",
    a: "Power outage can happen due to scheduled maintenance, technical faults, weather conditions, or unexpected issues with the electricity network.",
  },
  {
    q: "How Long Will the Power Cut Last?",
    a: "The duration depends on the cause of the outage. If an estimated restoration time is available, you can check the latest update for your area.",
  },
  {
    q: "Can I Check Power Cuts Near My Location?",
    a: "Yes, you can check outage information for your local area to see whether nearby power cuts have been reported.",
  },
  {
    q: "How Do I Know If a Power Cut Is Scheduled?",
    a: "Scheduled outages are usually announced in advance by the local electricity provider. Check their latest notices or outage updates for details.",
  },
  {
    q: "What Should I Do If My Power Goes Out?",
    a: "First, check whether the outage is limited to your home or affects the surrounding area. If necessary, report the issue to your electricity provider.",
  },
  {
    q: "Can I Get Updates When the Power Comes Back?",
    a: "Depending on the service available in your area, you may be able to receive outage and restoration updates.",
  },
  {
    q: "What Causes Unexpected Power Outages?",
    a: "Unexpected outages can be caused by equipment failures, damaged power lines, severe weather, accidents, or other network problems.",
  },
  {
    q: "How Often Is Power Cut Information Updated?",
    a: "Outage information is updated as new reports and restoration details become available, so checking regularly can help you stay informed.",
  },
  {
    q: "Where Can I Report a Power Cut?",
    a: "If your power is out, enter your PIN code and submit a quick report. You can optionally add your locality or other details. No account is required.",
  },
];

export default function LocalOutageFaq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: LOCAL_FAQS.map((f) => ({
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
      <h2 className="flex items-center gap-2 text-xl font-extrabold text-blue-950">
        <MessageIcon className="h-5 w-5 text-amber-500" />
        Power Cut FAQs
      </h2>

      <div className="mt-4 divide-y divide-zinc-100">
        {LOCAL_FAQS.map((f) => (
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
