import Link from "next/link";
import { Instagram, Linkedin, Youtube, MessageCircle } from "lucide-react";
import { legalNav, mainNav, secondaryNav, site } from "@/lib/site";
import type { Locale } from "@/lib/i18n/config";
import { href, type RouteKey } from "@/lib/i18n/routes";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { StoreBadges } from "../ui/StoreBadges";
import { Logo } from "./Logo";
import { NewsletterSignup } from "../modules/NewsletterSignup";
import { Accent } from "../ui/Headline";

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black pt-20 pb-10">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[120%] -translate-x-1/2 rounded-full bg-purple-700/30 blur-[120px]" aria-hidden />
      <div className="container-site relative">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="font-display text-5xl leading-[0.9] font-extrabold italic uppercase md:text-7xl">
              {t.footer.claim1} <Accent>{t.footer.claimAccent}</Accent>
              <br /> {t.footer.claim2}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <StoreBadges locale={locale} />
              <a
                href={site.whatsappCommunity}
                target="_blank"
                rel="noopener noreferrer"
                data-track="whatsapp_join"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-medium hover:border-neon-500 hover:text-neon-500"
              >
                <MessageCircle className="size-4" /> {t.footer.whatsapp}
              </a>
            </div>
          </div>
          <NewsletterSignup locale={locale} />
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-12 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Logo className="h-16" locale={locale} variant="stacked" />
            <p className="mt-4 max-w-xs text-sm text-white/70">{t.footer.about}</p>
          </div>
          <FooterCol title={t.footer.play} keys={mainNav} locale={locale} />
          <FooterCol title={t.footer.company} keys={secondaryNav} locale={locale} />
          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">{t.footer.follow}</h4>
            <div className="mt-4 flex gap-2">
              {[
                { href: site.social.instagram, icon: Instagram, label: "Instagram" },
                { href: site.social.youtube, icon: Youtube, label: "YouTube" },
                { href: site.social.linkedin, icon: Linkedin, label: "LinkedIn" },
              ].map(({ href: url, icon: I, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-11 place-items-center rounded-full border border-white/15 transition-colors hover:border-neon-500 hover:text-neon-500"
                >
                  <I className="size-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} The Padel City GmbH · München</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalNav.map((key) => (
              <li key={key}>
                <Link href={href(locale, key)} className="hover:text-white">
                  {t.nav[key]}
                </Link>
              </li>
            ))}
            <li>
              <a href="#cookies" className="hover:text-white">
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
      <h4 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">{title}</h4>
      <ul className="mt-4 space-y-2.5 text-sm">
        {keys.map((key) => (
          <li key={key}>
            <Link href={href(locale, key)} className="text-white/80 hover:text-neon-500">
              {t.nav[key]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
