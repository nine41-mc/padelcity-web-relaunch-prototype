import Image from "next/image";
import type { Partner } from "@/lib/data/types";
import { cn } from "./cn";

/**
 * Intrinsic size of each logo file (viewBox / pixel size, assets cropped to their visible content).
 * Passed to next/image so width is reserved from the aspect ratio – no layout shift.
 */
const intrinsic: Record<string, { w: number; h: number }> = {
  "/brand/partners/cupra.svg": { w: 80, h: 52.68 },
  "/brand/partners/babo.svg": { w: 100, h: 15.7 },
  "/brand/partners/haier.svg": { w: 311, h: 96 },
  "/brand/partners/natural_elements.svg": { w: 1245.7, h: 837.2 },
  "/brand/partners/falke.svg": { w: 100, h: 26.38 },
  "/brand/partners/hanse_merkur.svg": { w: 90, h: 44 },
  "/brand/partners/decathlon.svg": { w: 1846.71, h: 277.51 },
  "/brand/partners/veltins.png": { w: 528, h: 115 },
  "/brand/partners/rituals.png": { w: 2262, h: 264 },
  "/brand/partners/coca_cola.png": { w: 1884, h: 1094 },
  "/brand/partners/langnese.png": { w: 2462, h: 1835 },
  "/brand/partners/cap_trader.svg": { w: 100, h: 22 },
  "/brand/partners/all_inclusive_fitness.png": { w: 870, h: 219 },
};

/**
 * Partner logo at a fixed visible HEIGHT (pass it via className, e.g. "h-9 md:h-10"); width follows the
 * logo's own aspect ratio, so every logo reads at the same height. No fixed-width boxes. Very wide
 * wordmarks (Rituals, Babolat) are only narrowed by `max-w-full` when their container is too small.
 */
export function PartnerLogo({ partner, className, sizes = "240px" }: { partner: Pick<Partner, "name" | "logo">; className?: string; sizes?: string }) {
  const dim = intrinsic[partner.logo] ?? { w: 300, h: 100 };
  // Scale to ~2× the largest rendered height so the raster logos stay sharp.
  const h = 128;
  const w = Math.round((dim.w / dim.h) * h);
  return (
    <Image
      src={partner.logo}
      alt={partner.name}
      width={w}
      height={h}
      sizes={sizes}
      style={{ aspectRatio: `${dim.w} / ${dim.h}` }}
      className={cn("partner-logo block w-auto max-w-full shrink-0 object-contain", className)}
    />
  );
}
