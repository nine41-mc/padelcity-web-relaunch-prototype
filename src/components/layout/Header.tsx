"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { mainNav } from "@/lib/site";
import { href, localeFromPath } from "@/lib/i18n/routes";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Button } from "../ui/Button";
import { cn } from "../ui/cn";
import { Logo } from "./Logo";
import { LanguageSwitch } from "./LanguageSwitch";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const pathname = usePathname() ?? "/";
  const locale = localeFromPath(pathname);
  const t = getDictionary(locale);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    // The menu covers the page: make page content inert so Tab stays in header + menu (WCAG 2.4.11/2.4.3).
    const covered = Array.from(document.querySelectorAll<HTMLElement>("body > main, body > footer, body > div:has(> footer)"));
    covered.forEach((el) => (el.inert = true));
    // Esc closes the mobile menu (keyboard users) and returns focus to the toggle
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      covered.forEach((el) => (el.inert = false));
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
      <div
        className={cn(
          "mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 xl:gap-4 rounded-full border pl-5 pr-2 transition-all duration-500 md:h-[72px] md:pl-7",
          scrolled || open
            ? "border-white/10 bg-ink-800/80 shadow-elevated backdrop-blur-xl"
            : "border-white/15 bg-white/[0.04] backdrop-blur-md",
        )}
      >
        <Logo className="h-6 md:h-7 lg:h-8" locale={locale} />

        <nav aria-label={t.header.mainNav} className="hidden lg:block">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {mainNav.map((key) => {
              const target = href(locale, key);
              const active = pathname.startsWith(target);
              return (
                <li key={key}>
                  <Link
                    href={target}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-2.5 py-2 text-[15px] font-semibold uppercase tracking-[0.06em] transition-colors xl:px-4 xl:text-base",
                      active ? "text-white" : "text-white/85 hover:text-white",
                    )}
                  >
                    {t.nav[key]}
                    {active && <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brand-gradient" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitch pathname={pathname} current={locale} label={t.header.language} className="hidden md:flex" />
          <div className="hidden md:block">
            <Button href={href(locale, "app")} size="md" data-track="header_cta">
              {t.header.cta}
            </Button>
          </div>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-12 place-items-center rounded-full bg-white text-ink-800 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.header.menuClose : t.header.menuOpen}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <MobileMenu open={open} locale={locale} pathname={pathname} />
    </header>
  );
}
