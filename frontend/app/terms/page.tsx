import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ShieldIcon, CheckCircleIcon, AlertCircleIcon, ClockIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms governing your use of PowerCut's outage reporting, maps, and tracking tools.",
  alternates: { canonical: "/terms" },
};

const EFFECTIVE_DATE = "22 September 2026";

const TRUST_BADGES = [
  { icon: ShieldIcon, label: "Plain-Language Terms" },
  { icon: CheckCircleIcon, label: "Free to Use" },
  { icon: AlertCircleIcon, label: "Not an Emergency Service" },
  { icon: ClockIcon, label: `Effective ${EFFECTIVE_DATE}` },
];

const TOC = [
  { id: "about-the-service", label: "1. About the Service" },
  { id: "eligibility", label: "2. Eligibility" },
  { id: "user-content", label: "3. User Reports & Content" },
  { id: "no-emergency", label: "4. No Emergency Service" },
  { id: "accuracy", label: "5. Accuracy of Information" },
  { id: "location", label: "6. Location Data" },
  { id: "acceptable-use", label: "7. Acceptable Use" },
  { id: "ip", label: "8. Intellectual Property" },
  { id: "third-party", label: "9. Third-Party Services" },
  { id: "access", label: "10. Blocking & Rate Limiting" },
  { id: "warranties", label: "11. Disclaimer of Warranties" },
  { id: "liability", label: "12. Limitation of Liability" },
  { id: "privacy", label: "13. Privacy" },
  { id: "changes", label: "14. Changes to These Terms" },
  { id: "governing-law", label: "15. Governing Law" },
];

