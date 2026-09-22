import Link from "next/link";

const COLUMNS = [
  {
    title: "Citizen Services",
    links: [
      { href: "/report", label: "Report an outage" },
      { href: "/track", label: "Track complaint" },
      { href: "/maintenance", label: "Planned outage notices" },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/stats", label: "Outage statistics" },
      { href: "/states", label: "State directory" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/coverage", label: "Coverage" },
      { href: "/faq", label: "Grievance / FAQ" },
      { href: "/contact", label: "Contact us" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of use" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t-4 border-amber-500 bg-blue-950 text-blue-100">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-6">
        <div className="col-span-2 md:col-span-2">
          <p className="font-bold text-white">PowerCut</p>
          <p className="mt-2 text-sm text-blue-200">
            A community-powered, crowd-sourced electricity outage reporting and monitoring portal
            for India, organized by PIN code.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-[11px] font-bold uppercase tracking-wide text-amber-400">
              {col.title}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-blue-200">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-blue-900 px-4 py-4 text-center text-xs text-blue-300 sm:px-6">
        PowerCut is an independent, community-driven service. It is not affiliated with,
        endorsed by, or operated by any government agency, DISCOM, or electricity provider.
        Reports may be incomplete, delayed, or inaccurate. &copy; {new Date().getFullYear()}{" "}
        PowerCut. Last updated {new Date().toLocaleDateString("en-IN")}.
      </div>
    </footer>
  );
}
