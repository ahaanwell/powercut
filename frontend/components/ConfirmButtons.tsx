"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { confirmReport } from "@/lib/api";

export default function ConfirmButtons({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"still_down" | "restored" | null>(null);

  async function handleClick(type: "still_down" | "restored") {
    setBusy(type);
    try {
      await confirmReport(reportId, type);
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex gap-2 text-sm">
      <button
        onClick={() => handleClick("still_down")}
        disabled={busy !== null}
        className="rounded-full border border-zinc-300 px-3 py-1 font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
      >
        {busy === "still_down" ? "…" : "Still out"}
      </button>
      <button
        onClick={() => handleClick("restored")}
        disabled={busy !== null}
        className="rounded-full border border-emerald-300 px-3 py-1 font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
      >
        {busy === "restored" ? "…" : "Power's back"}
      </button>
    </div>
  );
}
