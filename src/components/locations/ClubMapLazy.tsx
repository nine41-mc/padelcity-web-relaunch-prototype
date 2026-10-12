"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type ClubMap from "./ClubMap";

/**
 * Leaflet touches `window` on import → load the map client-side only.
 * `ssr: false` is only allowed inside a client component – this wrapper keeps static export safe.
 */
const ClubMapClient = dynamic(() => import("./ClubMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-ink-700" aria-hidden />,
});

export function ClubMapLazy(props: ComponentProps<typeof ClubMap>) {
  return <ClubMapClient {...props} />;
}
