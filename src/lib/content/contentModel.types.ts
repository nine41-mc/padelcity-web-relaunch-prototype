/**
 * Content model of the website prototype: page types → modules → fields, each field with its data source.
 * Decision 15.10.2026: website-only content lives in a SECOND Contentful space (same account);
 * clubs, coaches, events etc. come from the existing API (public parts still to be defined).
 */
export type Source =
  /** already delivered by api-platform today (endpoint + field exist) */
  | "api"
  /** comes from the API, but the API has to be extended (field missing, not exposed or not public) */
  | "apiExtend"
  /** new Contentful space for website content */
  | "cms"
  /** third-party service (Personio, Google, YouTube, Instagram, app stores, link service …) */
  | "external"
  /** source not decided yet */
  | "unknown";

export type Field = {
  name: string;
  source: Source;
  /** endpoint / content type / service, e.g. "GET /clubs → courts[]" */
  ref?: string;
  note?: string;
};

export type Module = { name: string; id: string; text?: string; fields: Field[] };

export type PageType = {
  id: string;
  name: string;
  /** example path in the prototype */
  path: string;
  text?: string;
  modules: Module[];
};
