import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import {
  MessageIcon,
  ShieldIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  BoltIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Send feedback, report a bug, or get in touch with the PowerCut team — free, no account required.",
  alternates: { canonical: "/contact" },
};

const TRUST_BADGES = [
  { icon: CheckCircleIcon, label: "Free, Always" },
  { icon: ShieldIcon, label: "Email Optional" },
  { icon: ClockIcon, label: "Under a Minute" },
  { icon: MessageIcon, label: "Read by a Real Person" },
];

export default function ContactPage() {
  return (
    <div className="bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-900">
            <MessageIcon className="h-3.5 w-3.5" />
            Get in Touch
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-blue-950 sm:text-4xl">Contact Us</h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Found a bug, have feedback, or a general question about PowerCut? Send us a
            message below.
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
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 bg-blue-950 px-5 py-3">
                <MessageIcon className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wide text-white">
                  Send a Message
                </span>
              </div>
              <div className="p-5 sm:p-6">
                <ContactForm />
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <section className="rounded-xl border-l-4 border-red-500 bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
                <BoltIcon className="h-4 w-4 text-red-500" />
                Reporting a Power Cut?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                This form is for feedback about the website itself, not for reporting an
                electricity outage. If your power is out,{" "}
                <Link href="/report" className="font-medium text-blue-900 hover:underline">
                  report it here
                </Link>{" "}
                instead — it takes under a minute and helps your neighbors right away.
              </p>
            </section>

            <section className="rounded-xl border-l-4 border-amber-400 bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
                <AlertCircleIcon className="h-4 w-4 text-amber-500" />
                What Happens After You Send It
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Your message is recorded and reviewed — there&apos;s no automated ticket number
                or live status page for feedback like there is for outage reports. If you leave
                an email address, we may follow up; if not, your message is still read, just
                without a way to reply.
              </p>
            </section>

            <section className="rounded-xl border-l-4 border-emerald-500 bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
                <ShieldIcon className="h-4 w-4 text-emerald-600" />
                Common Questions First?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Many common questions — about reporting, tracking, privacy, and coverage — are
                already answered on the{" "}
                <Link href="/faq" className="font-medium text-blue-900 hover:underline">
                  FAQ page
                </Link>
                . Worth a quick check before you write in.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
