"use client";

// Contentful module: clubMap (live + planned clubs, derived from club entries)
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

// Neighbour countries with clubs, sketched in grey so Innsbruck and Warsaw/Kraków/Kielce don't float in empty space.
// Coarse outlines (lon, lat), decorative only; they light up on hover like the coach tiles (grey → colour).
const NEIGHBOURS: { code: "AT" | "PL"; outline: [number, number][]; label: [number, number] }[] = [
  {
    code: "AT",
    label: [15.1, 47.3],
    outline: [
      [9.53, 47.27], [9.6, 47.06], [10.1, 46.85], [10.47, 46.87], [11.0, 46.77], [12.18, 47.08], [12.41, 46.7], [13.7, 46.52],
      [14.6, 46.44], [15.1, 46.66], [16.0, 46.7], [16.6, 46.95], [16.1, 47.4], [16.9, 47.7], [17.07, 48.0], [16.94, 48.6],
      [16.0, 48.75], [15.0, 49.0], [14.0, 48.75], [13.8, 48.57], [13.4, 48.37], [12.9, 47.95], [13.0, 47.47], [12.2, 47.7],
      [11.3, 47.4], [10.5, 47.5], [9.97, 47.54], [9.6, 47.53],
    ],
  },
  {
    code: "PL",
    label: [17.3, 53.0],
    outline: [
      [14.12, 53.9], [16.0, 54.25], [17.5, 54.8], [18.6, 54.4], [19.6, 54.45], [22.8, 54.36], [23.5, 53.9], [23.9, 53.2],
      [23.5, 52.6], [23.2, 52.2], [23.6, 51.6], [24.1, 50.8], [23.5, 50.4], [22.7, 49.6], [22.6, 49.1], [21.6, 49.45],
      [20.9, 49.35], [20.0, 49.2], [19.4, 49.6], [18.8, 49.5], [18.0, 50.0], [17.7, 50.3], [17.0, 50.2], [16.9, 50.45],
      [16.4, 50.4], [16.3, 50.65], [15.5, 50.8], [15.0, 51.0], [14.8, 50.9], [15.0, 51.2], [14.6, 52.0], [14.7, 52.6],
      [14.15, 52.8], [14.3, 53.3], [14.6, 53.6],
    ],
  },
];
const COUNTRY_NAMES = { de: { AT: "Österreich", PL: "Polen" }, en: { AT: "Austria", PL: "Poland" } } as const;

