"use client";

// Contentful module: locationFinder (filters + list/map view; Contentful club master data only – no booking data)

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, LocateFixed, Loader2, Map as MapIcon, Search, X } from "lucide-react";
import type { Club, ClubCountry } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { COUNTRY_ORDER, locationsContent } from "@/lib/content/locations";
import { ClubCard } from "@/components/cards/ClubCard";
import { cn } from "@/components/ui/cn";
import { ClubMapLazy } from "./ClubMapLazy";
import { CountryFlag } from "./CountryFlag";
import { distanceKm, type LatLng } from "./geo";

type FilterKey = "indoor" | "outdoor" | "panorama" | "franchise";
const FILTER_KEYS: FilterKey[] = ["indoor", "outdoor", "panorama", "franchise"];

const matchesQuery = (c: Club, q: string) =>
  !q || [c.name, c.city, c.region ?? "", c.address.postalCode].some((v) => v.toLowerCase().includes(q));

type GeoState = "idle" | "loading" | "denied" | "unsupported";

/**
 * Reads ?q= (e.g. from the home hero search) once on the client.
 * Static export: search params are unknown at build time → useSearchParams must sit inside <Suspense>.
 */
function InitialQuery({ onQuery }: { onQuery: (q: string) => void }) {
  const params = useSearchParams();
  const q = params.get("q");
  useEffect(() => {
    if (q) onQuery(q);
  }, [q, onQuery]);
  return null;
}

