/**
 * App club IDs (api-platform `club.id`) for the club deep links, keyed by the website's club slug, plus the
 * `utm_campaign` each club page has used so far (kept so reporting stays comparable). Source: the club-link
 * regeneration after the switch from Adjust to link.padelcity.de (29.10.2026). The website only knows the
 * Contentful entry id; api-platform stores it as `club.contentful_id` but exposes it to signed-in players only.
 */
export const appClubs: Record<string, readonly [id: string, campaign: string]> = {
  "andernach": ["37abfc14-a289-4372-9222-0ae8427cdc1d", "andernach-page"],
  "berlin": ["aa54da8b-8b92-43a8-b6f4-2548819d6e40", "berlin-page"],
  "bielefeld": ["05bcb523-01dd-47fe-acdc-7011d41f494e", "bielefeld-page"],
  "cadolzburg": ["7c8b0481-893e-4f8e-bb49-59c9b5393ce4", "cadolzburg-page"],
  "dortmund": ["76f609cb-6da8-4baa-a539-76c4cc984985", "dortmund-page"],
  "duesseldorf": ["32a82278-66e8-4848-840f-eb04dcf70b5f", "duesseldorf-page"],
  "erding": ["dc714430-5874-4e46-9be0-0abbd656fefe", "erding-page"],
  "erlangen": ["4a0b68d3-cd4c-4d11-a428-9551915a3673", "erlangen-page"],
  "frankfurt": ["26e6c1be-c225-4e0a-8d95-46a104228594", "frankfurt-page"],
  "fuerth": ["a83f4fe0-0297-4018-8c1a-cd0cf2b747f7", "fuerth-page"],
  "gelsenkirchen": ["0d0c74bc-37e2-4a33-a9a1-f847c98d9f27", "gelsenkirchen-page"],
  "heilsbronn": ["2f3b2129-c996-49b6-bab8-7217e92cdde4", "heilsbronn-page"],
  "ingolstadt": ["b5d6eb05-3194-415a-9b99-a25dbaf81256", "ingolstadt-page"],
  "innsbruck": ["d9262ada-8b9a-48e4-b8f6-8054dd90abdd", "innsbruck-page"],
  "jena": ["bbeb55f3-9361-45db-aba4-25ea19fa9334", "jena-page"],
  "karlsruhe": ["20acbeb0-800a-4ffe-ab9c-b4fe8b865a4c", "karlsruhe-page"],
  "krakau": ["9243eaa4-148d-4602-ba0c-2378f37b3361", "krakow-page"],
  "leipzig-leutzsch": ["610678db-984b-4f6f-b7d6-7081d3739870", "leipzig-page"],
  "leipzig-plagwitz": ["864120f2-8dbe-4573-bcc7-809a63edce8a", "leipzig-plagwitz-page"],
  "lingen": ["262c865e-67d6-42ce-867b-b4042355d7f1", "lingen-page"],
  "marburg": ["a09689e3-3a2c-4be3-9d3e-e53d076158ce", "marburg-page"],
  "muelheim-kaerlich": ["16c32878-085f-4c0d-906c-d7f3b14d5a58", "muelheim-kaerlich-page"],
  "muenchen-frankfurter-ring": ["d45e0d7b-8dd6-44c2-be30-36b35b313652", "muenchen-frankfurter-ring-page"],
  "muenchen-tucherpark": ["45b6d3dd-14a0-4ebc-aa86-dad1040ee4c6", "muenchen-tucherpark-page"],
  "neu-ulm": ["b8a33a64-39ce-4499-ae67-7efa441450e4", "neu-ulm-page"],
  "radolfzell": ["7350b156-ac21-4d90-9544-9e85958831be", "radolfzell-page"],
  "ravensburg": ["82e290f5-0c27-49c9-8e6f-bea69d0e086d", "ravensburg-page"],
  "recklinghausen": ["b0dd7633-e9ab-4232-ab17-128576a6c0b0", "recklinghausen-page"],
  "regensburg": ["3c35a061-8f91-40d0-98d9-d446bbcafecd", "regensburg-page"],
  "reutlingen": ["d1d8e90b-1bb0-471a-9587-0ea02f0fcd15", "reutlingen-page"],
  "rothenburg": ["bdfe4402-8fcf-4212-b176-8560df23fc4c", "rothenburg-page"],
  "schwabach": ["202a789d-fed4-48a9-9c89-48dca499bc2c", "schwabach-page"],
  "warschau": ["83866ed3-3911-41c3-ae6f-e601bdc87ec7", "warsaw-page"],
  "wetzlar": ["34fc19ac-746a-4de1-aac6-20fba722339f", "wetzlar-page"],
  "wiesbaden": ["1a9804c6-ef38-4894-93d8-5dbc30294789", "wiesbaden-page"],
};
