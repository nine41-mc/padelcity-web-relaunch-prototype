import Link from "next/link";
import { claimLang } from "@/lib/i18n/claims";
import { Facebook, Instagram, Linkedin, MessageCircle, Youtube } from "lucide-react";
import { legalNav, mainNav, secondaryNav, site } from "@/lib/site";
import { asset } from "@/lib/asset";
import type { Locale } from "@/lib/i18n/config";
import { href, type RouteKey } from "@/lib/i18n/routes";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { NewsletterSignup } from "../modules/NewsletterSignup";
import { Accent } from "../ui/Headline";
import { Marquee } from "../ui/Marquee";
import { WhatsAppGroups } from "../community/WhatsAppGroups";
import { whatsappGroupCount } from "@/lib/content/whatsapp";

function TikTok({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v2.6c-1.4.1-2.6-.3-3.9-1.1v5.4c0 6.9-7.5 9-10.5 4.1-1.9-3.2-.7-8.7 5.5-8.9v2.8c-.5.1-1 .2-1.4.4-1.4.5-2.2 1.4-2 3 .4 3 6 3.9 5.5-2V3h2.9z" />
    </svg>
  );
}

/** Optic Yellow padel ball – the brand's single accent object. */
function PadelBall({ className, id = "ballShade" }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#e3fb9c" />
          <stop offset="0.55" stopColor="#dfff4f" />
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
    // Order as on padelcity.de: LinkedIn, Facebook, Instagram, YouTube, TikTok
    { href: site.social.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: site.social.facebook, icon: Facebook, label: "Facebook" },
    { href: site.social.instagram, icon: Instagram, label: "Instagram" },
    { href: site.social.youtube, icon: Youtube, label: "YouTube" },
    { href: site.social.tiktok, icon: TikTok, label: "TikTok" },
  ];

  return (
    <footer className="relative isolate overflow-hidden bg-black">
      {/* Facts ticker – Optic Yellow band as the hand-over from page to footer */}
      <div className="relative z-10 flex h-14 items-center overflow-hidden bg-optic-500 text-ink-800 md:h-16" lang={locale}>
        <Marquee>
          {[...t.footer.facts, "#bettertogether", "Let's play Padel"].map((item) => (
            <span key={item} lang={claimLang(item)} className="flex items-center gap-8 px-4 font-display text-xl font-extrabold italic uppercase md:text-2xl">
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
        {/* Hero row: claim + ball | newsletter */}
        <div className="grid items-start gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div className="relative">
            <PadelBall id={`ballShade-${locale}`} className="absolute -top-6 right-0 size-20 rotate-12 drop-shadow-[0_12px_30px_rgba(223,255,79,0.45)] motion-safe:animate-[ball-bob_3.2s_ease-in-out_infinite] md:-top-10 md:size-28 lg:right-6" />
            <p className="max-w-[12ch] font-display text-6xl leading-[0.86] font-extrabold italic uppercase text-balance md:text-8xl lg:text-[7.5rem]">
              {t.footer.claim1} <Accent>{t.footer.claimAccent}</Accent> {t.footer.claim2}
            </p>

          </div>

          {/* Newsletter stands on its own */}
          <NewsletterSignup locale={locale} className="border-white/15 bg-ink-800/70 backdrop-blur-xl lg:mt-6" />
        </div>

        {/* WhatsApp community – full-width band, opens the overlay with every location's group */}
        <div className="relative mt-16 overflow-hidden rounded-[32px] bg-brandbook-gradient p-6 md:mt-20 md:p-10 lg:p-12">
          <div className="absolute inset-0 bg-court-lines opacity-60" aria-hidden />
          <div className="relative grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/85">
                <MessageCircle className="size-4 text-white" aria-hidden /> {t.footer.community.eyebrow(whatsappGroupCount)}
              </p>
              <p lang={claimLang(t.footer.community.title)} className="mt-4 font-display text-5xl leading-[0.9] font-extrabold italic uppercase md:text-6xl lg:text-7xl">
                {t.footer.community.title} <Accent>{t.footer.community.accent}</Accent>
              </p>
              <p className="mt-4 max-w-xl text-white/85 md:text-lg">{t.footer.community.text}</p>
            </div>
            <WhatsAppGroups locale={locale} label={t.footer.community.cta} variant="primary" size="lg" className="w-full md:w-auto" track="footer_whatsapp_overlay" />
          </div>
        </div>

        {/* Link columns */}
        <div className="mt-20 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-white/12 pt-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <p lang="en" className="font-display text-4xl font-extrabold italic uppercase leading-[0.95] md:text-5xl">
              Fall in love with <Accent>padel.</Accent>
            </p>
            <h2 lang={claimLang(t.footer.follow)} className="mt-6 font-display text-xl font-extrabold italic uppercase tracking-wide text-white/85">{t.footer.follow}</h2>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label={t.footer.follow}>
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
          <FooterCol title={t.footer.company} keys={[...secondaryNav, "sitemap", "contentModel"]} locale={locale} />
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
          <Link href={href(locale, "styleguide")} className="inline-flex min-h-11 w-fit items-center hover:text-white/75" data-track="footer_styleguide_easteregg">
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
