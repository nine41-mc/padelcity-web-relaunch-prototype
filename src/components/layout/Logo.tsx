import Link from "next/link";
import { cn } from "../ui/cn";
import { asset } from "@/lib/asset";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * Official PadelCity logotype (website_relaunch/Logo-svg, white versions for dark backgrounds).
 * Rendered as a plain <img> so the vector is never rasterised or resampled.
 * - "line": one-line logotype (header) – larger letter height at small sizes
 * - "stacked": two-line logotype (footer, large placements)
 */
const files = {
  line: { src: "/brand/logo-white-line.svg", w: 598, h: 122 },
  stacked: { src: "/brand/logo-white-stacked.svg", w: 598, h: 311 },
} as const;

export function Logo({
  className,
  locale = "de",
  variant = "line",
}: {
  className?: string;
  locale?: Locale;
  variant?: keyof typeof files;
}) {
  const f = files[variant];
  return (
    <Link href={href(locale, "home")} aria-label={getDictionary(locale).header.home} className={cn("inline-flex shrink-0 items-center", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(f.src)} alt="PadelCity" width={f.w} height={f.h} className="h-full w-auto" decoding="async" />
    </Link>
  );
}
