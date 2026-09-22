"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { isValidPincode } from "@/lib/pincode";
import { submitReport } from "@/lib/api";

export default function ReportForm({
  defaultPincode = "",
  initialStatus = "reported",
}: {
  defaultPincode?: string;
  initialStatus?: "reported" | "restored";
}) {
  const router = useRouter();
  const [pincode, setPincode] = useState(defaultPincode);
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const isRestored = initialStatus === "restored";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidPincode(pincode)) {
      setError("Enter a valid 6-digit PIN code");
      return;
    }
    setError("");
    setSubmitState("submitting");
    try {
      const report = await submitReport({
        pincode: pincode.trim(),
        area,
        description,
        status: initialStatus,
      });
      setReferenceId(report.referenceId ?? null);
      setSubmitState("success");
      setTimeout(() => router.push(`/pincode/${pincode.trim()}`), 2200);
    } catch (err) {
      setSubmitState("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (submitState === "success") {
    return (
      <div className="rounded-lg bg-emerald-50 p-4 text-emerald-800 ring-1 ring-emerald-600/20">
        <p>
          {isRestored
            ? "Thanks! Marked as restored. Redirecting to your area's status page…"
            : "Thanks for reporting! Redirecting to your area's status page…"}
        </p>
        {referenceId && (
          <div className="mt-3 rounded-lg border border-dashed border-emerald-400 bg-white px-4 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">
              Complaint Reference Number
            </p>
            <p className="font-mono text-lg font-bold text-blue-950">{referenceId}</p>
            <p className="text-xs text-zinc-500">Save this to track status later.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isRestored && (
        <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-600/20">
          You&apos;re reporting that power is back in your area.
        </div>
      )}
      <div>
        <label htmlFor="pincode" className="block text-sm font-medium text-zinc-700">
          PIN code *
        </label>
        <input
          id="pincode"
          type="text"
          inputMode="numeric"
          maxLength={6}
          required
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ""))}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          placeholder="e.g. 110001"
        />
      </div>
      <div>
        <label htmlFor="area" className="block text-sm font-medium text-zinc-700">
          Area / locality (optional)
        </label>
        <input
          id="area"
          type="text"
          maxLength={120}
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          placeholder="e.g. Connaught Place"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-700">
          Details (optional)
        </label>
        <textarea
          id="description"
          maxLength={500}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          placeholder="Anything nearby users should know?"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitState === "submitting"}
        className={`w-full rounded-lg px-5 py-3 font-semibold text-white disabled:opacity-60 ${
          isRestored ? "bg-emerald-500 hover:bg-emerald-600" : "bg-amber-500 hover:bg-amber-600"
        }`}
      >
        {submitState === "submitting"
          ? "Submitting…"
          : isRestored
            ? "Confirm power is back"
            : "Submit report"}
      </button>
      <p className="text-xs text-zinc-500">
        Reports are anonymous and community-submitted. Please only report real outages.
      </p>
    </form>
  );
}
