"use client";

import { useId, useRef, useState } from "react";
import { Check } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { EventInquiryContent } from "@/lib/content/eventInquiry";
import { brandStrings } from "../brand/strings";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { cn } from "../ui/cn";
import { FieldLabel, FieldMessage, TextField, TextareaField } from "../forms/Field";
import { ChoiceCards } from "../forms/ChoiceCards";
import { YesNoRow } from "../forms/YesNoRow";
import { Consent } from "../forms/Consent";
import { FormStep } from "../forms/FormStep";

// Contentful module: eventInquiryForm (copy in page "eventInquiry"; locations from the club list)

type Values = {
  occasion: string;
  groupSize: string;
  location: string;
  date: string;
  addons: Record<string, boolean>;
  details: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  consent: boolean;
};
type ErrorKey = keyof EventInquiryContent["form"]["errors"];
// in the order of the form – the first invalid one gets the focus
const REQUIRED: Exclude<ErrorKey, "summary">[] = ["occasion", "groupSize", "location", "date", "firstName", "lastName", "email", "consent"];

const invalid = (key: (typeof REQUIRED)[number], v: Values) => {
  switch (key) {
    case "groupSize":
      return !/^\d+$/.test(v.groupSize.trim()) || Number(v.groupSize) < 1;
    case "email":
      return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim());
    case "consent":
      return !v.consent;
    default:
      return !v[key].trim();
  }
};

/**
 * Event inquiry for groups and companies (/events/anfrage): occasion, size, location, date, extras, contact.
 * Validates itself (messages at the field, focus on the first error) instead of the browser bubbles.
 * PROTOTYPE: nothing is sent. Target per briefing: a mail to the events inbox with a fixed subject
 * „[Eventanfrage] Anlass | Standort | Name, Vorname“ for the mail rules; mail service and spam protection TBD.
 */
export function EventInquiryForm({ locale, t, locations, className }: { locale: Locale; t: EventInquiryContent; locations: string[]; className?: string }) {
  const f = t.form;
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>({
    occasion: "",
    groupSize: "",
    location: "",
    date: "",
    addons: Object.fromEntries(f.addons.map((a) => [a.name, false])),
    details: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({});
  const [done, setDone] = useState(false);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    // a corrected field loses its error; the summary goes with the last one
    setErrors((prev) => {
      const rest = { ...prev };
      delete rest[key as ErrorKey];
      return Object.keys(rest).some((k) => k !== "summary") ? rest : {};
    });
  };
  const text = (key: "groupSize" | "date" | "details" | "firstName" | "lastName" | "email" | "phone") => ({
    value: values[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(key, e.target.value),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const failed = REQUIRED.filter((k) => invalid(k, values));
    if (failed.length) {
      setErrors({ summary: f.errors.summary, ...Object.fromEntries(failed.map((k) => [k, f.errors[k]])) });
      // the occasion cards and the location select have no element with that id – focus their first control
      const first = formRef.current?.querySelector<HTMLElement>(`[data-field="${failed[0]}"] :is(input, button, textarea)`);
      first?.focus();
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div
        ref={(el) => el?.focus()}
        tabIndex={-1}
        role="status"
        className={cn("rounded-[28px] border border-magenta-500/40 bg-magenta-500/[0.06] pad-banner outline-none", className)}
      >
        <span className="grid size-14 place-items-center rounded-full bg-brand-gradient text-white">
          <Check className="size-7" strokeWidth={3} aria-hidden />
        </span>
        <p className="mt-6 font-display text-4xl font-extrabold italic uppercase">{f.success.title}</p>
        <p className="mt-3 max-w-md text-white/75">{f.success.text}</p>
        <p className="mt-6 text-sm text-white/70">{brandStrings[locale].leadForm.prototype}</p>
      </div>
    );
  }

  const step = "border-t border-white/10 pt-8 mt-10";
  return (
    <form ref={formRef} noValidate onSubmit={submit} className={cn("rounded-[28px] border border-white/10 bg-ink-700 pad-banner", className)}>
      <FormStep number={1} title={f.steps.event} />
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div data-field="occasion" className="md:col-span-2">
          <ChoiceCards name={id("occasion")} legend={f.occasion.label} options={f.occasion.options} value={values.occasion} onChange={(v) => set("occasion", v)} required error={errors.occasion} />
        </div>
        <div data-field="groupSize">
          <TextField id={id("groupSize")} label={f.groupSize.label} required type="number" min={1} inputMode="numeric" placeholder={f.groupSize.placeholder} error={errors.groupSize} {...text("groupSize")} />
        </div>
        <div data-field="location">
          <FieldLabel htmlFor={id("location")} required>
            {f.location.label}
          </FieldLabel>
          <Select
            id={id("location")}
            label={f.location.label}
            placeholder={brandStrings[locale].leadForm.choose}
            size="lg"
            value={values.location}
            onChange={(v) => set("location", v)}
            options={[...locations, f.location.open].map((o) => ({ value: o, label: o }))}
            required
            invalid={!!errors.location}
            describedBy={errors.location ? `${id("location")}-msg` : undefined}
          />
          <FieldMessage id={`${id("location")}-msg`} error={errors.location} />
        </div>
        <div data-field="date" className="md:col-span-2">
          <TextField id={id("date")} label={f.date.label} required placeholder={f.date.placeholder} hint={f.date.hint} error={errors.date} {...text("date")} />
        </div>
      </div>

      <FormStep number={2} title={f.steps.addons} className={step} />
      <p className="mt-6 border-l-[3px] border-magenta-500 pl-4 text-sm text-white/85">{f.addonsNote}</p>
      <div className="mt-6 divide-y divide-white/10 rounded-[20px] border border-white/10">
        {f.addons.map((a) => (
          <YesNoRow
            key={a.name}
            name={id(a.name)}
            title={a.title}
            text={a.text}
            yes={f.yes}
            no={f.no}
            value={values.addons[a.name]}
            onChange={(v) => setValues((s) => ({ ...s, addons: { ...s.addons, [a.name]: v } }))}
          />
        ))}
      </div>
      <TextareaField id={id("details")} label={f.details.label} optional={f.optional} placeholder={f.details.placeholder} hint={f.details.hint} className="mt-6" {...text("details")} />

      <FormStep number={3} title={f.steps.contact} className={step} />
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div data-field="firstName">
          <TextField id={id("firstName")} label={f.firstName} required autoComplete="given-name" error={errors.firstName} {...text("firstName")} />
        </div>
        <div data-field="lastName">
          <TextField id={id("lastName")} label={f.lastName} required autoComplete="family-name" error={errors.lastName} {...text("lastName")} />
        </div>
        <div data-field="email">
          <TextField id={id("email")} label={f.email} required type="email" autoComplete="email" error={errors.email} {...text("email")} />
        </div>
        <TextField id={id("phone")} label={f.phone} optional={f.optional} type="tel" autoComplete="tel" {...text("phone")} />
        <div data-field="consent" className="md:col-span-2">
          <Consent locale={locale} id={id("consent")} checked={values.consent} onChange={(e) => set("consent", e.target.checked)} error={errors.consent} />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/70">{brandStrings[locale].leadForm.required}</p>
        <Button type="submit" variant="gradient" data-track="event_inquiry_submit">
          {f.submit}
        </Button>
      </div>
      {errors.summary && (
        <p role="alert" className="mt-4 text-sm text-danger">
          {errors.summary}
        </p>
      )}
    </form>
  );
}
