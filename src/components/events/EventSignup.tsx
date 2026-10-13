import { Monitor, Smartphone } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { deeplinks, webApp } from "@/lib/site";
import { cn } from "../ui/cn";

/**
 * Event sign-up: two EQUAL options – web app (desktop icon) and PadelCity app (phone icon).
 * `relative z-10` keeps them clickable above stretched-link cards.
 */
export function EventSignup({
  eventId,
  locale,
  size = "md",
  showLabel = false,
  tone = "light",
  className,
}: {
  eventId: string;
  locale: Locale;
  size?: "sm" | "md" | "lg";
  /** Small "Anmelden" label above the buttons */
  showLabel?: boolean;
  /** light = white pills (on images/dark), glass = translucent pills */
  tone?: "light" | "glass";
  className?: string;
}) {
  const t = getDictionary(locale).eventCard;
  const btn = cn(
    "relative z-10 inline-flex items-center justify-center gap-2.5 rounded-full font-display italic uppercase leading-none tracking-wide transition-all",
    size === "sm" && "h-11 px-4 text-base",
    size === "md" && "h-12 px-5 text-lg",
    size === "lg" && "h-14 px-6 text-xl md:h-16 md:text-2xl",
    tone === "light"
      ? "bg-white text-ink-800 hover:shadow-glow"
      : "border-2 border-white/60 bg-white/5 text-white backdrop-blur hover:border-white hover:bg-white hover:text-ink-800",
  );
  const icon = size === "lg" ? "size-5 md:size-6" : "size-[1.1em]";
  return (
    <div className={cn("relative z-10", className)}>
      {showLabel && <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/85">{t.signupLabel}</p>}
      <div className="grid grid-cols-2 gap-2.5">
        <a href={webApp.event(eventId)} target="_blank" rel="noopener noreferrer" aria-label={t.webAria} data-track="event_signup_web" className={btn}>
          <Monitor className={cn(icon, "shrink-0")} aria-hidden />
          {t.web}
        </a>
        <a href={deeplinks.event(eventId)} aria-label={t.appAria} data-track="event_signup_app" className={btn}>
          <Smartphone className={cn(icon, "shrink-0")} aria-hidden />
          {t.app}
        </a>
      </div>
    </div>
  );
}
