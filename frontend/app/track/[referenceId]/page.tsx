import type { Metadata } from "next";
import Link from "next/link";
import { trackReport } from "@/lib/api";
import TrackSearchForm from "@/components/TrackSearchForm";
import { AlertCircleIcon, CheckCircleIcon, SearchIcon } from "@/components/icons";

type Props = { params: Promise<{ referenceId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { referenceId } = await params;
  return {
    title: `Complaint Status — ${referenceId}`,
    robots: { index: false, follow: true },
  };
}

const STATUS_LABEL: Record<string, string> = {
  reported: "Reported — Awaiting Confirmation",
  ongoing: "Outage Ongoing",
  restored: "Power Restored",
};

const STATUS_STYLE: Record<string, string> = {
  reported: "bg-amber-50 text-amber-800 ring-amber-600/20",
  ongoing: "bg-red-50 text-red-700 ring-red-600/20",
  restored: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

export default async function TrackResultPage({ params }: Props) {
  const { referenceId } = await params;
  const report = await trackReport(referenceId).catch(() => null);

  if (!report) {
    return (
      <div className="bg-zinc-50 py-14">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircleIcon className="mx-auto h-8 w-8 text-red-600" />
            <p className="mt-2 font-bold text-red-800">No record found</p>
            <p className="mt-1 text-sm text-red-700">
              We couldn&apos;t find a complaint with reference number{" "}
              <span className="font-mono">{referenceId}</span>. Please check the number and try
              again.
            </p>
          </div>
          <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 bg-blue-950 px-5 py-3">
              <SearchIcon className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wide text-white">
                Try Another Reference Number
              </span>
            </div>
            <div className="p-5">
              <TrackSearchForm defaultValue={referenceId} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 py-14">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <nav className="mb-4 text-sm text-zinc-500">
          <Link href="/track" className="hover:underline">
            Track Your Complaint
          </Link>{" "}
          / <span className="font-mono">{report.referenceId}</span>
        </nav>

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-blue-950 px-6 py-4 text-white">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-blue-200">
                Complaint Status Report
              </p>
              <p className="font-mono text-lg font-bold">{report.referenceId}</p>
            </div>
            <CheckCircleIcon className="h-6 w-6 text-amber-400" />
          </div>

          <div className="p-6">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ring-1 ring-inset ${
                STATUS_STYLE[report.status]
              }`}
            >
              {STATUS_LABEL[report.status]}
            </span>

            <dl className="mt-6 divide-y divide-zinc-100 border-t border-zinc-100">
              <Row label="PIN Code" value={report.pincode} />
              <Row label="State" value={report.state} />
              {report.area && <Row label="Area" value={report.area} />}
              {report.description && <Row label="Details" value={report.description} />}
              <Row label="Submitted On" value={new Date(report.createdAt).toLocaleString("en-IN")} />
              {report.restoredAt && (
                <Row
                  label="Restored On"
                  value={new Date(report.restoredAt).toLocaleString("en-IN")}
                />
              )}
              <Row
                label="Community Confirmations"
                value={`${report.confirmCount} still-down · ${report.restoredCount} restored`}
              />
            </dl>

            <Link
              href={`/pincode/${report.pincode}`}
              className="mt-6 block rounded bg-blue-950 px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-blue-900"
            >
              View Full Area Status
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-sm">
          <span className="text-zinc-600">Have another reference number to check?</span>
          <Link href="/track" className="font-bold text-blue-900 hover:underline">
            Track another complaint &rarr;
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-500">
          <Link href="/report" className="font-medium text-blue-900 hover:underline">
            Report a new outage
          </Link>
          <Link href="/faq" className="font-medium text-blue-900 hover:underline">
            Read the FAQ
          </Link>
          <Link href="/how-it-works" className="font-medium text-blue-900 hover:underline">
            How it works
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 text-sm">
      <dt className="font-medium text-zinc-500">{label}</dt>
      <dd className="text-right font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}
