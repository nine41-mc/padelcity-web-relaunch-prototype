import Link from "next/link";
import { ArrowUpRight, Instagram, Linkedin, MessageCircle, Youtube } from "lucide-react";
import { legalNav, mainNav, secondaryNav, site } from "@/lib/site";
import { asset } from "@/lib/asset";
import type { Locale } from "@/lib/i18n/config";
import { href, type RouteKey } from "@/lib/i18n/routes";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { NewsletterSignup } from "../modules/NewsletterSignup";
import { Accent } from "../ui/Headline";
import { Marquee } from "../ui/Marquee";

function TikTok({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v2.6c-1.4.1-2.6-.3-3.9-1.1v5.4c0 6.9-7.5 9-10.5 4.1-1.9-3.2-.7-8.7 5.5-8.9v2.8c-.5.1-1 .2-1.4.4-1.4.5-2.2 1.4-2 3 .4 3 6 3.9 5.5-2V3h2.9z" />
    </svg>
  );
}

/** Neon padel ball – the brand's single accent object. */
function PadelBall({ className, id = "ballShade" }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#e3fb9c" />
          <stop offset="0.55" stopColor="#b4e854" />
          <stop offset="1" stopColor="#6f9a24" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#${id})`} />
      <path d="M12 26c18 10 18 38 0 48M88 26c-18 10-18 38 0 48" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const socials = [
    { href: site.social.instagram, icon: Instagram, label: "Instagram" },
    { href: site.social.tiktok, icon: TikTok, label: "TikTok" },
    { href: site.social.youtube, icon: Youtube, label: "YouTube" },
    { href: site.social.linkedin, icon: Linkedin, label: "LinkedIn" },
  ];

  return (
    <footer className="relative isolate overflow-hidden bg-black">
      {/* Facts ticker – neon band as the hand-over from page to footer */}
      <div className="relative z-10 flex h-14 items-center overflow-hidden bg-neon-500 text-ink-800 md:h-16" lang={locale}>
        <Marquee>
          {[...t.footer.facts, "#bettertogether", "Let's play Padel"].map((item) => (
            <span key={item} className="flex items-center gap-8 px-4 font-display text-xl font-extrabold italic uppercase md:text-2xl">
              {item} <span className="text-purple-600" aria-hidden>●</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* Atmosphere: purple glow + court lines */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute -left-40 top-10 size-[640px] rounded-full bg-purple-600/35 blur-[140px]" />
        <div className="absolute -right-40 bottom-40 size-[520px] rounded-full bg-magenta-500/25 blur-[140px]" />
        <div className="absolute inset-0 bg-court-lines opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />
      </div>

      <div className="container-site relative pt-20 md:pt-28">
        {/* Hero row: claim + ball + app/community | newsletter */}
        <div className="grid items-start gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div className="relative">
            <PadelBall id={`ballShade-${locale}`} className="absolute -top-6 right-0 size-20 rotate-12 drop-shadow-[0_12px_30px_rgba(180,232,84,0.45)] motion-safe:animate-[ball-bob_3.2s_ease-in-out_infinite] md:-top-10 md:size-28 lg:right-6" />
            <p className="max-w-[12ch] font-display text-6xl leading-[0.86] font-extrabold italic uppercase text-balance md:text-8xl lg:text-[7.5rem]">
              {t.footer.claim1} <Accent>{t.footer.claimAccent}</Accent> {t.footer.claim2}
            </p>

            {/* App-store card removed (PadelCity, 15.10.2026) – the WhatsApp card stays on its own. */}
            <div className="mt-10 max-w-md">
              <Link
                href={href(locale, "locations")}
                data-track="footer_whatsapp_club"
                className="group flex flex-col justify-between rounded-[24px] border border-white/12 bg-white/[0.04] p-5 backdrop-blur transition-colors hover:border-white/40"
              >
                <span className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-white/85">
                  <MessageCircle className="size-4 text-white" aria-hidden /> WhatsApp
                </span>
                <span className="mt-3 flex items-end justify-between gap-3">
                  <span className="font-display text-2xl font-extrabold italic uppercase leading-none group-hover:text-magenta-300">{t.footer.whatsapp}</span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 transition-all group-hover:rotate-45 group-hover:bg-brand-gradient group-hover:text-white">
                    <ArrowUpRight className="size-5" aria-hidden />
                  </span>
                </span>
              </Link>
            </div>
          </div>

          <NewsletterSignup locale={locale} className="border-white/15 bg-ink-800/70 backdrop-blur-xl lg:mt-6" />
        </div>

        {/* Link columns */}
        <div className="mt-20 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-white/12 pt-12 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="max-w-xs text-sm leading-relaxed text-white/80">{t.footer.about}</p>
            <ul className="mt-6 flex gap-2" aria-label={t.footer.follow}>
              {socials.map(({ href: url, icon: I, label }) => (
                <li key={label}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid size-12 place-items-center rounded-full border border-white/25 transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-ink-800"
                  >
                    <I className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <FooterCol title={t.footer.play} keys={mainNav} locale={locale} />
          <FooterCol title={t.footer.company} keys={[...secondaryNav, "sitemap"]} locale={locale} />
          <div>
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/75">{t.footer.findClub}</h2>
            <Link
              href={href(locale, "locations")}
              className="group mt-4 inline-flex items-center gap-3 font-display text-3xl font-extrabold italic uppercase leading-none hover:text-magenta-300"
            >
              {t.nav.locations}
              <span className="grid size-9 place-items-center rounded-full bg-brand-gradient text-white transition-transform group-hover:rotate-45">
                <ArrowUpRight className="size-4" aria-hidden />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Giant logotype – cropped by the bottom edge */}
      <div className="pointer-events-none relative mt-16 select-none md:mt-20" aria-hidden>
        <div className="container-site">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/brand/logo-white-line.svg")}
            alt=""
            width={598}
            height={122}
            className="w-full translate-y-[18%] opacity-[0.12] [mask-image:linear-gradient(to_bottom,black_35%,transparent_95%)]"
          />
        </div>
      </div>

      {/* Legal bar */}
      <div className="relative border-t border-white/12 bg-black/80 backdrop-blur">
        <div className="container-site flex flex-col gap-4 py-6 text-sm text-white/75 md:flex-row md:items-center md:justify-between">
          {/* Easter egg: the © line opens the hidden styleguide (no visual hint on purpose). */}
          <Link href={href(locale, "styleguide")} className="w-fit hover:text-white/75" data-track="footer_styleguide_easteregg">
            © {new Date().getFullYear()} The Padel City GmbH · München
          </Link>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalNav.map((key) => (
              <li key={key}>
                <Link href={href(locale, key)} className="inline-flex min-h-11 items-center hover:text-white">
                  {t.nav[key]}
                </Link>
              </li>
            ))}
            <li>
              <a href="#cookies" className="inline-flex min-h-11 items-center hover:text-white">
                {t.footer.cookies}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, keys, locale }: { title: string; keys: RouteKey[]; locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <div>
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/75">{title}</h2>
      <ul className="mt-4 space-y-1">
        {keys.map((key) => (
          <li key={key}>
            <Link href={href(locale, key)} className="group inline-flex min-h-9 items-center gap-2 text-base text-white/85 transition-colors hover:text-white">
              <span className="h-px w-0 bg-brand-gradient transition-all duration-300 group-hover:w-4" aria-hidden />
              {t.nav[key]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
