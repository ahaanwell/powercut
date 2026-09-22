"use client";

import { useRef, useState } from "react";
import { getPincodeStatus } from "@/lib/api";
import { BellIcon } from "./icons";

const POLL_INTERVAL_MS = 30_000;

export default function NotifyMeButton({ pincode }: { pincode: string }) {
  const [watching, setWatching] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function handleClick() {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    if (Notification.permission === "denied") {
      setWatching(false);
      return;
    }

    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;
    }

    if (watching) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setWatching(false);
      return;
    }

    setWatching(true);
    intervalRef.current = setInterval(async () => {
      try {
        const status = await getPincodeStatus(pincode);
        if (status.currentStatus === "restored") {
          new Notification("Power restored", {
            body: `Power is back in pincode ${pincode}.`,
          });
          if (intervalRef.current) clearInterval(intervalRef.current);
          setWatching(false);
        }
      } catch {
        // Ignore transient polling failures; the interval will retry.
      }
    }, POLL_INTERVAL_MS);
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-zinc-500">
        <BellIcon className="h-3.5 w-3.5" />
        Restoration alert
      </p>
      <button
        type="button"
        onClick={handleClick}
        className={`mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-bold ${
          watching ? "bg-zinc-100 text-zinc-700" : "bg-amber-400 text-black hover:bg-amber-300"
        }`}
      >
        <BellIcon className="h-4 w-4" />
        {watching ? "Watching this pincode…" : "Notify Me When Power is Restored"}
      </button>
      <p className="mt-2 text-xs text-zinc-500">
        We&apos;ll check every 30 seconds and show a browser notification the moment this pincode
        is marked restored. Keep this tab open in the background &mdash; closing it stops the
        check.
      </p>
    </div>
  );
}
