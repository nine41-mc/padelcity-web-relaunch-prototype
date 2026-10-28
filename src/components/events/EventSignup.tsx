import { Monitor, Smartphone } from "lucide-react";
import { asset } from "@/lib/asset";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { deeplinks, webApp } from "@/lib/site";
import { cn } from "../ui/cn";

/**
 * Event sign-up: the PadelCity app is the primary option (solid white), the web app the secondary one (outline).
 * `relative z-10` keeps them clickable above stretched-link cards.
 */
export function EventSignup({
  eventId,
  locale,
  size = "md",
  showLabel = false,
  className,
}: {
  eventId: string;
  locale: Locale;
  size?: "sm" | "md" | "lg";
  /** Small "Anmelden" label above the buttons */
  showLabel?: boolean;
  className?: string;
}) {
  const t = getDictionary(locale).eventCard;
  const btn = cn(
    "relative z-10 inline-flex items-center justify-center gap-2.5 rounded-full font-display italic uppercase leading-none tracking-wide transition-all",
    size === "sm" && "h-11 px-4 text-base",
    size === "md" && "h-12 px-5 text-lg",
    size === "lg" && "h-14 px-6 text-xl md:h-16 md:text-2xl",
  );
  const primary = "bg-white text-ink-800 hover:shadow-glow";
  const secondary = "border-2 border-white/60 bg-white/5 text-white backdrop-blur hover:border-white hover:bg-white hover:text-ink-800";
  const icon = size === "lg" ? "size-5 md:size-6" : "size-[1.1em]";
  return (
    <div className={cn("relative z-10", className)}>
      {showLabel && <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/85">{t.signupLabel}</p>}
      <div className="grid grid-cols-2 gap-2.5">
        <a {...linkProps(deeplinks.event(eventId))} aria-label={t.appAria} data-track="event_signup_app" className={cn(btn, primary)}>
          <Smartphone className={cn(icon, "shrink-0")} aria-hidden />
          {t.app}
        </a>
        <a {...linkProps(webApp.event(eventId))} aria-label={t.webAria} data-track="event_signup_web" className={cn(btn, secondary)}>
          <Monitor className={cn(icon, "shrink-0")} aria-hidden />
          {t.web}
        </a>
      </div>
    </div>
  );
}

/** Internal targets (the "Coming soon" page while app links aren't live) need the basePath and open in the same tab. */
function linkProps(url: string) {
  return url.startsWith("/") ? { href: asset(url.endsWith("/") ? url : `${url}/`) } : { href: url, target: "_blank", rel: "noopener noreferrer" };
}
