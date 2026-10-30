"use client";

import { useId, useRef, useState } from "react";
import { Check } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { brandStrings } from "../brand/strings";
import { Button } from "../ui/Button";
import { cn } from "../ui/cn";
import { TextField, TextareaField } from "../forms/Field";
import { Consent } from "../forms/Consent";

export type RecurringBookingCopy = {
  title: string;
  text: string;
  open: string;
  club: string;
  days: { label: string; placeholder: string };
  time: { label: string; placeholder: string };
  courts: { label: string; placeholder: string };
  start: { label: string; placeholder: string };
  message: { label: string; placeholder: string };
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  optional: string;
  submit: string;
  errors: { summary: string; days: string; time: string; courts: string; firstName: string; lastName: string; email: string; consent: string };
  success: { title: string; text: string };
};

type Values = { days: string; time: string; courts: string; start: string; message: string; firstName: string; lastName: string; email: string; phone: string; consent: boolean };
type Required = "days" | "time" | "courts" | "firstName" | "lastName" | "email" | "consent";
const REQUIRED: Required[] = ["days", "time", "courts", "firstName", "lastName", "email", "consent"];

const invalid = (key: Required, v: Values) =>
  key === "consent" ? !v.consent : key === "email" ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()) : key === "courts" ? !/^\d+$/.test(v.courts.trim()) || Number(v.courts) < 1 : !v[key].trim();

/**
 * Request for a recurring booking (fixed weekly slot) on the club page – team feedback ort-7.
 * Closed by default so the club page stays short; the club is set by the page.
 * PROTOTYPE: nothing is sent. TODO(content): target inbox for recurring bookings (Operations) and mail format.
 */
export function RecurringBookingForm({ locale, clubName, t, className }: { locale: Locale; clubName: string; t: RecurringBookingCopy; className?: string }) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [values, setValues] = useState<Values>({ days: "", time: "", courts: "", start: "", message: "", firstName: "", lastName: "", email: "", phone: "", consent: false });
  const [errors, setErrors] = useState<Partial<Record<Required | "summary", string>>>({});

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((prev) => {
      const rest = { ...prev };
      delete rest[key as Required];
      return Object.keys(rest).some((k) => k !== "summary") ? rest : {};
    });
  };
  const text = (key: Exclude<keyof Values, "consent">) => ({
    value: values[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(key, e.target.value),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const failed = REQUIRED.filter((k) => invalid(k, values));
    if (failed.length) {
      setErrors({ summary: t.errors.summary, ...Object.fromEntries(failed.map((k) => [k, t.errors[k]])) });
      formRef.current?.querySelector<HTMLElement>(`[data-field="${failed[0]}"] input`)?.focus();
      return;
    }
    setDone(true);
  };

  return (
    <div className={cn("rounded-[28px] border border-fg/10 bg-raised pad-banner", className)}>
      <h3 className="font-display text-3xl font-extrabold italic uppercase">{t.title}</h3>
      <p className="mt-2 max-w-2xl text-fg/80">{t.text}</p>
      {!open && !done && (
        <Button type="button" variant="outline" className="mt-6 w-fit" onClick={() => setOpen(true)} aria-expanded={false} data-track="recurring_booking_open">
          {t.open}
        </Button>
      )}
      {done ? (
        <div ref={(el) => el?.focus()} tabIndex={-1} role="status" className="mt-6 flex items-start gap-4 outline-none">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-gradient text-white">
            <Check className="size-5" strokeWidth={3} aria-hidden />
          </span>
          <div>
            <p className="font-semibold">{t.success.title}</p>
            <p className="mt-1 text-fg/75">{t.success.text}</p>
            <p className="mt-3 text-sm text-fg/70">{brandStrings[locale].leadForm.prototype}</p>
          </div>
        </div>
      ) : (
        open && (
          <form ref={formRef} noValidate onSubmit={submit} className="mt-8">
            <p className="text-sm text-fg/70">
              {t.club}: <span className="font-semibold text-fg">{clubName}</span>
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div data-field="days">
                <TextField id={id("days")} label={t.days.label} required placeholder={t.days.placeholder} error={errors.days} {...text("days")} />
              </div>
              <div data-field="time">
                <TextField id={id("time")} label={t.time.label} required placeholder={t.time.placeholder} error={errors.time} {...text("time")} />
              </div>
              <div data-field="courts">
                <TextField id={id("courts")} label={t.courts.label} required type="number" min={1} inputMode="numeric" placeholder={t.courts.placeholder} error={errors.courts} {...text("courts")} />
              </div>
              <TextField id={id("start")} label={t.start.label} optional={t.optional} placeholder={t.start.placeholder} {...text("start")} />
              <TextareaField id={id("message")} label={t.message.label} optional={t.optional} placeholder={t.message.placeholder} className="md:col-span-2" {...text("message")} />
              <div data-field="firstName">
                <TextField id={id("firstName")} label={t.firstName} required autoComplete="given-name" error={errors.firstName} {...text("firstName")} />
              </div>
              <div data-field="lastName">
                <TextField id={id("lastName")} label={t.lastName} required autoComplete="family-name" error={errors.lastName} {...text("lastName")} />
              </div>
              <div data-field="email">
                <TextField id={id("email")} label={t.email} required type="email" autoComplete="email" error={errors.email} {...text("email")} />
              </div>
              <TextField id={id("phone")} label={t.phone} optional={t.optional} type="tel" autoComplete="tel" {...text("phone")} />
              <div data-field="consent" className="md:col-span-2">
                <Consent locale={locale} id={id("consent")} checked={values.consent} onChange={(e) => set("consent", e.target.checked)} error={errors.consent} />
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-fg/70">{brandStrings[locale].leadForm.required}</p>
              <Button type="submit" variant="gradient" data-track="recurring_booking_submit">
                {t.submit}
              </Button>
            </div>
            {errors.summary && (
              <p role="alert" className="mt-4 text-sm text-danger-fg">
                {errors.summary}
              </p>
            )}
          </form>
        )
      )}
    </div>
  );
}
