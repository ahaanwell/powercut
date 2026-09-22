"use client";

import { useEffect, useState } from "react";

export default function LiveClock({ className = "text-xs font-semibold text-zinc-500" }: { className?: string }) {
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    function update() {
      setNow(
        new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    }
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;
  return <span className={className}>{now} IST</span>;
}
