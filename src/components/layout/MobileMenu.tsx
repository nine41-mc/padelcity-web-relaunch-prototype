"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { mainNav, secondaryNav } from "@/lib/site";
import { Button } from "../ui/Button";
import { StoreBadges } from "../ui/StoreBadges";
import { LanguageSwitch } from "./LanguageSwitch";

/**
 * Mobile menu (Figma: Mobile Menu) below lg – opened by the toggle in the Header, which also handles Esc, focus and
 * making the page inert. Main items in Poppins (Label/Nav Large), secondary links, "Club finden", store badges, language.
 */
export function MobileMenu({ open, locale, pathname }: { open: boolean; locale: Locale; pathname: string }) {
  const t = getDictionary(locale);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-x-3 top-[84px] bottom-3 overflow-y-auto rounded-[28px] border border-white/10 bg-ink-800/95 pad-panel backdrop-blur-xl md:inset-x-5 md:top-[100px] lg:hidden"
        >
          <nav aria-label={t.header.mobileNav}>
            <ul className="space-y-1">
              {mainNav.map((key, i) => (
                <motion.li key={key} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                  <Link
                    href={href(locale, key)}
                    aria-current={pathname.startsWith(href(locale, key)) ? "page" : undefined}
                    className="flex items-center justify-between gap-4 border-b border-white/10 py-4"
                  >
                    {/* same type as the desktop navigation (Poppins, uppercase, tracked) – Söhne stays reserved for headlines */}
                    <span className="text-[22px] font-semibold uppercase leading-tight tracking-[0.06em] md:text-2xl">{t.nav[key]}</span>
                    <span className="hidden text-sm text-white/70 md:inline">{t.navDescriptions[key]}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-white/70">
              {secondaryNav.map((key) => (
                <li key={key}>
                  <Link href={href(locale, key)} className="hover:text-white">
                    {t.nav[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-8 space-y-4">
            <Button href={href(locale, "locations")} variant="gradient" size="md" className="w-full justify-between">
              {t.header.findCourt}
            </Button>
            <StoreBadges locale={locale} />
            <LanguageSwitch pathname={pathname} current={locale} label={t.header.language} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
