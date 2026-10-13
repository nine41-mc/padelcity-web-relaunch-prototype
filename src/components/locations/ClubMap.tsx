"use client";

import "leaflet/dist/leaflet.css";
import "./map.css";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { Locale } from "@/lib/i18n/config";
import { asset } from "@/lib/asset";
import { formatPrice } from "@/lib/format";
import { href } from "@/lib/i18n/routes";
import { locationsContent } from "@/lib/content/locations";
import type { LatLng } from "./geo";

export type MapClub = {
  id: string;
  slug: string;
  name: string;
  city: string;
  position: LatLng;
  priceFrom?: number;
  currency?: "EUR" | "PLN";
  /** Planned club: outline pin, popup without link (no detail page). */
  planned?: boolean;
};

const pin = (active: boolean, planned = false) =>
  L.divIcon({
    className: `pc-pin${active ? " pc-pin--active" : ""}${planned ? " pc-pin--planned" : ""}`,
    html: '<div class="pc-pin__body"></div>',
    iconSize: [34, 34],
    iconAnchor: [17, 40],
    popupAnchor: [0, -40],
  });

/**
 * Tiles: CARTO dark_all now answers "API KEY REQUIRED" without a key (checked 2026-10-12).
 * → Set NEXT_PUBLIC_MAP_TILE_URL (+ NEXT_PUBLIC_MAP_ATTRIBUTION) to a keyed dark style (CARTO / Stadia / MapTiler).
 * Fallback: OSM standard tiles, darkened + tinted via CSS filter (.pc-map--filtered in map.css).
 */
const TILE_URL = process.env.NEXT_PUBLIC_MAP_TILE_URL;
const TILE_ATTRIBUTION =
  process.env.NEXT_PUBLIC_MAP_ATTRIBUTION ??
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
const OSM_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

const userIcon = L.divIcon({ className: "pc-user", iconSize: [18, 18], iconAnchor: [9, 9] });

function FitBounds({ clubs, user }: { clubs: MapClub[]; user?: LatLng | null }) {
  const map = useMap();
  const key = clubs.map((c) => c.id).join("|") + (user ? `${user.latitude},${user.longitude}` : "");
  useEffect(() => {
    const pts: [number, number][] = clubs.map((c) => [c.position.latitude, c.position.longitude]);
    if (user) pts.push([user.latitude, user.longitude]);
    if (pts.length === 1) map.setView(pts[0], 14);
    else if (pts.length > 1) map.fitBounds(L.latLngBounds(pts), { padding: [40, 40], maxZoom: 12 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, map]);
  return null;
}

/** Dark map with branded gradient pins. Client-only (loaded via next/dynamic ssr:false). */
export default function ClubMap({
  clubs,
  locale = "de",
  activeId,
  onSelect,
  user,
  showPopups = true,
  scrollWheelZoom = false,
  className,
}: {
  clubs: MapClub[];
  locale?: Locale;
  activeId?: string | null;
  onSelect?: (id: string) => void;
  user?: LatLng | null;
  showPopups?: boolean;
  scrollWheelZoom?: boolean;
  className?: string;
}) {
  const t = locationsContent[locale].map;
  const osmAttribution = `&copy; <a href="https://www.openstreetmap.org/copyright">${t.osm}</a>`;
  const icons = useMemo(
    () => ({ on: pin(true), off: pin(false), plannedOn: pin(true, true), plannedOff: pin(false, true) }),
    [],
  );
  const center: [number, number] = clubs[0] ? [clubs[0].position.latitude, clubs[0].position.longitude] : [51.1657, 10.4515];
  return (
    <MapContainer center={center} zoom={6} scrollWheelZoom={scrollWheelZoom} className={`pc-map h-full w-full ${TILE_URL ? "" : "pc-map--filtered"} ${className ?? ""}`}>
      {TILE_URL ? (
        <TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL} subdomains="abcd" maxZoom={19} />
      ) : (
        <TileLayer attribution={osmAttribution} url={OSM_URL} maxZoom={19} />
      )}
      <FitBounds clubs={clubs} user={user} />
      {user && <Marker position={[user.latitude, user.longitude]} icon={userIcon} title={t.you} />}
      {clubs.map((c) => (
        <Marker
          key={c.id}
          position={[c.position.latitude, c.position.longitude]}
          icon={c.planned ? (c.id === activeId ? icons.plannedOn : icons.plannedOff) : c.id === activeId ? icons.on : icons.off}
          title={c.planned ? `${c.name} – ${t.soon}` : c.name}
          zIndexOffset={c.id === activeId ? 1000 : c.planned ? -100 : 0}
          eventHandlers={onSelect ? { click: () => onSelect(c.id) } : undefined}
        >
          {showPopups && c.planned && (
            <Popup>
              <p className="font-semibold">{c.name}</p>
              <p className="text-white/70">
                {c.city} · <span className="text-neon-500">{t.soon}</span>
              </p>
            </Popup>
          )}
          {showPopups && !c.planned && (
            <Popup>
              <p className="font-semibold">{c.name}</p>
              <p className="text-white/70">
                {c.city}
                {c.priceFrom ? ` · ${t.from} ${formatPrice(c.priceFrom, locale, c.currency)}` : ""}
              </p>
              {/* Raw <a> inside Leaflet popup (outside Next router) → needs basePath via asset() */}
              <a href={asset(href(locale, "locations", c.slug)) + "/"} className="mt-2 inline-block font-medium !text-neon-500 underline-offset-2 hover:underline">
                {t.view}
              </a>
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
}
