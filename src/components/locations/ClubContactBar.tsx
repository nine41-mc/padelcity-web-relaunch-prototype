// Contentful module: clubContact (club → contact entry: club manager name, email, phone; + proposed field whatsappGroupUrl)
import { Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { Media } from "@/components/ui/Media";
import type { Club } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { locationsContent } from "@/lib/content/locations";

/**
 * Club contact at a glance right under the club name – address (jumps to the map section), club manager with
 * photo, phone and the club's WhatsApp group. Missing values are shown as "folgt"/"tbc", never invented.
 */
export function ClubContactBar({ club, locale, managerImage }: { club: Club; locale: Locale; managerImage?: string }) {
  const t = locationsContent[locale].club.contactBar;
  const a = club.address;
  const c = club.contact;
  const tile =
    "group flex h-full flex-col gap-1.5 rounded-[20px] border border-white/12 bg-ink-700 p-4 transition-colors sm:min-h-[112px] sm:p-5";
  const link = "hover:border-white/40 focus-visible:border-white";
  const label = "flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-white/75";
  const value = "font-semibold leading-snug text-white group-hover:text-magenta-300";
  const pending = <span className="text-white/70">{t.pending}</span>;

  return (
    <section id="contact" aria-label={t.label} className="scroll-mt-44">
      <ul className="grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
        <li>
          <a href="#directions" className={`${tile} ${link}`} data-track="club_route_click">
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
              <span className="flex items-center gap-3">
                {c.name && <ManagerAvatar name={c.name} image={managerImage} />}
                <span className="min-w-0">
                  {c.name && <span className="block text-white/85">{c.name}</span>}
                  {/* break only after the @, never inside the domain */}
                  <span className={`${value} block`}>
                    {c.emailAddress.split("@")[0]}@<wbr />
                    {c.emailAddress.split("@").slice(1).join("@")}
                  </span>
                </span>
              </span>
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
              <span className={value}>{formatPhone(c.phoneNumber)}</span>
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

/** Club manager photo (team photos from padelcity.de, matched by name), same size as the contact card on /franchise (80/96 px); initials when there is none. */
function ManagerAvatar({ name, image }: { name: string; image?: string }) {
  if (image) return <Media src={image} alt="" className="size-20 shrink-0 rounded-full md:size-24" imgClassName="object-[50%_20%]" sizes="96px" />;
  const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("");
  return (
    <span className="grid size-20 shrink-0 place-items-center rounded-full bg-brand-gradient text-2xl font-bold md:size-24" aria-hidden>
      {initials}
    </span>
  );
}

/**
 * "+4915117612294" → "+49 151 17612294". Contentful stores numbers unformatted; mobile prefixes (1xx) are
 * always 3 digits, landline area codes vary – those only get a space after the country code.
 */
function formatPhone(raw: string) {
  const n = raw.replace(/[^\d+]/g, "");
  const m = /^\+(49|43|48)(\d+)$/.exec(n);
  if (!m) return raw;
  const [, cc, rest] = m;
  return /^1/.test(rest) && cc === "49" ? `+${cc} ${rest.slice(0, 3)} ${rest.slice(3)}` : `+${cc} ${rest}`;
}
