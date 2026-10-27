"use client";

import { useId, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../ui/cn";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * Newsletter module (Contentful module "newsletterSignup").
 * Prototype only: no data is sent anywhere. Real target (e.g. HubSpot / Brevo) + double opt-in TBD.
 */
export function NewsletterSignup({ locale = "de", id, className }: { locale?: Locale; id?: string; className?: string }) {
  const t = getDictionary(locale).newsletter;
  const [done, setDone] = useState(false);
  const inputId = useId();
  return (
    <div id={id} className={cn("scroll-mt-28 rounded-[28px] border border-white/10 bg-white/[0.03] pad-banner", className)}>
      <h3 className="font-display text-3xl font-extrabold italic uppercase md:text-4xl">{t.title}</h3>
      <p className="mt-2 max-w-md text-white/70">{t.text}</p>
      {done ? (
        <p ref={(el) => el?.focus()} tabIndex={-1} className="mt-6 flex items-center gap-3 text-optic-500 outline-none" role="status">
          <span className="grid size-8 place-items-center rounded-full bg-optic-500 text-on-optic">
            <Check className="size-4" />
          </span>
          {t.success}
        </p>
      ) : (
        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <label htmlFor={inputId} className="sr-only">
            {t.label}
          </label>
          <input
            id={inputId}
            type="email"
            required
            placeholder={t.placeholder}
            className="h-13 shrink-0 rounded-full border border-white/45 bg-black/40 px-5 sm:flex-1 text-white placeholder:text-white/60 focus:border-optic-500 focus:outline-none focus:ring-2 focus:ring-optic-500/50"
          />
          <Button type="submit" variant="optic" data-track="newsletter_submit">
            {t.submit}
          </Button>
        </form>
      )}
      <p className="mt-3 text-sm text-white/70">{t.legal}</p>
    </div>
  );
}
