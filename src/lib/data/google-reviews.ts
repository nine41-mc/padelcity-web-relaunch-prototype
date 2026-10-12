import "server-only";
import { cache } from "react";
import type { Club } from "./types";
import type { Locale } from "../i18n/config";
import { errorMessage } from "./mappers";

/**
 * Google reviews for the club detail module "clubReviews" (Google Places API (New), read at BUILD time).
 *
 * Rules (see README.md → Google-Bewertungen): show "Google" attribution, author name exactly as given,
 * relative time, link to Google Maps; max. 5 reviews per place (API limit); never edit review text.
 * The website never renders a rating that doesn't come from this source – no mock ratings.
 *
 * Without GOOGLE_PLACES_API_KEY or without a place id for the club → `{ status: "placeholder" }`.
 */

/** Clubs that show the reviews module (rollout: Tucherpark first). Contentful: module "clubReviews" on the club page. */
export const reviewModuleClubs: ReadonlySet<string> = new Set(["muenchen-tucherpark"]);

/**
 * Club slug → Google place id (e.g. "ChIJ…"). Look it up via the Place ID Finder or Places Text Search.
 * TODO(content): fill in once the API key exists; later better as a field on the Contentful club entry.
 */
const placeIds: Record<string, string> = {
  // "muenchen-tucherpark": "ChIJ…",
};

export type GoogleReview = {
  author: string;
  authorUri?: string;
  authorPhotoUri?: string;
  rating: number; // 1–5
  text: string;
  /** Localized relative time from Google, e.g. "vor 2 Wochen" / "2 weeks ago". */
  relativeTime: string;
  publishTime?: string; // ISO
  mapsUri?: string;
};

export type ClubReviews =
  | { status: "placeholder"; mapsUri: string }
  | { status: "live"; rating: number; count: number; mapsUri: string; reviews: GoogleReview[] };

/** Google Maps search link for a club (fallback while no place id / API data is available). */
const mapsSearch = (club: Club) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${club.name} ${club.address.streetName} ${club.address.localityName}`)}`;

type PlacesResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: {
    rating?: number;
    text?: { text?: string };
    originalText?: { text?: string };
    relativePublishTimeDescription?: string;
    publishTime?: string;
    googleMapsUri?: string;
    authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  }[];
};

const fetchPlace = cache(async (placeId: string, locale: Locale, apiKey: string): Promise<PlacesResponse> => {
  const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=${locale}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri",
    },
  });
  if (!res.ok) throw new Error(`Places API ${res.status}`);
  return (await res.json()) as PlacesResponse;
});

let warned = false;

export async function getClubReviews(club: Club, locale: Locale): Promise<ClubReviews> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = placeIds[club.slug];
  const placeholder = { status: "placeholder", mapsUri: mapsSearch(club) } as const;
  if (!apiKey || !placeId) return placeholder;

  try {
    const place = await fetchPlace(placeId, locale, apiKey);
    if (typeof place.rating !== "number" || !place.userRatingCount) return placeholder;
    const reviews = (place.reviews ?? [])
      .map((r): GoogleReview | undefined => {
        // Text as delivered by Google (translated into the requested language when Google translates it).
        const text = r.text?.text ?? r.originalText?.text;
        const author = r.authorAttribution?.displayName;
        if (!text || !author || typeof r.rating !== "number") return undefined;
        return {
          author,
          authorUri: r.authorAttribution?.uri,
          authorPhotoUri: r.authorAttribution?.photoUri,
          rating: r.rating,
          text,
          relativeTime: r.relativePublishTimeDescription ?? "",
          publishTime: r.publishTime,
          mapsUri: r.googleMapsUri,
        };
      })
      .filter((r) => r !== undefined)
      .slice(0, 5);
    return { status: "live", rating: place.rating, count: place.userRatingCount, mapsUri: place.googleMapsUri ?? mapsSearch(club), reviews };
  } catch (err) {
    if (!warned) console.warn(`[data] google reviews unavailable (${errorMessage(err)}) – showing placeholder.`);
    warned = true;
    return placeholder;
  }
}
