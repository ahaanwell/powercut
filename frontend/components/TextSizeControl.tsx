"use client";

const SIZES = ["87.5%", "100%", "112.5%"];
const STORAGE_KEY = "pct-text-size";

function applySize(index: number) {
  try {
    document.documentElement.style.fontSize = SIZES[index];
    localStorage.setItem(STORAGE_KEY, String(index));
  } catch {
    // localStorage may be unavailable (private mode); sizing still applies for this view.
  }
}

export default function TextSizeControl() {
  return (
    <span className="hidden items-center gap-0.5 sm:flex">
      <span className="mr-1 text-blue-200">Text Size:</span>
      <button
        type="button"
        onClick={() => applySize(0)}
        aria-label="Decrease text size"
        className="px-1 text-xs hover:text-white hover:underline"
      >
        A-
      </button>
      <button
        type="button"
        onClick={() => applySize(1)}
        aria-label="Reset text size"
        className="px-1 text-sm hover:text-white hover:underline"
      >
        A
      </button>
      <button
        type="button"
        onClick={() => applySize(2)}
        aria-label="Increase text size"
        className="px-1 text-base hover:text-white hover:underline"
      >
        A+
      </button>
    </span>
  );
}
