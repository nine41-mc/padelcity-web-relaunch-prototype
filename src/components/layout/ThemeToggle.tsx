"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { applyTheme, storedTheme, systemTheme, type Theme } from "@/lib/theme";

/**
 * Round button that switches between light and dark (header, mobile menu). The icon shows the mode it switches to.
 * The choice is stored; until then the page follows the system setting (see src/lib/theme.ts).
 */
export function ThemeToggle({ labels, className }: { labels: { toLight: string; toDark: string }; className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // React may drop attributes the pre-paint script set on <html> → re-apply, then follow the system until a choice is stored
    const initial = storedTheme() ?? systemTheme();
    applyTheme(initial, false);
    setTheme(initial);
    const mq = matchMedia("(prefers-color-scheme: light)");
    const onSystem = () => {
      if (storedTheme()) return;
      const next: Theme = mq.matches ? "light" : "dark";
      applyTheme(next, false);
      setTheme(next);
    };
    mq.addEventListener("change", onSystem);
    return () => mq.removeEventListener("change", onSystem);
  }, []);

  const next: Theme = theme === "light" ? "dark" : "light";
  const label = next === "light" ? labels.toLight : labels.toDark;
  const Icon = next === "light" ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next, true);
        setTheme(next);
      }}
      aria-label={label}
      title={label}
      className={cn("grid size-11 shrink-0 place-items-center rounded-full border border-fg/15 text-fg transition-colors hover:border-fg hover:bg-fg/10", className)}
      data-track="theme_toggle"
    >
      <Icon className="size-[18px]" aria-hidden />
    </button>
  );
}
