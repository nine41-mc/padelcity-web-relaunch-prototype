/**
 * Website domain model (view models).
 * Field names follow api-platform (api/src/Entity/Club.php, Court.php, ClubEvent.php,
 * ApiResource/Schedule/ClubSchedule.php) so that the adapters stay thin.
 * Sources: Contentful (master data) and mocks (fallback). Never booking-system data (slots, occupancy).
 */

export type DataSource = "contentful" | "mock";

export type ImageAsset = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export type Facility = {
  type: string; // e.g. "sauna", "parking_space" → maps to /icons/<type>.svg
  name: string;
  /** Icon file name in /public/icons when it differs from `type` (Contentful types, e.g. "free_parking" → "parking_space"). */
  icon?: string;
  iconUrl?: string;
};

export type CourtSummary = {
  id: string;
  name: string;
  locationType: "indoor" | "outdoor";
  courtType: "double" | "single";
  isPremium?: boolean; // "Center Court"
  sport?: Sport; // default "padel"
};

export type Sport = "padel" | "pickleball" | "tennis" | "squash" | "badminton" | "soccer" | "multisport";
export const SPORTS: Sport[] = ["padel", "pickleball", "tennis", "squash", "badminton", "soccer", "multisport"];

export type OpeningHours = {
  label: string; // "Mo – Fr"
  open: string; // "07:00"
  close: string; // "23:00"
}[];

export type ClubCountry = "DE" | "AT" | "ES" | "PL" | "PH";
export type ClubStatus = "open" | "planned";

export type Club = {
  id: string;
  slug: string;
  contentfulId?: string;
  name: string; // display name without brand prefix: "Tucherpark", "Andernach"
  fullName?: string; // official name incl. brand: "PadelCity Tucherpark" (SEO, JSON-LD, titles)
  city: string; // "München"
  region?: string; // Bundesland / subdivision
  country: ClubCountry;
  description: string;
  teaser: string; // one-liner for cards
  address: { streetName: string; buildingNumber: string; postalCode: string; localityName: string };
  position: { latitude: number; longitude: number };
  courts: CourtSummary[];
  facilities: Facility[];
  openingHours: OpeningHours;
  defaultPricePerHour?: number; // major units (e.g. 24 = 24 €), per court & hour
  /** Court price list in force (Contentful clubPriceList, synced to the APL as ClubPriceList.pricing). */
  priceList?: ClubPriceList;
  /** Second poster line when the site lies outside the named city ("Karlsruhe" + "Rheinstetten"). */
  district?: string;
  currency?: "EUR" | "PLN"; // club country currency (default EUR)
  mainImage?: ImageAsset;
  images: ImageAsset[];
  /** Club manager contact (Contentful contact entry). whatsappGroupUrl = proposed new Contentful field on club. */
  contact?: { name?: string; phoneNumber?: string; emailAddress?: string; profileImageUrl?: string; whatsappGroupUrl?: string };
  // No `rating` on purpose: ratings are never mocked. Real Google ratings come from lib/data/google-reviews.ts (module clubReviews).
  tags: string[]; // "Indoor", "Outdoor", "Center Court", "Franchise", "Neu"
  isFranchise?: boolean;
  /** "planned" = announced on padelcity.de as "soon" – no detail page, no booking, no price. Default: open. */
  status?: ClubStatus;
  openingDate?: string; // ISO date or "YYYY-MM" / "YYYY" when only the period is known (planned clubs)
  source: DataSource;
};

export type EventType = "tournament" | "social" | "training" | "hero";

export type ClubEvent = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  type: EventType;
  level?: string; // "Level 1–3"
  clubId?: string;
  clubName?: string;
  city?: string;
  start: string; // ISO
  end?: string;
  pricePerPerson?: number;
  image?: ImageAsset;
  isHighlighted?: boolean;
  recurrence?: string; // "Jeden Freitag"
  /** APL registrationClosesAt (ISO); undefined = sign-up open until the event starts. */
  registrationClosesAt?: string;
  /** APL freeCancellationStrategy (default UNTIL_24H_BEFORE_EVENT). */
  freeCancellation?: FreeCancellation;
  /** APL personsPerTeam for TEAM events; undefined = individual sign-up. */
  personsPerTeam?: number;
  source: DataSource;
};

export type FreeCancellation = "UNTIL_24H_BEFORE_EVENT" | "WITHIN_60MIN_FROM_BOOKING" | "WITHIN_14DAYS_FROM_BOOKING";

export type Coach = {
  id: string;
  name: string;
  role: string;
  clubName?: string;
  image?: ImageAsset;
  quote?: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  hub: "lernen" | "spielen" | "erleben"; // briefing: Padel lernen / spielen / erleben
  category: string;
  author: string;
  publishedAt: string;
  readingTimeMin: number;
  image?: ImageAsset;
  body?: string[]; // paragraphs (Contentful rich text later)
};

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  url: string; // Personio
};

export type TeamMember = {
  name: string;
  role: string;
  image?: ImageAsset;
  quote?: string;
};

export type Partner = {
  name: string;
  logo: string; // /brand/partners/*
  tier: "premium" | "official" | "supplier";
  since?: string;
  description?: string;
};

/** Price columns of one time period, per court & hour in major units (34 = 34 €). Premium = Center Court. */
export type PriceKind = "indoorDouble" | "indoorSingle" | "indoorPremium" | "outdoorDouble" | "outdoorSingle" | "outdoorPremium";
export type PricePeriod = { from: string; until: string; prices: Partial<Record<PriceKind, number>> };
/** days[0..6] = Monday … Sunday, days[7] = public holidays; each a list of time periods (off-peak, peak …). */
export type ClubPriceList = { title?: string; validFrom: string; sports: Partial<Record<Sport, PricePeriod[][]>> };
