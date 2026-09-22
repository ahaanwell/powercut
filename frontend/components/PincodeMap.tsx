"use client";

import dynamic from "next/dynamic";
import type { PincodeMapProps } from "./PincodeMapInner";
import { MapPinIcon } from "./icons";

const PincodeMapInner = dynamic(() => import("./PincodeMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 text-sm text-zinc-500">
      Loading map…
    </div>
  ),
});

type Props = Omit<PincodeMapProps, "lat" | "lng"> & { lat: number | null; lng: number | null };

export default function PincodeMap(props: Props) {
  if (props.lat === null || props.lng === null) {
    return (
      <div className="flex h-80 flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-100 text-sm text-zinc-500">
        <MapPinIcon className="h-6 w-6" />
        Map location unavailable for this pincode.
      </div>
    );
  }

  return <PincodeMapInner {...props} lat={props.lat} lng={props.lng} />;
}
