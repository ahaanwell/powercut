"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { confirmReport } from "@/lib/api";
import type { ReportStatus } from "@/lib/types";
import { ThumbUpIcon } from "./icons";

export default function ThumbConfirmButton({
  reportId,
  status,
  count,
}: {
  reportId: string;
  status: ReportStatus;
  count: number;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    try {
      await confirmReport(reportId, status === "restored" ? "restored" : "still_down");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-label="Confirm this report"
      className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-200 disabled:opacity-50"
    >
      <ThumbUpIcon className="h-4 w-4" />
      {count}
    </button>
  );
}
