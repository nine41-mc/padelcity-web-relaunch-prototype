"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { brandStrings } from "./strings";
import { Button } from "../ui/Button";
import { Select } from "@/components/ui/Select";
import { cn } from "../ui/cn";

// Contentful module: leadForm (config: title, fields, consent text, success text, CRM target)

export type LeadField =
  | { name: string; label: string; type: "text" | "email" | "tel"; required?: boolean; autoComplete?: string; placeholder?: string; half?: boolean }
  | { name: string; label: string; type: "select"; options: string[]; required?: boolean; half?: boolean }
  | { name: string; label: string; type: "textarea"; required?: boolean; placeholder?: string };

/**
 * Generic B2B lead form (franchise, partner, corporate events).
 * PROTOTYPE: nothing is sent. Real target (HubSpot / CRM) + spam protection TBD.
 */
export function LeadForm({
  locale,
  fields,
  submitLabel,
  track,
  successTitle,
  successText,
  consentText,
  className,
}: {
  locale: Locale;
  fields: LeadField[];
  submitLabel: string;
  track: string;
  successTitle?: string;
  successText?: string;
  consentText?: string;
  className?: string;
}) {
  const t = brandStrings[locale].leadForm;
  const uid = useId();
  const [done, setDone] = useState(false);

  const inputCls =
    "w-full rounded-2xl border border-white/45 bg-black/40 px-4 text-white placeholder:text-white/60 transition-colors focus:border-optic-500 focus:outline-none focus:ring-2 focus:ring-optic-500/50";

  if (done) {
    return (
      <div
        ref={(el) => el?.focus()}
        tabIndex={-1}
        className={cn("rounded-[28px] border border-magenta-500/40 bg-magenta-500/[0.06] p-8 outline-none md:p-12", className)}
        role="status"
      >
        <span className="grid size-14 place-items-center rounded-full bg-brand-gradient text-white">
          <Check className="size-7" strokeWidth={3} aria-hidden />
        </span>
        <p className="mt-6 font-display text-4xl font-extrabold italic uppercase">{successTitle ?? t.successTitle}</p>
        <p className="mt-3 max-w-md text-white/75">{successText ?? t.successText}</p>
        <p className="mt-6 text-sm text-white/70">{t.prototype}</p>
      </div>
    );
  }

  return (
    <form
      className={cn("rounded-[28px] border border-white/10 bg-ink-700 p-6 md:p-10", className)}
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((f) => {
          const id = `${uid}-${f.name}`;
          const span = f.type === "textarea" || !f.half ? "md:col-span-2" : "";
          return (
            <div key={f.name} className={span}>
              <label htmlFor={id} className="mb-2 block text-sm font-medium text-white/80">
                {f.label}
                {f.required && <span className="text-magenta-300"> *</span>}
              </label>
              {f.type === "textarea" ? (
                <textarea id={id} name={f.name} required={f.required} rows={4} placeholder={f.placeholder} className={cn(inputCls, "py-3")} />
              ) : f.type === "select" ? (
                <FormSelect id={id} name={f.name} required={f.required} label={f.label} placeholder={t.choose} options={f.options} />
              ) : (
                <input id={id} name={f.name} type={f.type} required={f.required} autoComplete={f.autoComplete} placeholder={f.placeholder} className={cn(inputCls, "h-12")} />
              )}
            </div>
          );
        })}
      </div>
      <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-white/70">
        <input type="checkbox" required name="consent" className="size-6 shrink-0 accent-[#e005c3]" />
        <span>
          {consentText ?? t.consent}{" "}
          <Link href={href(locale, "privacy")} className="underline underline-offset-2 hover:text-white">
            {t.privacy}
          </Link>
          . <span className="text-magenta-300">*</span>
        </span>
      </label>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/70">{t.required}</p>
        <Button type="submit" variant="gradient" data-track={track}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

/** Branded select inside the (uncontrolled) lead form – keeps its own state, posts via hidden input. */
function FormSelect({ id, name, required, label, placeholder, options }: { id: string; name: string; required?: boolean; label: string; placeholder: string; options: string[] }) {
  const [value, setValue] = useState("");
  return (
    <Select
      id={id}
      name={name}
      required={required}
      label={label}
      placeholder={placeholder}
      size="lg"
      value={value}
      onChange={setValue}
      options={options.map((o) => ({ value: o, label: o }))}
    />
  );
}
