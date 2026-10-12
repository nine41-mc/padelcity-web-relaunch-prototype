"use client";

// Contentful module: clubMap (live + planned clubs, derived from club entries)
import Link from "next/link";
import { useRef, useState } from "react";
import type { Club } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";

// Coarse outline of Germany (lon, lat). Decorative only – not for navigation.
const OUTLINE: [number, number][] = [
  [8.4, 54.9], [9.4, 54.8], [10.0, 54.6], [11.0, 54.4], [10.9, 54.0], [11.5, 54.1], [12.3, 54.4], [13.2, 54.6], [13.8, 54.2],
  [14.2, 53.9], [14.4, 53.3], [14.1, 52.8], [14.6, 52.6], [14.7, 51.9], [15.0, 51.2], [14.3, 50.9], [13.5, 50.6], [12.4, 50.3],
  [12.1, 50.0], [12.5, 49.6], [13.0, 49.3], [13.8, 48.8], [13.4, 48.3], [12.9, 47.9], [13.0, 47.5], [12.3, 47.7], [11.3, 47.4],
  [10.5, 47.5], [9.8, 47.6], [9.0, 47.7], [8.6, 47.6], [7.6, 47.6], [7.6, 48.1], [8.2, 49.0], [7.0, 49.2], [6.4, 49.5],
  [6.1, 50.1], [6.3, 50.5], [6.0, 50.8], [6.1, 51.2], [5.9, 51.8], [6.8, 51.9], [7.0, 52.3], [7.0, 52.6], [7.2, 53.2],
  [7.0, 53.6], [8.0, 53.7], [8.6, 53.9], [8.9, 54.2], [8.6, 54.5],
];

// Map frame: Germany plus room for Innsbruck (AT) and Warsaw/Kraków/Kielce (PL).
const LON0 = 5.5;
const LON1 = 21.6;
const LAT0 = 46.9;
const LAT1 = 55.3;
const K = 40;
const COS = 0.63; // ≈ cos(51°)
const W = (LON1 - LON0) * COS * K;
const H = (LAT1 - LAT0) * K;
const project = (lon: number, lat: number) => [(lon - LON0) * COS * K, (LAT1 - lat) * K] as const;

type Pin = { club: Club; x: number; y: number; planned: boolean };

export function GermanyMap({
  clubs,
  planned = [],
  locale,
  label,
  hint,
  legend,
}: {
  clubs: Club[];
  planned?: Club[];
  locale: Locale;
  label: string;
  hint: string;
  legend: { live: string; soon: string };
}) {
  const [active, setActive] = useState<string | null>(null);
  const pointer = useRef<string>("mouse");
  const outline = OUTLINE.map(([lon, lat], i) => `${i ? "L" : "M"}${project(lon, lat).join(" ")}`).join(" ") + "Z";

  const pins: Pin[] = [
    ...planned.map((club) => ({ club, planned: true })),
    ...clubs.map((club) => ({ club, planned: false })),
  ].map(({ club, planned: p }) => {
    const [x, y] = project(club.position.longitude, club.position.latitude);
    return { club, x, y, planned: p };
  });
  const current = pins.find((p) => p.club.id === active);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" role="img" aria-label={`${label} (${clubs.length})`}>
        <defs>
          <radialGradient id="pinGlow" r="0.5">
            <stop offset="0" stopColor="#b4e854" stopOpacity="0.9" />
            <stop offset="1" stopColor="#b4e854" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="landFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e005c3" stopOpacity="0.55" />
            <stop offset="1" stopColor="#401b78" stopOpacity="0.75" />
          </linearGradient>
          <pattern id="dots" width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.6" fill="rgb(255 255 255 / 0.22)" />
          </pattern>
        </defs>
        <path d={outline} fill="url(#landFill)" stroke="rgb(255 255 255 / 0.55)" strokeWidth="0.8" strokeLinejoin="round" />
        <path d={outline} fill="url(#dots)" />

        {pins.map(({ club, x, y, planned: p }) => {
          const isActive = active === club.id;
          const dot = (
            <g
              transform={`translate(${x} ${y})`}
              className="cursor-pointer outline-none"
              onPointerEnter={(e) => {
                pointer.current = e.pointerType;
                if (e.pointerType === "mouse") setActive(club.id);
              }}
              onPointerDown={(e) => (pointer.current = e.pointerType)}
              onFocus={() => setActive(club.id)}
            >
              {isActive && <circle r="22" fill="url(#pinGlow)" />}
              {p ? (
                <circle r={isActive ? 5.5 : 4.2} fill="#0b0b0f" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2 1.4" />
              ) : (
                <circle r={isActive ? 6.5 : 4.6} fill={isActive ? "#b4e854" : "#ffffff"} stroke="#0b0b0f" strokeWidth="1.5" />
              )}
              {/* Larger invisible hit target (touch) */}
              <circle r="10" fill="transparent" />
            </g>
          );
          return p ? (
            <g
              key={`p-${club.id}`}
              tabIndex={0}
              role="button"
              aria-label={`${club.name} – ${legend.soon}`}
              onClick={() => setActive(club.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(club.id);
                }
              }}
            >
              {dot}
            </g>
          ) : (
            <Link
              key={club.id}
              href={href(locale, "locations", club.slug)}
              aria-label={club.name}
              onClick={(e) => {
                // Touch: first tap reveals the label, second tap opens the club.
                if (pointer.current !== "mouse" && active !== club.id) {
                  e.preventDefault();
                  setActive(club.id);
                }
              }}
            >
              {dot}
            </Link>
          );
        })}

        {/* Active label – drawn last so it sits above all pins */}
        {current && <PinLabel pin={current} soon={legend.soon} width={W} />}
      </svg>

      {/* No visible legend – the pin label explains itself. Announce the active club for screen readers. */}
      <p className="sr-only" aria-live="polite">
        {current ? current.club.name : hint}
      </p>
    </div>
  );
}

function PinLabel({ pin, soon, width }: { pin: Pin; soon: string; width: number }) {
  const name = pin.club.name.replace(/^PadelCity\s+/i, "").toUpperCase();
  const text = pin.planned ? `${name} · ${soon.toUpperCase()}` : name;
  const w = Math.max(48, text.length * 8 + 20);
  const h = 24;
  // Flip to the left when the label would leave the map on the right.
  const right = pin.x + 12 + w < width;
  const lx = right ? pin.x + 12 : pin.x - 12 - w;
  const ly = pin.y - h / 2;
  return (
    <g pointerEvents="none" className="animate-[label-in_180ms_ease-out]">
      <line x1={pin.x} y1={pin.y} x2={right ? lx : lx + w} y2={pin.y} stroke="#b4e854" strokeWidth="1.2" />
      <rect x={lx} y={ly} width={w} height={h} rx="4" fill={pin.planned ? "#ffffff" : "#b4e854"} />
      <text
        x={lx + w / 2}
        y={pin.y + 0.5}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#0b0b0f"
        fontSize="14"
        fontWeight="800"
        fontStyle="italic"
        style={{ fontFamily: "var(--font-soehne-schmal), sans-serif", letterSpacing: "0.03em" }}
      >
        {text}
      </text>
    </g>
  );
}
