"use client";

import { useEffect } from "react";

const SIZES = ["87.5%", "100%", "112.5%"];
const STORAGE_KEY = "pct-text-size";

export default function RestoreTextSize() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const index = Number(saved);
        if (SIZES[index]) {
          document.documentElement.style.fontSize = SIZES[index];
        }
      }
    } catch {
      // Ignore — default text size applies.
    }
  }, []);

  return null;
}