// Map frame: Germany plus room for Innsbruck (AT) and Warsaw/Kraków/Kielce (PL).
const LON0 = 5.5;
const LON1 = 21.6;
const LAT0 = 46.3;
const LAT1 = 55.3;
const K = 40;
const COS = 0.63; // ≈ cos(51°)
const W = (LON1 - LON0) * COS * K;
const H = (LAT1 - LAT0) * K;
const project = (lon: number, lat: number) => [(lon - LON0) * COS * K, (LAT1 - lat) * K] as const;
// Phone frame: Germany (+ Innsbruck) only – clubs further east are listed below the map instead.
const W_NARROW = (15.4 - LON0) * COS * K;

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
  const [hoverCountry, setHoverCountry] = useState<string | null>(null);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const viewW = narrow ? W_NARROW : W;
  const pointer = useRef<string>("mouse");
  const outline = OUTLINE.map(([lon, lat], i) => `${i ? "L" : "M"}${project(lon, lat).join(" ")}`).join(" ") + "Z";

  const pins: Pin[] = [
    ...planned.map((club) => ({ club, planned: true })),
    ...clubs.map((club) => ({ club, planned: false })),
  ].map(({ club, planned: p }) => {
    const [x, y] = project(club.position.longitude, club.position.latitude);
    return { club, x, y, planned: p };
  });
  const visiblePins = pins.filter((p) => p.x <= viewW);
  const offMap = pins.filter((p) => p.x > viewW);
  const current = visiblePins.find((p) => p.club.id === active);
  // A neighbour lights up while it is hovered or one of its pins is active.
  const litCountry = hoverCountry ?? (current && current.club.country !== "DE" ? current.club.country : null);
  const path = (pts: [number, number][]) => pts.map(([lon, lat], i) => `${i ? "L" : "M"}${project(lon, lat).join(" ")}`).join(" ") + "Z";

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${viewW} ${H}`} className={narrow ? "h-auto w-full overflow-hidden" : "h-auto w-full overflow-visible"} role="img" aria-label={`${label} (${clubs.length})`}
        onPointerDown={(e) => {
          // Touch: tapping the map background hides the label again
          if (!(e.target as Element).closest("a, [role=button]")) setActive(null);
        }}
      >
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
          {/* Neighbours fade out at the right edge instead of being cut hard */}
          <linearGradient id="edgeFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0.82" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="neighbourMask" maskUnits="userSpaceOnUse" x="0" y="0" width={viewW} height={H}>
            <rect x="0" y="0" width={viewW} height={H} fill="url(#edgeFade)" />
          </mask>
        </defs>
        <g mask="url(#neighbourMask)">
          {NEIGHBOURS.map(({ code, outline: pts, label: [lon, lat] }) => {
            const lit = litCountry === code;
            const [lx, ly] = project(lon, lat);
            return (
              <g key={code} onPointerEnter={() => setHoverCountry(code)} onPointerLeave={() => setHoverCountry(null)} aria-hidden>
                <path
                  d={path(pts)}
                  fill={lit ? "url(#landFill)" : "rgb(255 255 255 / 0.06)"}
                  fillOpacity={lit ? 0.55 : 1}
                  stroke={lit ? "rgb(255 255 255 / 0.55)" : "rgb(255 255 255 / 0.22)"}
                  strokeWidth="0.8"
                  strokeLinejoin="round"
                  strokeDasharray={lit ? undefined : "3 2"}
                  className="transition-[fill,stroke] duration-300"
                />
                {lx < viewW - 30 && (
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    fill={lit ? "rgb(255 255 255 / 0.85)" : "rgb(255 255 255 / 0.4)"}
                    fontSize="11"
                    fontWeight="600"
                    letterSpacing="1.5"
                    className="pointer-events-none select-none uppercase transition-[fill] duration-300"
                  >
                    {COUNTRY_NAMES[locale][code]}
                  </text>
                )}
              </g>
            );
          })}
        </g>
        <path d={outline} fill="url(#landFill)" stroke="rgb(255 255 255 / 0.55)" strokeWidth="0.8" strokeLinejoin="round" />
        <path d={outline} fill="url(#dots)" />

        {visiblePins.map(({ club, x, y, planned: p }) => {
          const isActive = active === club.id;
          const dot = (
            <g
              transform={`translate(${x} ${y})`}
              className="cursor-pointer outline-none"
              onPointerEnter={(e) => {
                pointer.current = e.pointerType;
                if (e.pointerType === "mouse") setActive(club.id);
              }}
              onPointerLeave={(e) => {
                // Mouse leaves the pin → label disappears, map is clean again
                if (e.pointerType === "mouse") setActive((cur) => (cur === club.id ? null : cur));
              }}
              onPointerDown={(e) => (pointer.current = e.pointerType)}
              onFocus={() => setActive(club.id)}
              onBlur={() => setActive((cur) => (cur === club.id ? null : cur))}
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
        {current && <PinLabel pin={current} soon={legend.soon} width={viewW} />}
      </svg>

      {/* Phone: clubs outside the Germany frame (Poland) as chips below the map */}
      {narrow && offMap.length > 0 && (
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {offMap.map(({ club, planned: p }) =>
            p ? (
              <li key={club.id} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-dashed border-white/45 px-3.5 text-sm text-white/85">
                {club.name} <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-magenta-300">{legend.soon}</span>
              </li>
            ) : (
              <li key={club.id}>
                <Link href={href(locale, "locations", club.slug)} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/45 bg-white/5 px-3.5 text-sm font-semibold text-white hover:border-white hover:bg-white/10">
                  <span className="size-2 rounded-full bg-white" aria-hidden /> {club.name}
                </Link>
              </li>
            ),
          )}
        </ul>
      )}

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
