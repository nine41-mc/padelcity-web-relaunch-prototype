import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

/** Prototype: no crawling (the pages are noindex too). TODO(launch): allow "/" and keep the sitemap line. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" }, sitemap: `${site.url}/sitemap.xml` };
}
