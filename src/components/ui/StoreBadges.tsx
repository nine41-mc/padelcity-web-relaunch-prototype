import Image from "next/image";
import { stores } from "@/lib/site";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cn } from "./cn";

export function StoreBadges({ className, locale = "de" }: { className?: string; locale?: Locale }) {
  const t = getDictionary(locale).stores;
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <a href={stores.ios} target="_blank" rel="noopener noreferrer" data-track="app_store_click" className="transition-transform hover:-translate-y-0.5">
        <Image src="/brand/appstore.svg" alt={t.ios} width={150} height={50} className="h-12 w-auto" />
      </a>
      <a href={stores.android} target="_blank" rel="noopener noreferrer" data-track="play_store_click" className="transition-transform hover:-translate-y-0.5">
        <Image src="/brand/playstore.svg" alt={t.android} width={168} height={50} className="h-12 w-auto" />
      </a>
    </div>
  );
}
