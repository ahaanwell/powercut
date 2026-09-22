import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ShieldIcon, CheckCircleIcon, MapPinIcon, ClockIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How PowerCut collects, uses, and protects information — no accounts, no tracking cookies, no data sold.",
  alternates: { canonical: "/privacy" },
};

const EFFECTIVE_DATE = "22 September 2026";

const TRUST_BADGES = [
  { icon: ShieldIcon, label: "No Accounts Required" },
  { icon: CheckCircleIcon, label: "Data Never Sold" },
  { icon: MapPinIcon, label: "No GPS Tracking" },
  { icon: ClockIcon, label: `Effective ${EFFECTIVE_DATE}` },
];

const TOC = [
  { id: "information-we-collect", label: "1. Information We Collect" },
  { id: "how-we-use-information", label: "2. How We Use Information" },
  { id: "location-and-maps", label: "3. Location Data & Maps" },
  { id: "cookies-and-storage", label: "4. Cookies, Storage & Analytics" },
  { id: "reports-and-comments", label: "5. Reports & Comments" },
  { id: "sharing", label: "6. How We Share Information" },
  { id: "retention", label: "7. Data Retention" },
  { id: "security", label: "8. Security" },
  { id: "your-rights", label: "9. Your Rights & Choices" },
  { id: "children", label: "10. Children's Privacy" },
  { id: "third-party", label: "11. Third-Party Services" },
  { id: "changes", label: "12. Changes to This Policy" },
  { id: "contact", label: "13. Contact" },
];

