"use client";

/**
 * Global next/image loader (static export has no image optimizer).
 * - Local files: prefix basePath (GitLab Pages sub-path).
 * - Contentful assets: let the Images API resize (w, fm=webp).
 */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.includes("images.ctfassets.net")) {
    const url = new URL(src.startsWith("//") ? `https:${src}` : src);
    url.searchParams.set("w", String(Math.min(width, 2400)));
    url.searchParams.set("fm", "webp");
    url.searchParams.set("q", String(quality ?? 75));
    return url.toString();
  }
  if (src.startsWith("/")) return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}`;
  return src;
}
