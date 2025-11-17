"use client";

import dynamic from "next/dynamic";

// Load Map component only on client (Leaflet needs window)
const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full flex items-center justify-center text-sm text-neutral-500">
      در حال بارگذاری نقشه...
    </div>
  ),
});

export default function MapClient() {
  return (
    <div className="relative w-full h-96">
      <Map />
    </div>
  );
}