export default function PrivacyPage() {
  return (
    <div className="bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-900">
            <ShieldIcon className="h-3.5 w-3.5" />
            Legal
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-blue-950 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Effective Date: {EFFECTIVE_DATE}. This explains what PowerCut (&ldquo;we,&rdquo;
            &ldquo;our&rdquo;) collects, how it&apos;s used, and your choices.
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
          <div className="space-y-6 text-sm leading-relaxed text-zinc-600 lg:col-span-3">
            <p>
              PowerCut is an independent, community-driven power outage reporting and
              monitoring platform for India. This Privacy Policy explains how we collect, use,
              disclose, store, and protect information when you use our website, outage maps,
              reporting tools, and related services (the &ldquo;Service&rdquo;). We&apos;ve tried
              to write it in plain language rather than dense legalese, because the Service itself
              is built to work without collecting much about you in the first place.
            </p>

            <Section id="information-we-collect" title="1. Information We Collect">
              <p>
                PowerCut does not require account registration, and we never ask for your
                name, email address, or phone number to use any feature. What we collect depends
                on what you do:
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li>
                  <strong className="font-semibold text-zinc-800">Outage reports</strong> — the
                  PIN code you enter, plus any optional area/locality text and description you
                  choose to add.
                </li>
                <li>
                  <strong className="font-semibold text-zinc-800">Neighborhood comments</strong> —
                  the message you write and an optional display name you make up yourself; no
                  identity verification is performed or possible.
                </li>
                <li>
                  <strong className="font-semibold text-zinc-800">
                    Basic technical data
                  </strong>{" "}
                  — your IP address is processed transiently by our server and hosting
                  infrastructure to serve requests and prevent abuse, as described in Section 5.
                </li>
              </ul>
              <p className="mt-2">
                We do not intentionally collect sensitive personal data, and there is nothing in
                the Service that requests it.
              </p>
            </Section>

            <Section id="how-we-use-information" title="2. How We Use Information">
              <p>We use the information above to:</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li>Display outage reports, status pages, statistics, and the live outage map.</li>
                <li>Calculate derived figures like Area Power Scores and 90-day outage trends.</li>
                <li>Rate-limit repeat submissions from the same device to reduce spam.</li>
                <li>Detect abuse or misuse of the reporting and comment features.</li>
                <li>Maintain the security and reliability of the Service.</li>
              </ul>
            </Section>

            <Section id="location-and-maps" title="3. Location Data & Maps">
              <p>
                PowerCut does not request or use your device&apos;s GPS location. Map
                positions are derived entirely from the PIN code you search or report — we
                geocode a pincode&apos;s approximate coordinates server-side using a public
                geocoding service, never your device&apos;s actual location.
              </p>
              <p className="mt-2">
                Map tiles themselves are loaded directly by your browser from OpenStreetMap&apos;s
                tile servers, which means your IP address is visible to OpenStreetMap when a map
                is displayed, under{" "}
                <a
                  href="https://osmfoundation.org/wiki/Privacy_Policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-900 hover:underline"
                >
                  OpenStreetMap Foundation&apos;s own privacy policy
                </a>
                , not ours.
              </p>
            </Section>

            <Section id="cookies-and-storage" title="4. Cookies, Storage & Analytics">
              <p>
                We do not use tracking cookies, and there is no analytics or advertising script
                running on this site. The only thing we store in your browser is a text-size
                preference (if you use the accessibility toolbar&apos;s A-/A/A+ control), saved
                via your browser&apos;s local storage. It never leaves your device and is not
                readable by us.
              </p>
            </Section>

            <Section id="reports-and-comments" title="5. Reports & Comments">
              <p>
                When you submit a report or comment, it is published immediately and visible to
                anyone browsing that pincode&apos;s page — please don&apos;t include information
                you don&apos;t want public. To prevent spam, we store a one-way cryptographic hash
                (SHA-256) of the submitting device&apos;s IP address alongside each report, used
                solely to enforce a 10-minute rate limit per pincode. This hash cannot be reversed
                to recover the original IP address. Comments are rate-limited the same way, but no
                IP hash is permanently stored against a comment — only a temporary, in-memory
                counter that clears automatically.
              </p>
            </Section>

            <Section id="sharing" title="6. How We Share Information">
              <p>
                We do not sell personal data, and we do not share individual reports or comments
                with advertisers. We do rely on infrastructure providers to run the Service (see
                Section 11), and we may disclose information if required by law or to protect the
                security of the Service, its users, or the public.
              </p>
            </Section>

            <Section id="retention" title="7. Data Retention">
              <p>
                Reports and comments are retained indefinitely, since historical data is what
                powers each area&apos;s Area Power Score and 90-day outage trend. Because reports
                aren&apos;t tied to any account or identity, there&apos;s no personal profile to
                delete — the retained data is the report content itself (pincode, area,
                description, timestamps), not information that identifies who submitted it.
              </p>
            </Section>

            <Section id="security" title="8. Security">
              <p>
                We use reasonable technical safeguards — including rate limiting, input
                validation, and hashed IP storage — to protect the Service. However, no method of
                transmission over the internet or electronic storage is completely secure, so we
                cannot guarantee absolute security.
              </p>
            </Section>

            <Section id="your-rights" title="9. Your Rights & Choices">
              <p>
                Because reporting and commenting don&apos;t require an account or collect
                identifying information, there is no personal profile for us to show, correct, or
                delete on request — the report content itself isn&apos;t linked back to you in any
                way we can reverse. You can still control what you submit: don&apos;t include
                anything in an area, description, or comment that you don&apos;t want public, and
                you can clear your saved text-size preference at any time by clearing your
                browser&apos;s local storage.
              </p>
            </Section>

            <Section id="children" title="10. Children's Privacy">
              <p>
                PowerCut is not directed at children and is not designed to collect
                personal information from anyone. Since no account or identifying data is
                required to use the Service, we do not knowingly collect personal data from
                children.
              </p>
            </Section>

            <Section id="third-party" title="11. Third-Party Services">
              <p>The Service relies on the following third-party infrastructure to operate:</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li>
                  <strong className="font-semibold text-zinc-800">MongoDB Atlas</strong> — hosts
                  the database of reports and comments.
                </li>
                <li>
                  <strong className="font-semibold text-zinc-800">India Post&apos;s public PIN code API</strong> —
                  used to look up locality names for a PIN code; no personal data is sent to it.
                </li>
                <li>
                  <strong className="font-semibold text-zinc-800">OpenStreetMap / Nominatim</strong> —
                  used for map tiles and pincode-to-coordinate geocoding, as described in Section
                  3.
                </li>
              </ul>
              <p className="mt-2">
                These providers process data under their own privacy policies, which we encourage
                you to review separately.
              </p>
            </Section>

            <Section id="changes" title="12. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. When we do, we&apos;ll revise
                the effective date above. Continued use of the Service after a change means you
                accept the updated policy.
              </p>
            </Section>

            <Section id="contact" title="13. Contact">
              <p>
                Questions, concerns, or requests related to this Privacy Policy or our data
                practices can be sent through the{" "}
                <a href="/contact" className="font-medium text-blue-900 hover:underline">
                  Contact page
                </a>
                . Since the Service doesn&apos;t use accounts, there&apos;s no personal profile
                to look up — an email address is only needed if you&apos;d like a reply. The{" "}
                <a href="/faq" className="font-medium text-blue-900 hover:underline">
                  FAQ page
                </a>{" "}
                also answers most common questions about how the Service works.
              </p>
            </Section>
          </div>

          <nav className="lg:sticky lg:top-24 lg:col-span-2">
            <div className="rounded-xl border-l-4 border-amber-400 bg-white p-5 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-500">
                On This Page
              </p>
              <ul className="mt-3 space-y-1.5">
                {TOC.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="block rounded px-2 py-1.5 text-sm text-zinc-600 hover:bg-amber-50 hover:text-blue-900"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-extrabold text-blue-950">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
