"use client";

import { plural } from "@/lib/i18n/plural";
import type { Locale } from "@/lib/i18n/config";
import { useMemo, useState } from "react";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { asset } from "@/lib/asset";
import type { Job } from "@/lib/data/types";
import type { JobsContent } from "@/lib/content/jobs";
import { cn } from "../ui/cn";

// Contentful module: none – fed by the Personio job feed (XML) via @/lib/data later.

const ALL = "__all__";

function FilterRow({ label, allLabel, options, value, onChange }: { label: string; allLabel: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div role="group" aria-label={label} className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
      <p className="w-24 shrink-0 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">{label}</p>
      <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
        {[ALL, ...options].map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(o)}
            className={cn(
              "h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors",
              value === o ? "border-transparent bg-brand-gradient text-white" : "border-white/20 text-white/80 hover:border-white/50",
            )}
          >
            {o === ALL ? allLabel : o}
          </button>
        ))}
      </div>
    </div>
  );
}

type Contact = { name: string; role: string; email: string; phone: string; image: string; eyebrow: string; text: string };

/** Open positions with department / location filters. Each role opens an application e-mail; the People & Culture contact sits beside the list. */
export function JobsBoard({ jobs, t, contact, locale = "de" }: { jobs: Job[]; t: JobsContent["board"]; contact?: Contact; locale?: Locale }) {
  const [dep, setDep] = useState(ALL);
  const [loc, setLoc] = useState(ALL);
  const departments = useMemo(() => Array.from(new Set(jobs.map((j) => j.department))), [jobs]);
  const locations = useMemo(() => Array.from(new Set(jobs.map((j) => j.location))), [jobs]);
  const filtered = jobs.filter((j) => (dep === ALL || j.department === dep) && (loc === ALL || j.location === loc));

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
    <div className="min-w-0">
      <div className="space-y-4 rounded-[20px] border border-white/10 bg-ink-700 p-4 md:p-6">
        <FilterRow label={t.department} allLabel={t.all} options={departments} value={dep} onChange={setDep} />
        <FilterRow label={t.location} allLabel={t.all} options={locations} value={loc} onChange={setLoc} />
      </div>
      <p className="mt-6 text-sm text-white/70" aria-live="polite">
        {filtered.length} {plural(locale, filtered.length, t.one, t.many)}
      </p>
      <ul className="mt-3 divide-y divide-white/10 border-y border-white/10">
        {filtered.map((j) => (
          <li key={j.id}>
            <a
              href={j.url}
              data-track="job_click"
              className="group flex items-center justify-between gap-4 py-5 transition-colors md:py-6"
            >
              <div className="min-w-0">
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-magenta-300">{j.department}</p>
                <p className="mt-1 font-display text-2xl font-extrabold italic uppercase leading-tight transition-colors group-hover:text-magenta-300 md:text-3xl">{j.title}</p>
                <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/70">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4" aria-hidden /> {j.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-4" aria-hidden /> {j.employmentType}
                  </span>
                </p>
              </div>
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/20 transition-all duration-300 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-brand-gradient group-hover:text-white md:size-14">
                <ArrowUpRight className="size-5" aria-hidden />
                <span className="sr-only">{t.open}</span>
              </span>
            </a>
          </li>
        ))}
        {!filtered.length && <li className="py-10 text-center text-white/70">{t.empty}</li>}
      </ul>
    </div>
    {contact && (
      <aside className="h-fit rounded-[24px] border border-white/10 bg-ink-700 p-6 lg:sticky lg:top-28">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">{contact.eyebrow}</p>
        <div className="mt-4 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(contact.image)} alt={contact.name} className="size-20 shrink-0 rounded-full object-cover" loading="lazy" />
          <div>
            <p className="font-display text-2xl font-extrabold italic uppercase leading-none">{contact.name}</p>
            <p className="mt-1 text-sm text-white/70">{contact.role}</p>
          </div>
        </div>
        <p className="mt-5 text-sm text-white/80">{contact.text}</p>
        <ul className="mt-5 space-y-2 text-sm">
          <li>
            <a href={`mailto:${contact.email}`} className="inline-flex min-h-11 items-center gap-2 font-semibold hover:text-magenta-300" data-track="jobs_contact_mail">
              <Mail className="size-4" aria-hidden /> {contact.email}
            </a>
          </li>
          <li>
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="inline-flex min-h-11 items-center gap-2 font-semibold hover:text-magenta-300" data-track="jobs_contact_phone">
              <Phone className="size-4" aria-hidden /> {contact.phone}
            </a>
          </li>
        </ul>
      </aside>
    )}
    </div>
  );
}
