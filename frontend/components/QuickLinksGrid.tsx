import Link from "next/link";
import {
  BoltIcon,
  SearchIcon,
  CalendarIcon,
  ChartBarIcon,
  MapPinIcon,
  MessageIcon,
} from "./icons";

const LINKS = [
  { href: "/report", label: "Report Outage", icon: BoltIcon },
  { href: "/track", label: "Track Complaint", icon: SearchIcon },
  { href: "/maintenance", label: "Planned Outages", icon: CalendarIcon },
  { href: "/stats", label: "Outage Statistics", icon: ChartBarIcon },
  { href: "/states", label: "Browse by State", icon: MapPinIcon },
  { href: "/faq", label: "Grievance / FAQ", icon: MessageIcon },
];

export default function QuickLinksGrid() {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-500">Quick Links</p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex flex-col items-center gap-2 rounded border border-zinc-200 bg-white p-4 text-center shadow-sm hover:border-blue-900 hover:shadow-md"
          >
            <l.icon className="h-6 w-6 text-blue-900" />
            <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-700">
              {l.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
