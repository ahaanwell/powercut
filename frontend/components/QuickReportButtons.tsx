"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { submitReport } from "@/lib/api";
import { BoltIcon, CheckCircleIcon, WhatsAppIcon } from "./icons";

export default function QuickReportButtons({ pincode }: { pincode: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"reported" | "restored" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<"reported" | "restored" | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  async function handleClick(status: "reported" | "restored") {
    setBusy(status);
    setError(null);
    try {
      const report = await submitReport({ pincode, status });
      setLastAction(status);
      setReferenceId(report.referenceId ?? null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  if (lastAction) {
    const shareUrl = typeof window !== "undefined" ? window.location.href : `/pincode/${pincode}`;
    const shareText =
      lastAction === "restored"
        ? `Power is back in ${pincode}. Live status: ${shareUrl}`
        : `Power cut reported in ${pincode}. Live status: ${shareUrl}`;

    return (
      <div className="rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-600/20">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
            <CheckCircleIcon className="h-4 w-4" />
          </span>
          <div>
            <p className="font-bold text-emerald-900">
              {lastAction === "restored" ? "Power Restoration Logged!" : "Outage Logged Successfully!"}
            </p>
            <p className="text-sm text-emerald-700">Your report for Pincode {pincode} has been recorded.</p>
          </div>
        </div>

        {referenceId && (
          <div className="mt-3 rounded-lg border border-dashed border-emerald-400 bg-white px-4 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">
              Complaint Reference Number
            </p>
            <p className="font-mono text-lg font-bold text-blue-950">{referenceId}</p>
            <p className="text-xs text-zinc-500">
              Save this to track status later at{" "}
              <Link href="/track" className="font-medium text-blue-900 hover:underline">
                /track
              </Link>
            </p>
          </div>
        )}

        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3 font-bold text-white hover:bg-emerald-600"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Share to WhatsApp / Alert Neighbors
        </a>

        {lastAction === "reported" && (
          <button
            type="button"
            onClick={() => handleClick("restored")}
            disabled={busy !== null}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-white py-3 font-bold text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
          >
            <CheckCircleIcon className="h-5 w-5" />
            {busy === "restored" ? "Updating…" : "Power is Back? Update Status"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => handleClick("reported")}
          disabled={busy !== null}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-60"
        >
          <BoltIcon className="h-5 w-5" />
          {busy === "reported" ? "Reporting…" : "Report Power Cut"}
        </button>
        <button
          type="button"
          onClick={() => handleClick("restored")}
          disabled={busy !== null}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3 font-bold text-white hover:bg-emerald-600 disabled:opacity-60"
        >
          <CheckCircleIcon className="h-5 w-5" />
          {busy === "restored" ? "Submitting…" : "Power is Back!"}
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