export default function TermsPage() {
  return (
    <div className="bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-900">
            <ShieldIcon className="h-3.5 w-3.5" />
            Legal
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-blue-950 sm:text-4xl">Terms of Use</h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Effective Date: {EFFECTIVE_DATE}. By accessing or using PowerCut, you agree
            to these Terms. If you do not agree, please do not use the Service.
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
              PowerCut is an independent, community-driven project and is not affiliated
              with, endorsed by, or connected to any government agency, DISCOM, or electricity
              provider. These Terms of Use govern your access to and use of PowerCut,
              including its website, outage maps, reporting tools, and related services (the
              &ldquo;Service&rdquo;).
            </p>

            <Section id="about-the-service" title="1. About the Service">
              <p>
                PowerCut is a crowd-sourced platform that helps users check power outage
                status, report outages, and view outage activity across India. The Service uses
                user reports and system-generated summaries to display outage information. We do
                not guarantee that any information shown is complete, current, accurate, or
                error-free.
              </p>
            </Section>

            <Section id="eligibility" title="2. Eligibility">
              <p>
                You must be at least 18 years of age to use this Service. By using the Service,
                you represent that you meet this requirement, that you are using the Service for
                lawful purposes, and that you will comply with these Terms.
              </p>
            </Section>

            <Section id="user-content" title="3. User Reports & Content">
              <p>If you submit a report, confirmation, comment, or other content, you agree that:</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li>The information is accurate to the best of your knowledge.</li>
                <li>
                  You will not submit false, abusive, misleading, harmful, or fraudulent content.
                </li>
                <li>
                  You grant PowerCut the right to store, display, process, and use the
                  content to operate, improve, and maintain the Service.
                </li>
              </ul>
              <p className="mt-3 rounded-lg bg-amber-50 p-3 text-amber-900 ring-1 ring-amber-600/20">
                <strong className="font-semibold">Intermediary notice:</strong> PowerCut
                operates as an intermediary hosting user-submitted content and is not responsible
                for the accuracy, completeness, or reliability of any outage report. Users are
                solely responsible for the content they submit.
              </p>
            </Section>

            <Section id="no-emergency" title="4. No Emergency Service">
              <p>
                PowerCut is not an emergency service and should not be used as a
                substitute for contacting your electricity provider, local authority, or
                emergency services. If you are in danger or require urgent assistance, contact
                the appropriate authorities immediately.
              </p>
            </Section>

            <Section id="accuracy" title="5. Accuracy of Information">
              <p>
                We aim to provide useful outage information, but the Service may contain delays,
                errors, missing reports, incorrect map placement, or outdated entries. Outage
                status, map markers, and report counts may change without notice. Use the Service
                only as an informational tool, not a guaranteed or verified data source.
              </p>
            </Section>

            <Section id="location" title="6. Location Data">
              <p>
                PowerCut does not request or use your device&apos;s GPS location, and
                there is no background or continuous location tracking of any kind. Map positions
                are derived entirely from the PIN code you search or report, geocoded
                server-side — see our{" "}
                <Link href="/privacy" className="font-medium text-blue-900 hover:underline">
                  Privacy Policy
                </Link>{" "}
                for details.
              </p>
            </Section>

            <Section id="acceptable-use" title="7. Acceptable Use">
              <p>You agree not to:</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li>Use the Service in any unlawful manner.</li>
                <li>Interfere with, disrupt, or attempt to overload the Service.</li>
                <li>Attempt to access data or systems without authorization.</li>
                <li>Scrape, copy, or misuse the Service at scale without permission.</li>
                <li>Submit harmful, abusive, fraudulent, or infringing content.</li>
              </ul>
            </Section>

            <Section id="ip" title="8. Intellectual Property">
              <p>
                The PowerCut name, logo, design, and original content are owned by
                PowerCut or its licensors and are protected by applicable intellectual
                property laws. You may not reuse or reproduce them without permission, except as
                allowed by law. Aggregate, anonymized outage data derived from user reports may be
                displayed and reused as part of the Service&apos;s statistics features.
              </p>
            </Section>

            <Section id="third-party" title="9. Third-Party Services">
              <p>
                The Service relies on third-party infrastructure — including database hosting,
                postal PIN code lookups, and map/geocoding providers — described in our{" "}
                <Link href="/privacy" className="font-medium text-blue-900 hover:underline">
                  Privacy Policy
                </Link>
                . We are not responsible for third-party outages, data errors, or service
                interruptions caused by these external providers.
              </p>
            </Section>

            <Section id="access" title="10. Blocking & Rate Limiting">
              <p>
                Since the Service does not use accounts, there is nothing to &ldquo;suspend&rdquo;
                in the traditional sense. Instead, we may rate-limit or block requests from a
                device if we believe it is being used to spam, abuse, or misuse the reporting and
                comment features, or to create risk for other users or the platform.
              </p>
            </Section>

            <Section id="warranties" title="11. Disclaimer of Warranties">
              <p>
                The Service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo;
                basis. We make no warranties of any kind, express or implied, including
                warranties of accuracy, availability, fitness for a particular purpose, or
                non-infringement.
              </p>
            </Section>

            <Section id="liability" title="12. Limitation of Liability">
              <p>
                To the maximum extent permitted by law, PowerCut and its operators will
                not be liable for indirect, incidental, special, consequential, or punitive
                damages, or for losses arising from reliance on outage data, map data, or
                user-submitted information.
              </p>
            </Section>

            <Section id="privacy" title="13. Privacy">
              <p>
                Your use of the Service is also subject to our{" "}
                <Link href="/privacy" className="font-medium text-blue-900 hover:underline">
                  Privacy Policy
                </Link>
                , which explains what information we collect, how we use it, and the choices
                available to you.
              </p>
            </Section>

            <Section id="changes" title="14. Changes to These Terms">
              <p>
                We may update these Terms from time to time. When we do, we will update the
                effective date above. Continued use of the Service after changes means you accept
                the revised Terms.
              </p>
            </Section>

            <Section id="governing-law" title="15. Governing Law">
              <p>
                These Terms are governed by the laws of India, without regard to conflict-of-law
                principles. Any disputes arising from these Terms or the Service will be resolved
                in accordance with applicable Indian law.
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
