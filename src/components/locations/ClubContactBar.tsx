// Contentful module: clubContact (club → contact entry: club manager name, email, phone; + proposed field whatsappGroupUrl)
import type { LucideIcon } from "lucide-react";
import { Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { Media } from "@/components/ui/Media";
import type { Club } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { locationsContent } from "@/lib/content/locations";

type Tile = {
  key: string;
  label: string;
  media: React.ReactNode;
  value: React.ReactNode;
  action?: { label: string; icon: LucideIcon; href: string; external?: boolean; track: string };
  copy?: { value: string; label: string; track: string };
};

/**
 * Club contact right under the club name – four tiles with one anatomy: icon (photo for the club manager), label,
 * value, and a footer with one action (Route · Anrufen · E-Mail · Beitreten) plus a copy button, as on Google.
 * Missing values are shown as "folgt"/"tbc", never invented.
 */
export function ClubContactBar({ club, locale, managerImage }: { club: Club; locale: Locale; managerImage?: string }) {
  const t = locationsContent[locale].club.contactBar;
  const a = club.address;
  const c = club.contact;
  const address = `${a.streetName} ${a.buildingNumber}, ${a.postalCode} ${a.localityName}`;
  const tel = c?.phoneNumber ? `tel:${c.phoneNumber.replace(/[^\d+]/g, "")}` : undefined;
  const pending = <span className="font-normal text-white/60">{t.pending}</span>;
  const icon = (Icon: LucideIcon) => <Icon className="size-5" aria-hidden />;
  const tiles: Tile[] = [
    {
      key: "address",
      label: t.address,
      media: icon(MapPin),
      value: (
        <>
          {a.streetName} {a.buildingNumber}
          <br />
          {a.postalCode} {a.localityName}
        </>
      ),
      action: { label: t.route, icon: Navigation, href: "#directions", track: "club_route_click" },
      copy: { value: address, label: t.copyAddress, track: "club_address_copy" },
    },
    {
      key: "phone",
      label: t.phone,
      media: icon(Phone),
      value: c?.phoneNumber ? formatPhone(c.phoneNumber) : pending,
      action: tel ? { label: t.call, icon: Phone, href: tel, track: "club_phone_click" } : undefined,
      copy: c?.phoneNumber ? { value: c.phoneNumber, label: t.copyPhone, track: "club_phone_copy" } : undefined,
    },
    {
      key: "manager",
      label: t.manager,
      media: c?.name ? <ManagerAvatar name={c.name} image={managerImage} /> : icon(Mail),
      value: c?.emailAddress ? (
        <>
          {c.name && <span className="block font-normal text-white/80">{c.name}</span>}
          <span className="block break-all">{c.emailAddress}</span>
        </>
      ) : (
        pending
      ),
      action: c?.emailAddress ? { label: t.email, icon: Mail, href: `mailto:${c.emailAddress}`, track: "club_email_click" } : undefined,
      copy: c?.emailAddress ? { value: c.emailAddress, label: t.copyEmail, track: "club_email_copy" } : undefined,
    },
    {
      key: "whatsapp",
      label: t.whatsapp,
      media: icon(MessageCircle),
      value: c?.whatsappGroupUrl ? t.whatsappText : pending,
      action: c?.whatsappGroupUrl ? { label: t.join, icon: MessageCircle, href: c.whatsappGroupUrl, external: true, track: "club_whatsapp_join" } : undefined,
    },
  ];

  return (
    <section id="contact" aria-label={t.label} className="scroll-mt-44">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <li key={tile.key} className="flex flex-col rounded-[20px] border border-white/12 bg-ink-700 p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-white/[0.06]">{tile.media}</span>
              <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/70">{tile.label}</span>
            </div>
            <p className="mt-4 font-semibold leading-snug">{tile.value}</p>
            {/* every tile ends on the same line: one action, copy on the right */}
            {(tile.action || tile.copy) && (
              <div className="mt-auto flex items-center justify-between gap-2 pt-5">
                {tile.action ? (
                  <a
                    href={tile.action.href}
                    {...(tile.action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    data-track={tile.action.track}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 px-4 text-sm font-semibold transition hover:border-transparent hover:bg-brand-gradient"
                  >
                    <tile.action.icon className="size-4" aria-hidden /> {tile.action.label}
                  </a>
                ) : (
                  <span />
                )}
                {tile.copy && <CopyButton value={tile.copy.value} label={tile.copy.label} copiedLabel={t.copied} track={tile.copy.track} />}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Club manager photo in the icon slot (team photos from padelcity.de, matched by name); initials when there is none. */
function ManagerAvatar({ name, image }: { name: string; image?: string }) {
  if (image) return <Media src={image} alt="" className="size-11 shrink-0 rounded-full" imgClassName="object-[50%_20%]" sizes="44px" />;
  const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("");
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-gradient text-sm font-bold" aria-hidden>
      {initials}
    </span>
  );
}

/**
 * "+4915117612294" → "+49 151 17612294". Contentful stores numbers unformatted; mobile prefixes (1xx) are
 * always 3 digits, landline area codes vary – those only get a space after the country code.
 */
export function formatPhone(raw: string) {
  const n = raw.replace(/[^\d+]/g, "");
  const m = /^\+(49|43|48)(\d+)$/.exec(n);
  if (!m) return raw;
  const [, cc, rest] = m;
  return /^1/.test(rest) && cc === "49" ? `+${cc} ${rest.slice(0, 3)} ${rest.slice(3)}` : `+${cc} ${rest}`;
}
