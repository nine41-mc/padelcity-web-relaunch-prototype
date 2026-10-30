import Link from "next/link";
import { localeTags, locales, type Locale } from "@/lib/i18n/config";
import { switchLocalePath } from "@/lib/i18n/routes";
import { cn } from "../ui/cn";

/**
 * Language switch (Figma: Language Switch) – segmented DE / EN / PL, the active language in the brand gradient.
 * Each link leads to the same page in the other language.
 */
export function LanguageSwitch({ pathname, current, label, className }: { pathname: string; current: Locale; label: string; className?: string }) {
  return (
    <div role="group" aria-label={label} className={cn("flex h-13 items-center gap-1 rounded-full border border-fg/25 px-1 text-sm font-semibold uppercase leading-none tracking-[0.06em]", className)}>
      {locales.map((l) => (
        <Link
          key={l}
          href={switchLocalePath(pathname, l)}
          hrefLang={localeTags[l].lang}
          lang={localeTags[l].lang}
          aria-current={l === current ? "true" : undefined}
          className={cn(
            "flex h-11 min-w-11 items-center justify-center rounded-full px-2.5 pt-px transition-colors",
            l === current ? "bg-brand-gradient text-white" : "text-fg/85 hover:text-fg",
          )}
        >
          {l}
          {/* WCAG 2.5.3: the accessible name contains the visible text ("de – Deutsch") */}
          <span className="sr-only"> – {localeTags[l].label}</span>
        </Link>
      ))}
    </div>
  );
}
