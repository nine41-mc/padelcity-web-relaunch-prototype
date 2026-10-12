"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { locationsContent } from "@/lib/content/locations";
import { distanceKm, formatKm, type LatLng } from "./geo";

/** Shows "· 2,3 km entfernt" only if the visitor already granted geolocation (never prompts on page load). */
export function ClubDistance({ position, locale = "de" }: { position: LatLng; locale?: Locale }) {
  const [km, setKm] = useState<number | null>(null);
  useEffect(() => {
    let cancelled = false;
    navigator.permissions
      ?.query({ name: "geolocation" as PermissionName })
      .then((p) => {
        if (p.state !== "granted" || cancelled) return;
        navigator.geolocation.getCurrentPosition((pos) => {
          if (!cancelled) setKm(distanceKm({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }, position));
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [position]);
  if (km === null) return null;
  return (
    <>
      <span aria-hidden>·</span>
      <span>
        {formatKm(km, localeTags[locale].intl)} {locationsContent[locale].club.distance}
      </span>
    </>
  );
}
