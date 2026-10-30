"use client";

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
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";

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
    // stays dark in the light theme: it sits on the photo heroes until scrolled
    <header data-theme="dark" className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
      <div
        className={cn(
          "mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 xl:gap-4 rounded-full border pl-5 pr-2 transition-all duration-500 md:h-[72px] md:pl-7",
          scrolled || open
            ? "border-fg/10 bg-canvas/80 shadow-elevated backdrop-blur-xl"
            : // light theme: no photo hero under every header → keep the dark pill readable on chalk
              "border-fg/15 bg-fg/[0.04] backdrop-blur-md [:root[data-theme=light]_&]:bg-canvas/85",
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
                  <NavLink href={target} active={active}>
                    {t.nav[key]}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitch pathname={pathname} current={locale} label={t.header.language} className="hidden md:flex" />
          <ThemeToggle labels={{ toLight: t.header.themeToLight, toDark: t.header.themeToDark }} className="hidden md:grid" />
          <div className="hidden md:block">
            <Button href={href(locale, "app")} size="md" data-track="header_cta">
              {t.header.cta}
            </Button>
          </div>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-12 place-items-center rounded-full bg-fg text-fg-inverse lg:hidden"
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
