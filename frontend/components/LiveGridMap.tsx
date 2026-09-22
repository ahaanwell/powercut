"use client";

import dynamic from "next/dynamic";
import type { GridPoint } from "@/lib/types";

const LiveGridMapInner = dynamic(() => import("./LiveGridMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center bg-black text-sm text-zinc-400">
      Loading live grid status…
    </div>
  ),
});

export default function LiveGridMap({ points }: { points: GridPoint[] }) {
  return <LiveGridMapInner points={points} />;
}