export function ClubFinder({ clubs, planned = [], locale = "de" }: { clubs: Club[]; planned?: Club[]; locale?: Locale }) {
  const t = locationsContent[locale].finder;
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<ClubCountry | "all">("all");
  const [filters, setFilters] = useState<Set<FilterKey>>(new Set());
  const [view, setView] = useState<"list" | "map">("list");
  const [user, setUser] = useState<LatLng | null>(null);
  const [geo, setGeo] = useState<GeoState>("idle");
  const [activeId, setActiveId] = useState<string | null>(null);

  const toggle = (k: FilterKey) =>
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const locate = () => {
    if (user) {
      setUser(null);
      return;
    }
    if (!("geolocation" in navigator)) {
      setGeo("unsupported");
      return;
    }
    setGeo("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUser({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setGeo("idle");
      },
      () => setGeo("denied"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  };

  // Country segments: only countries with open clubs, home market first; counts = open clubs.
  const countries = useMemo(() => {
    const counts = new Map<ClubCountry, number>();
    for (const c of clubs) counts.set(c.country, (counts.get(c.country) ?? 0) + 1);
    return COUNTRY_ORDER.filter((cc) => counts.has(cc)).map((cc) => ({ code: cc, count: counts.get(cc) ?? 0 }));
  }, [clubs]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = clubs
      .filter((c) => {
        if (country !== "all" && c.country !== country) return false;
        if (!matchesQuery(c, q)) return false;
        if (filters.has("indoor") && !c.courts.some((x) => x.locationType === "indoor")) return false;
        if (filters.has("outdoor") && !c.courts.some((x) => x.locationType === "outdoor")) return false;
        if (filters.has("panorama") && !c.courts.some((x) => x.isPremium)) return false;
        if (filters.has("franchise") && !c.isFranchise) return false;
        return true;
      })
      .map((c) => ({ club: c, km: user ? distanceKm(user, c.position) : undefined }));
    if (user) list.sort((a, b) => (a.km ?? 0) - (b.km ?? 0));
    return list;
  }, [clubs, query, filters, user, country]);

  // Planned clubs appear on the map only (outline pins); court-type filters don't apply – they have no courts yet.
  const plannedOnMap = useMemo(() => {
    if (filters.size > 0) return [];
    const q = query.trim().toLowerCase();
    return planned.filter((c) => (country === "all" || c.country === country) && matchesQuery(c, q));
  }, [planned, query, filters, country]);

  const mapClubs = useMemo(
    () => [
      ...results.map(({ club }) => ({
        id: club.id,
        slug: club.slug,
        name: club.name,
        city: club.city,
        position: club.position,
        priceFrom: club.defaultPricePerHour,
        currency: club.currency,
      })),
      ...plannedOnMap.map((club) => ({
        id: club.id,
        slug: club.slug,
        name: club.name,
        city: club.city,
        position: club.position,
        planned: true,
      })),
    ],
    [results, plannedOnMap],
  );

  const reset = () => {
    setQuery("");
    setFilters(new Set());
    setCountry("all");
  };

  const chip = (active: boolean) =>
    cn(
      "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
      active ? "border-transparent bg-brand-gradient text-white" : "border-white/40 bg-white/5 text-white/85 hover:border-white/70 hover:text-white",
    );

  return (
    <div>
      <Suspense fallback={null}>
        <InitialQuery onQuery={setQuery} />
      </Suspense>
      {/* Search pill (Elephant "Wo / Wann / Wer" adapted: booking itself happens in the app) */}
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        className="relative z-10 -mt-8 flex flex-col gap-2 rounded-[28px] border border-white/35 bg-ink-700/90 p-2 shadow-elevated backdrop-blur-xl md:-mt-10 md:flex-row md:items-center md:rounded-full"
      >
        <label className="flex min-h-14 flex-1 items-center gap-3 rounded-full px-4 focus-within:bg-white/5 focus-within:ring-2 focus-within:ring-white/70">
          <Search className="size-5 shrink-0 text-white/70" aria-hidden />
          <span className="flex flex-1 flex-col">
            <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">{t.where}</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.placeholder}
              className="w-full bg-transparent text-base text-white placeholder:text-white/60 focus:outline-none"
              aria-label={t.searchLabel}
            />
          </span>
          {query && (
            <button type="button" onClick={() => setQuery("")} className="grid size-11 place-items-center rounded-full text-white/70 hover:bg-white/10" aria-label={t.clear}>
              <X className="size-4" />
            </button>
          )}
        </label>
        <div className="hidden h-10 w-px bg-white/10 md:block" aria-hidden />
        <button
          type="button"
          onClick={locate}
          aria-pressed={!!user}
          className={cn(
            "flex min-h-14 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors",
            user ? "bg-brand-gradient text-white" : "text-white/85 hover:bg-white/5",
          )}
        >
          {geo === "loading" ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <LocateFixed className="size-5" aria-hidden />}
          {user ? t.nearActive : t.near}
        </button>
        <button type="submit" className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-brand-gradient px-7 font-display text-lg italic uppercase tracking-wide text-white transition hover:brightness-110">
          {t.submit}
        </button>
      </form>
      {(geo === "denied" || geo === "unsupported") && (
        <p className="mt-3 text-sm text-white/70" role="status">
          {t.geoError}
        </p>
      )}

      {/* Country segmented control (DE · AT · PL …) – combines with search + filters below */}
      {countries.length > 1 && (
        <div
          className="-mx-4 mt-10 flex overflow-x-auto px-4 scrollbar-none md:mx-0 md:px-0"
          role="group"
          aria-label={t.countryLabel}
          data-testid="country-filter"
        >
          <div className="flex shrink-0 gap-1 rounded-full border border-white/15 bg-white/[0.03] p-1">
            {[{ code: "all" as const, count: clubs.length }, ...countries].map(({ code, count }) => {
              const active = country === code;
              return (
                <button
                  key={code}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCountry(code)}
                  className={cn(
                    "flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
                    active ? "bg-brand-gradient text-white" : "text-white/75 hover:text-white",
                  )}
                >
                  {code !== "all" && <CountryFlag country={code} />}
                  {t.countries[code]}
                  <span className={cn("tabular-nums text-[13px]", active ? "text-white/80" : "text-white/70")}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <h2 className="sr-only">{t.resultsHeading}</h2>
      <div id="results" className={cn("flex scroll-mt-32 flex-col gap-4 md:flex-row md:items-center md:justify-between", countries.length > 1 ? "mt-4" : "mt-10")}>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 scrollbar-none md:mx-0 md:flex-wrap md:px-0" role="group" aria-label={t.filterLabel}>
          {FILTER_KEYS.map((key) => (
            <button key={key} type="button" aria-pressed={filters.has(key)} onClick={() => toggle(key)} className={chip(filters.has(key))}>
              {t.filters[key]}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="whitespace-nowrap text-sm text-white/70" aria-live="polite">
            <span className="font-semibold text-white">{results.length}</span> {results.length === 1 ? t.club : t.clubs}
            {user && t.byDistance}
          </p>
          <div className="flex rounded-full border border-white/15 p-1" role="group" aria-label={t.viewLabel}>
            {(
              [
                ["list", t.list, LayoutGrid],
                ["map", t.map, MapIcon],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                type="button"
                aria-pressed={view === key}
                onClick={() => setView(key)}
                className={cn(
                  "flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
                  view === key ? "bg-brand-gradient text-white" : "text-white/70 hover:text-white",
                )}
              >
                <Icon className="size-4" aria-hidden /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="mt-10 rounded-[20px] border border-dashed border-white/15 p-10 text-center">
          <p className="text-lg font-semibold">{t.emptyTitle}</p>
          <p className="mt-2 text-white/70">{t.emptyText}</p>
          <button type="button" onClick={reset} className="mt-6 min-h-11 rounded-full border border-white/30 px-5 text-sm font-medium hover:bg-white/5">
            {t.reset}
          </button>
        </div>
      ) : view === "list" ? (
        <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {results.map(({ club, km }) => (
            <li key={club.id} className="flex">
              <ClubCard club={club} distanceKm={km} locale={locale} className="w-full" />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="relative isolate h-[60vh] min-h-[360px] overflow-hidden rounded-[20px] border border-white/10 lg:sticky lg:top-28 lg:order-2 lg:h-[calc(100vh-9rem)]">
            <ClubMapLazy clubs={mapClubs} locale={locale} activeId={activeId} onSelect={setActiveId} user={user} />
            {plannedOnMap.length > 0 && (
              <p className="pointer-events-none absolute bottom-3 left-3 z-[1000] flex items-center gap-2 rounded-full border border-white/15 bg-ink-800/85 px-3 py-1.5 text-[13px] text-white/85 backdrop-blur">
                <span className="size-3 rounded-full border-2 border-magenta-500" aria-hidden /> {t.mapLegendPlanned}
              </p>
            )}
          </div>
          <ul className="grid gap-5 md:grid-cols-2 lg:order-1">
            {results.map(({ club, km }) => (
              <li
                key={club.id}
                className={cn("flex rounded-[22px] transition-shadow", activeId === club.id && "ring-2 ring-magenta-400")}
                onMouseEnter={() => setActiveId(club.id)}
                onFocus={() => setActiveId(club.id)}
              >
                <ClubCard club={club} distanceKm={km} locale={locale} className="w-full" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
