import "server-only";
import type { Locale } from "../i18n/config";
import { absoluteHref, href } from "../i18n/routes";
import { faqContent, type FaqCategory } from "../content/faq";
import { errorMessage } from "./mappers";

/**
 * Public FAQ (the app's help centre) from api-platform, read at BUILD time.
 *
 *   GET {FAQ_API_URL}/faq/sections                → [{ id, title, icon, totalTopics }]
 *   GET {FAQ_API_URL}/faq/sections/{id}/topics    → [{ id, title, html, section }]
 *   Locale via `Accept-Language: de|en` (api-platform ContentfulLocaleService, falls back to EN).
 *   `^/faq` is PUBLIC_ACCESS in api-platform security.yaml – no token. Content = Contentful
 *   `frequentlyAskedQuestionSection` / `frequentlyAskedQuestions` (editorial content, NOT booking data).
 *
 * Any error, timeout or empty result → static fallback from src/lib/content/faq.ts (one console.warn per build).
 * `FAQ_SOURCE=static` skips the API (e.g. offline builds).
 */

export type FaqData = { source: "api" | "static"; categories: FaqCategory[] };

const API = (process.env.FAQ_API_URL ?? "https://api.prod.cluster.padelcity.de").replace(/\/+$/, "");
// The ingress rate-limits generic client user agents (e.g. Python-urllib → 429); identify the build explicitly.
const UA = "PadelCityWebsite-Build/1.0 (+https://www.padelcity.de)";

type ApiSection = { id: string; title: string; icon?: string; totalTopics?: number };
type ApiTopic = { id: string; title: string; html: string };

async function getJson<T>(path: string, locale: Locale): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { Accept: "application/json", "Accept-Language": locale, "User-Agent": UA },
    signal: AbortSignal.timeout(10_000),
    cache: "force-cache",
  });
  if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`);
  return (await res.json()) as T;
}

async function fetchApiFaq(locale: Locale): Promise<FaqCategory[]> {
  const sections = await getJson<ApiSection[]>("/faq/sections", locale);
  if (!Array.isArray(sections)) throw new Error("unexpected /faq/sections shape");
  const categories: FaqCategory[] = [];
  // Sequential on purpose: ~11 small requests per locale, gentle on the production API.
  for (const s of sections) {
    const topics = await getJson<ApiTopic[]>(`/faq/sections/${encodeURIComponent(s.id)}/topics`, locale);
    const items = (Array.isArray(topics) ? topics : [])
      .filter((t) => t.title?.trim() && t.html?.trim())
      .map((t) => {
        const html = sanitizeHtml(t.html, locale);
        return { id: t.id, q: t.title.trim(), a: htmlToText(html), html };
      });
    if (items.length) categories.push({ id: s.id, title: s.title.trim(), icon: s.icon ?? "messageQuestionSquare", items });
  }
  return categories;
}

const memo = new Map<Locale, Promise<FaqData>>();
let warned = false;

/** FAQ for the /faq page: API (build time) → static fallback. */
export function getFaq(locale: Locale): Promise<FaqData> {
  let p = memo.get(locale);
  if (!p) {
    p = (async (): Promise<FaqData> => {
      if (process.env.FAQ_SOURCE !== "static") {
        try {
          const categories = await fetchApiFaq(locale);
          if (categories.length === 0) throw new Error("no FAQ entries");
          return { source: "api", categories };
        } catch (err) {
          if (!warned) console.warn(`[data] FAQ API unavailable (${errorMessage(err)}) – falling back to static FAQ.`);
          warned = true;
        }
      }
      return { source: "static", categories: faqContent[locale].categories };
    })();
    memo.set(locale, p);
  }
  return p;
}

/* ---------- HTML helpers (no dependency; input is our own Contentful rich text rendered by api-platform) ---------- */

const ALLOWED = new Set(["p", "br", "ul", "ol", "li", "strong", "b", "em", "i", "u", "a"]);

const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  auml: "ä", ouml: "ö", uuml: "ü", Auml: "Ä", Ouml: "Ö", Uuml: "Ü", szlig: "ß",
  eacute: "é", egrave: "è", aacute: "á", agrave: "à", ntilde: "ñ", ccedil: "ç",
  euro: "€", ndash: "–", mdash: "—", hellip: "…", bdquo: "„", ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’", sbquo: "‚",
  laquo: "«", raquo: "»", middot: "·", bull: "•", copy: "©", reg: "®", trade: "™", deg: "°", times: "×",
};

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e] ?? m;
  });
}

const escapeAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Rewrites links to the old site to the localized page of this site; keeps mailto/tel/https. */
function safeHref(raw: string, locale: Locale): { href: string; external: boolean } | undefined {
  const url = decodeEntities(raw).trim();
  if (/^(mailto|tel):/i.test(url)) return { href: url, external: false };
  if (!/^https?:\/\//i.test(url)) return undefined;
  try {
    const u = new URL(url);
    if (/(^|\.)padelcity\.de$/i.test(u.hostname) && /^\/(standorte|locations)\/?$/i.test(u.pathname)) {
      return { href: `${absoluteHref(locale, "locations")}/`, external: false };
    }
    return { href: u.toString(), external: true };
  } catch {
    return undefined;
  }
}

/** Allow-list sanitiser: drops scripts/styles and every tag/attribute not listed (links keep href only). */
export function sanitizeHtml(html: string, locale: Locale): string {
  return html
    .replace(/<(script|style|iframe|object|embed|template)[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?([a-z][a-z0-9]*)\b([^>]*)>/gi, (m, rawTag: string, attrs: string) => {
      const tag = rawTag.toLowerCase();
      if (!ALLOWED.has(tag)) return "";
      if (m.startsWith("</")) return tag === "br" ? "" : `</${tag}>`;
      if (tag !== "a") return `<${tag}>`;
      const hrefMatch = /\bhref\s*=\s*("([^"]*)"|'([^']*)')/i.exec(attrs);
      const link = hrefMatch ? safeHref(hrefMatch[2] ?? hrefMatch[3] ?? "", locale) : undefined;
      if (!link) return "<a>";
      return link.external
        ? `<a href="${escapeAttr(link.href)}" target="_blank" rel="noopener noreferrer">`
        : `<a href="${escapeAttr(link.href)}">`;
    })
    // Link text that is just the old site URL → readable path of this site's page.
    .replace(/(<a href="[^"]*">)(?:<u>)?https?:\/\/(?:www\.)?padelcity\.de\/(?:standorte|locations)\/?(?:<\/u>)?<\/a>/gi, (_, open: string) =>
      `${open}padelcity.de${href(locale, "locations")}</a>`,
    )
    .replace(/<p>(\s|&nbsp;)*<\/p>/gi, "")
    .trim();
}

export function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/(p|li)>/gi, " ")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/\s+/g, " ")
    .trim();
}
