"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Next.js's own loading.tsx / Suspense fallback only shows when the
// destination page's data genuinely isn't ready yet — if a link was
// prefetched while visible on screen, navigation completes instantly and no
// loading UI ever appears. That's correct for fast transitions, but it means
// a slow transition can *sometimes* show a spinner and sometimes not,
// depending on prefetch timing, which reads as inconsistent. This listens
// for any internal link click directly and shows feedback whenever a
// navigation takes longer than a brief grace period, regardless of why.
const SHOW_DELAY_MS = 150;

function ProgressOverlay() {
  const [visible, setVisible] = useState(false);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname + url.search === window.location.pathname + window.location.search) return;

      if (showTimer.current) clearTimeout(showTimer.current);
      showTimer.current = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    }

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      if (showTimer.current) clearTimeout(showTimer.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-white/70 backdrop-blur-[1px]"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-amber-500" />
        <p className="text-sm font-semibold text-zinc-600">Loading…</p>
      </div>
    </div>
  );
}

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Remounting on every navigation resets `visible` back to false for free —
  // no effect needed to watch for URL changes and clear state manually.
  return <ProgressOverlay key={`${pathname}?${searchParams.toString()}`} />;
}
