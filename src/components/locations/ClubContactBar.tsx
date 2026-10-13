// Contentful module: clubContact (club → contact entry: club manager name, email, phone; + proposed field whatsappGroupUrl)
import { Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import type { Club } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { locationsContent } from "@/lib/content/locations";
import { googleMapsRoute } from "./geo";

/**
 * Club contact at a glance – address, club manager (email), phone and the club's WhatsApp group.
 * Sits above the section tabs. Missing values are shown as "folgt"/"tbc", never invented.
 */
export function ClubContactBar({ club, locale }: { club: Club; locale: Locale }) {
  const t = locationsContent[locale].club.contactBar;
  const a = club.address;
  const c = club.contact;
  const tile =
    "group flex min-h-[112px] flex-col gap-1.5 rounded-[20px] border border-white/12 bg-ink-700 p-5 transition-colors";
  const link = "hover:border-white/40 focus-visible:border-white";
  const label = "flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-white/75";
  const value = "font-semibold leading-snug text-white group-hover:text-magenta-300";
  const pending = <span className="text-white/70">{t.pending}</span>;

  return (
    <section id="contact" aria-label={t.label} className="scroll-mt-44">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <li>
          <a href={googleMapsRoute(club.position)} target="_blank" rel="noopener noreferrer" className={`${tile} ${link}`} data-track="club_route_click">
            <span className={label}>
              <MapPin className="size-4 text-white" aria-hidden /> {t.address}
            </span>
            <span className={value}>
              {a.streetName} {a.buildingNumber}
              <br />
              {a.postalCode} {a.localityName}
            </span>
            <span className="mt-auto inline-flex items-center gap-1.5 text-sm text-white/75 group-hover:text-white">
              <Navigation className="size-3.5" aria-hidden /> {t.route}
            </span>
          </a>
        </li>
        <li>
          {c?.emailAddress ? (
            <a href={`mailto:${c.emailAddress}`} className={`${tile} ${link}`} data-track="club_email_click">
              <span className={label}>
                <Mail className="size-4 text-white" aria-hidden /> {t.manager}
              </span>
              {c.name && <span className="text-white/85">{c.name}</span>}
              <span className={`${value} break-all`}>{c.emailAddress}</span>
            </a>
          ) : (
            <div className={tile}>
              <span className={label}>
                <Mail className="size-4 text-white" aria-hidden /> {t.manager}
              </span>
              {pending}
            </div>
          )}
        </li>
        <li>
          {c?.phoneNumber ? (
            <a href={`tel:${c.phoneNumber.replace(/[^\d+]/g, "")}`} className={`${tile} ${link}`} data-track="club_phone_click">
              <span className={label}>
                <Phone className="size-4 text-white" aria-hidden /> {t.phone}
              </span>
              <span className={value}>{c.phoneNumber}</span>
            </a>
          ) : (
            <div className={tile}>
              <span className={label}>
                <Phone className="size-4 text-white" aria-hidden /> {t.phone}
              </span>
              {pending}
            </div>
          )}
        </li>
        <li>
          {c?.whatsappGroupUrl ? (
            <a href={c.whatsappGroupUrl} target="_blank" rel="noopener noreferrer" className={`${tile} ${link}`} data-track="club_whatsapp_join">
              <span className={label}>
                <MessageCircle className="size-4 text-white" aria-hidden /> {t.whatsapp}
              </span>
              <span className={value}>{t.whatsappJoin}</span>
              <span className="mt-auto text-sm text-white/75">{t.whatsappText}</span>
            </a>
          ) : (
            <div className={tile}>
              <span className={label}>
                <MessageCircle className="size-4 text-white" aria-hidden /> {t.whatsapp}
              </span>
              {pending}
              <span className="mt-auto text-sm text-white/70">{t.whatsappText}</span>
            </div>
          )}
        </li>
      </ul>
    </section>
  );
}
