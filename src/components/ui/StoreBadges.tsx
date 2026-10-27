import Image from "next/image";
import { stores } from "@/lib/site";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cn } from "./cn";

// width/height = the SVGs' intrinsic size (221×74) so the reserved box matches before the files load (no wrap → no CLS).

export function StoreBadges({ className, locale = "de", size = "md" }: { className?: string; locale?: Locale; size?: "md" | "lg" }) {
  const t = getDictionary(locale).stores;
  const badge = size === "lg" ? "h-14 w-auto lg:h-16" : "h-12 w-auto";
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <a href={stores.ios} target="_blank" rel="noopener noreferrer" data-track="app_store_click" className="transition-transform hover:-translate-y-0.5">
        <Image src="/brand/appstore.svg" alt={t.ios} width={221} height={74} className={badge} />
      </a>
      <a href={stores.android} target="_blank" rel="noopener noreferrer" data-track="play_store_click" className="transition-transform hover:-translate-y-0.5">
        <Image src="/brand/playstore.svg" alt={t.android} width={221} height={74} className={badge} />
      </a>
    </div>
  );
}
