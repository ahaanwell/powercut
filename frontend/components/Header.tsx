import Link from "next/link";
import AccessibilityBar from "./AccessibilityBar";
import { BoltIcon } from "./icons";

const NAV_LINKS = [
  { href: "/stats", label: "Statistics" },
  { href: "/states", label: "States" },
  { href: "/maintenance", label: "Notices" },
  { href: "/track", label: "Track Complaint" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/faq", label: "Grievance / FAQ" },
];

export default function Header() {
  return (
    <div className="sticky top-0 z-50">
      <AccessibilityBar />
      <header className="border-b-4 border-amber-500 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-950 text-amber-400 ring-2 ring-amber-400">
              <BoltIcon className="h-3.5 w-3.5" />
            </span>
            <span className="text-lg font-extrabold leading-tight text-blue-950">PowerCut</span>
          </Link>
          <nav className="hidden items-center gap-5 text-xs font-bold uppercase tracking-wide text-blue-950 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b-2 border-transparent pb-0.5 hover:border-amber-500"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/report"
            className="shrink-0 rounded bg-blue-950 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-blue-900"
          >
            Report Outage
          </Link>
        </div>
      </header>
    </div>
  );
}
