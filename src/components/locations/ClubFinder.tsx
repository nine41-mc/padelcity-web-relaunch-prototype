"use client";

// Contentful module: locationFinder (filters + list/map view; Contentful club master data only – no booking data)

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, LocateFixed, Loader2, Map as MapIcon, Search, SlidersHorizontal, X } from "lucide-react";
import { SPORTS, type Club, type ClubCountry, type Sport } from "@/lib/data/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { clubSports } from "@/components/cards/ClubMeta";
import { AppIcon } from "@/components/ui/Icon";
import type { Locale } from "@/lib/i18n/config";
import { COUNTRY_ORDER, locationsContent } from "@/lib/content/locations";
import { ClubCard } from "@/components/cards/ClubCard";
import { cn } from "@/components/ui/cn";
import { ClubMapLazy } from "./ClubMapLazy";
import { CountryFlag } from "./CountryFlag";
import { FilterSheet, SheetGroup, sheetChip } from "./FilterSheet";
import { distanceKm, todaysHours, type LatLng } from "./geo";

type FilterKey = "indoor" | "outdoor" | "centerCourt" | "franchise";
type SortKey = "default" | "distance" | "az" | "za";
const SORT_KEYS: SortKey[] = ["default", "distance", "az", "za"];
const FILTER_KEYS: FilterKey[] = ["indoor", "outdoor", "centerCourt", "franchise"];

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
  const [sports, setSports] = useState<Set<Sport>>(new Set());
  const [openNow, setOpenNow] = useState(false);
  const [sort, setSort] = useState<SortKey>("default");
  const [sheetOpen, setSheetOpen] = useState(false);
  const sportNames = getDictionary(locale).sports;
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const toggle = (k: FilterKey) =>
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const toggleSport = (k: Sport) =>
    setSports((prev) => {
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

  // Sports offered anywhere in the network (filter options), in the app's order
  const availableSports = useMemo(() => {
    const set = new Set(clubs.flatMap((c) => clubSports(c)));
    return SPORTS.filter((sp) => set.has(sp));
  }, [clubs]);

  // Sorting by distance needs the visitor's location; "In meiner Nähe" switches it on automatically.
  const effectiveSort: SortKey = sort === "default" && user ? "distance" : sort === "distance" && !user ? "default" : sort;
  const chooseSort = (k: SortKey) => {
    setSort(k);
    if (k === "distance" && !user && geo !== "loading") locate();
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = clubs
      .filter((c) => {
        if (country !== "all" && c.country !== country) return false;
        if (!matchesQuery(c, q)) return false;
        if (filters.has("indoor") && !c.courts.some((x) => x.locationType === "indoor")) return false;
        if (filters.has("outdoor") && !c.courts.some((x) => x.locationType === "outdoor")) return false;
        if (filters.has("centerCourt") && !c.courts.some((x) => x.isPremium)) return false;
        if (filters.has("franchise") && !c.isFranchise) return false;
        if (sports.size > 0 && !clubSports(c).some((sp) => sports.has(sp))) return false;
        if (openNow && todaysHours(c.openingHours)?.state !== "open") return false;
        return true;
      })
      .map((c) => ({ club: c, km: user ? distanceKm(user, c.position) : undefined }));
    if (effectiveSort === "distance") list.sort((a, b) => (a.km ?? 0) - (b.km ?? 0));
    if (effectiveSort === "az" || effectiveSort === "za") {
      list.sort((a, b) => a.club.name.localeCompare(b.club.name, locale) * (effectiveSort === "za" ? -1 : 1));
    }
    return list;
  }, [clubs, query, filters, user, country, sports, openNow, effectiveSort, locale]);

  // Planned clubs appear on the map only (outline pins); court-type filters don't apply – they have no courts yet.
  const plannedOnMap = useMemo(() => {
    if (filters.size > 0 || sports.size > 0 || openNow) return [];
    const q = query.trim().toLowerCase();
    return planned.filter((c) => (country === "all" || c.country === country) && matchesQuery(c, q));
  }, [planned, query, filters, country, sports, openNow]);

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

  // Badge on the filter button: everything that lives only inside the filter panel
  const activeCount = filters.size + sports.size + (openNow ? 1 : 0) + (sort !== "default" ? 1 : 0);

  const resetFilters = () => {
    setFilters(new Set());
    setSports(new Set());
    setOpenNow(false);
    setSort("default");
  };
  const reset = () => {
    setQuery("");
    setCountry("all");
    resetFilters();
  };

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
        className="relative z-10 -mt-8 flex flex-col gap-2 rounded-[28px] border border-fg/35 bg-raised/90 p-2 shadow-elevated md:p-[5px] has-[input:focus-visible]:border-fg has-[input:focus-visible]:ring-1 has-[input:focus-visible]:ring-fg backdrop-blur-xl md:-mt-10 md:flex-row md:items-center md:rounded-full"
      >
        <label className="flex min-h-13 flex-1 items-center gap-3 rounded-full px-4 focus-within:bg-fg/5">
          <Search className="size-5 shrink-0 text-fg/70" aria-hidden />
          <span className="flex flex-1 flex-col">
            <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-fg/70">{t.where}</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.placeholder}
              className="w-full bg-transparent text-base text-fg placeholder:text-fg/60 focus:outline-none"
              aria-label={t.searchLabel}
            />
          </span>
          {query && (
            <button type="button" onClick={() => setQuery("")} className="grid size-11 place-items-center rounded-full text-fg/70 hover:bg-fg/10" aria-label={t.clear}>
              <X className="size-4" />
            </button>
          )}
        </label>
        <div className="hidden h-10 w-px bg-fg/10 md:block" aria-hidden />
        <button
          type="button"
          onClick={locate}
          aria-pressed={!!user}
          className={cn(
            "flex min-h-13 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors",
            user ? "bg-brand-gradient text-white" : "text-fg/85 hover:bg-fg/5",
          )}
        >
          {geo === "loading" ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <LocateFixed className="size-5" aria-hidden />}
          {user ? t.nearActive : t.near}
        </button>
        <button type="submit" className="flex min-h-13 items-center justify-center gap-2 rounded-full bg-brand-gradient px-7 font-display text-lg italic md:text-xl uppercase tracking-wide text-white transition hover:brightness-110">
          {t.submit}
        </button>
      </form>
      {(geo === "denied" || geo === "unsupported") && (
        <p className="mt-3 text-sm text-fg/70" role="status">
          {t.geoError}
        </p>
      )}

      {/* Toolbar – one line: countries (tablet/desktop) · count · filter · list/map */}
      <h2 className="sr-only">{t.resultsHeading}</h2>
      <div id="results" className="mt-8 flex scroll-mt-32 items-center gap-4 md:mt-10">
        {countries.length > 1 && (
          <div className="hidden shrink-0 gap-1 rounded-full border border-fg/15 bg-fg/[0.03] p-1 md:flex" role="group" aria-label={t.countryLabel} data-testid="country-filter">
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
                    active ? "bg-brand-gradient text-white" : "text-fg/75 hover:text-fg",
                  )}
                >
                  {code !== "all" && <CountryFlag country={code} />}
                  {t.countries[code]}
                  <span className={cn("tabular-nums text-[13px]", active ? "text-fg/80" : "text-fg/70")}>{count}</span>
                </button>
              );
            })}
          </div>
        )}
        <div className="flex w-full items-center justify-between gap-4 md:ml-auto md:w-auto md:justify-end">
          <p className="whitespace-nowrap text-sm text-fg/70 md:hidden lg:block" aria-live="polite">
            <span className="font-semibold text-fg">{results.length}</span> {results.length === 1 ? t.club : t.clubs}
            {effectiveSort === "distance" && t.byDistance}
          </p>
          <div className="flex items-center gap-2">
            {/* All further criteria (sports, features, open now, sorting – and countries on phones) live in the filter panel */}
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={sheetOpen}
              aria-label={activeCount ? `${t.filterLabel} (${activeCount})` : t.filterLabel}
              className={cn(
                "relative grid size-12 place-items-center rounded-full border transition-colors",
                activeCount ? "border-transparent bg-brand-gradient text-white" : "border-fg/40 bg-fg/5 text-fg hover:border-fg/70",
              )}
            >
              <SlidersHorizontal className="size-5" aria-hidden />
              {activeCount > 0 && (
                <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-fg text-[11px] font-bold tabular-nums text-fg-inverse" aria-hidden>
                  {activeCount}
                </span>
              )}
            </button>
            <div className="flex rounded-full border border-fg/15 p-1" role="group" aria-label={t.viewLabel}>
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
                  aria-label={label}
                  className={cn(
                    "flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors lg:px-4",
                    view === key ? "bg-brand-gradient text-white" : "text-fg/70 hover:text-fg",
                  )}
                >
                  {/* Icon only below desktop (label stays the accessible name) */}
                  <Icon className="size-4" aria-hidden /> <span className="hidden lg:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FilterSheet
        open={sheetOpen}
        onClose={closeSheet}
        title={t.filterLabel}
        closeLabel={t.close}
        resetLabel={t.resetShort}
        showLabel={t.show(results.length)}
        onReset={() => {
          resetFilters();
          setCountry("all");
        }}
      >
        <SheetGroup label={t.sortLabel}>
          {SORT_KEYS.map((key) => (
            <button key={key} type="button" aria-pressed={sort === key} onClick={() => chooseSort(key)} className={sheetChip(sort === key)}>
              {key === "distance" && <LocateFixed className="size-4" aria-hidden />}
              {t.sort[key]}
            </button>
          ))}
        </SheetGroup>
        <SheetGroup label={t.availabilityLabel}>
          <button type="button" aria-pressed={openNow} onClick={() => setOpenNow((v) => !v)} className={sheetChip(openNow)}>
            <span className={cn("size-2 rounded-full", openNow ? "bg-fg" : "bg-success")} aria-hidden />
            {t.openNow}
          </button>
        </SheetGroup>
        {availableSports.length > 1 && (
          <SheetGroup label={t.sportsLabel}>
            {availableSports.map((sp) => (
              <button key={sp} type="button" aria-pressed={sports.has(sp)} onClick={() => toggleSport(sp)} className={sheetChip(sports.has(sp))}>
                <AppIcon name={sp} className="size-4" />
                {sportNames[sp]}
              </button>
            ))}
          </SheetGroup>
        )}
        <SheetGroup label={t.featuresLabel}>
          {FILTER_KEYS.map((key) => (
            <button key={key} type="button" aria-pressed={filters.has(key)} onClick={() => toggle(key)} className={sheetChip(filters.has(key))}>
              {t.filters[key]}
            </button>
          ))}
        </SheetGroup>
        {countries.length > 1 && (
          <SheetGroup label={t.countryLabel} className="md:hidden">
            {[{ code: "all" as const, count: clubs.length }, ...countries].map(({ code, count }) => (
              <button key={code} type="button" aria-pressed={country === code} onClick={() => setCountry(code)} className={sheetChip(country === code)}>
                {code !== "all" && <CountryFlag country={code} />}
                {t.countries[code]}
                <span className={cn("tabular-nums text-[13px]", country === code ? "text-fg/80" : "text-fg/70")}>{count}</span>
              </button>
            ))}
          </SheetGroup>
        )}
      </FilterSheet>

      {/* Results */}
      {results.length === 0 ? (
        <div className="mt-10 rounded-[20px] border border-dashed border-fg/15 pad-banner text-center">
          <p className="text-lg font-semibold">{t.emptyTitle}</p>
          <p className="mt-2 text-fg/70">{t.emptyText}</p>
          <button type="button" onClick={reset} className="mt-6 min-h-11 rounded-full border border-fg/30 px-5 text-sm font-medium hover:bg-fg/5">
            {t.reset}
          </button>
        </div>
      ) : view === "list" ? (
        <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {results.map(({ club, km }) => (
            <li key={club.id} className="flex min-w-0">
              <ClubCard club={club} distanceKm={km} locale={locale} className="w-full" />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="relative isolate h-[60vh] min-h-[360px] overflow-hidden rounded-[20px] border border-fg/10 lg:sticky lg:top-28 lg:order-2 lg:h-[calc(100vh-9rem)]">
            <ClubMapLazy clubs={mapClubs} locale={locale} activeId={activeId} onSelect={setActiveId} user={user} />
            {plannedOnMap.length > 0 && (
              <p className="pointer-events-none absolute bottom-3 left-3 z-[1000] flex items-center gap-2 rounded-full border border-fg/15 bg-canvas/85 px-3 py-1.5 text-[13px] text-fg/85 backdrop-blur">
                <span className="size-3 rounded-full border-2 border-magenta-500" aria-hidden /> {t.mapLegendPlanned}
              </p>
            )}
          </div>
          {/* content-start: with few results the rows keep their natural height instead of stretching to the map's height */}
          <ul className="grid content-start gap-5 md:grid-cols-2 lg:order-1">
            {results.map(({ club, km }) => (
              <li
                key={club.id}
                className="flex min-w-0"
                onMouseEnter={() => setActiveId(club.id)}
                onFocus={() => setActiveId(club.id)}
              >
                <ClubCard club={club} distanceKm={km} locale={locale} active={activeId === club.id} lift={false} className="w-full" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
