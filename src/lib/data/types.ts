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
  iconUrl?: string;
};

export type CourtSummary = {
  id: string;
  name: string;
  locationType: "indoor" | "outdoor";
  courtType: "double" | "single";
  isPremium?: boolean; // e.g. "Panorama Court"
};

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
  name: string; // "PadelCity Tucherpark"
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
  defaultPricePerHour?: number; // EUR, per court & hour
  mainImage?: ImageAsset;
  images: ImageAsset[];
  contact?: { name?: string; phoneNumber?: string; emailAddress?: string };
  // No `rating` on purpose: ratings are never mocked. Real Google ratings come from lib/data/google-reviews.ts (module clubReviews).
  tags: string[]; // "Indoor", "Outdoor", "Panorama Court", "Franchise", "Neu"
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
  source: DataSource;
};

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
  hub: "lernen" | "spielen" | "erleben"; // briefing: Padel Lernen / Spielen / Erleben
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
