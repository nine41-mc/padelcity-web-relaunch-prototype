"use client";

import { useMemo, useState } from "react";
import { Briefcase, ChevronDown, ChevronRight, Clock, Layers, MapPin, Search } from "lucide-react";
import { APPLY_EMAIL, personioPreviewJobs, type PersonioLang } from "@/lib/content/jobs";

/*
 * Visual stand-in for the embedded Personio career page (light Personio template: language picker,
 * search + filters, roles grouped by department with a count, one card per role). Interactive like the
 * real page so the section can be judged in the prototype. Replaced by the iframe once the URL is set.
 */
const UI: Record<PersonioLang, Record<string, string>> = {
  de: { heading: "Offene Stellen", search: "Stellen durchsuchen", department: "Abteilung", office: "Ort", type: "Anstellungsart", empty: "Keine passenden Stellen gefunden.", apply: "Bewerbung", lang: "Sprache" },
  en: { heading: "Open positions", search: "Search jobs", department: "Department", office: "Office", type: "Employment type", empty: "No matching positions found.", apply: "Application", lang: "Language" },
};

function Select({ label, icon, value, options, onChange }: { label: string; icon: React.ReactNode; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="relative inline-flex h-10 items-center rounded-lg border border-[#d9dbe0] bg-white text-sm text-[#2b2d33] focus-within:border-[#2b2d33]">
      <span className="pointer-events-none absolute left-3 text-[#6b6f78]">{icon}</span>
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-full appearance-none rounded-lg bg-transparent pl-9 pr-8 outline-none">
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 size-4 text-[#6b6f78]" aria-hidden />
    </label>
  );
}

export function PersonioPreview({ initialLang }: { initialLang: PersonioLang }) {
  const [lang, setLang] = useState<PersonioLang>(initialLang);
  const [q, setQ] = useState("");
  const [dep, setDep] = useState("");
  const [office, setOffice] = useState("");
  const [type, setType] = useState("");
  const t = UI[lang];
  const jobs = useMemo(() => personioPreviewJobs(lang), [lang]);
  const uniq = (k: "department" | "office" | "employmentType") => [...new Set(jobs.map((j) => j[k]))];

  const filtered = jobs.filter(
    (j) =>
      (!q || j.title.toLowerCase().includes(q.toLowerCase())) &&
      (!dep || j.department === dep) &&
      (!office || j.office === office) &&
      (!type || j.employmentType === type),
  );
  const groups = [...new Set(filtered.map((j) => j.department))].map((d) => ({ name: d, jobs: filtered.filter((j) => j.department === d) }));

  return (
    // Personio's own look: light page, system font, grey meta text – deliberately not PadelCity styling
    <div lang={lang} className="rounded-[24px] bg-white px-5 py-6 font-[system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif] text-[#2b2d33] md:px-8 md:py-8">
      <div className="flex justify-end">
        <label className="relative inline-flex h-9 items-center rounded-lg border border-[#d9dbe0] text-sm">
          <span className="sr-only">{t.lang}</span>
          <select
            value={lang}
            onChange={(e) => {
              setLang(e.target.value as PersonioLang);
              setDep("");
              setOffice("");
              setType("");
            }}
            className="h-full appearance-none rounded-lg bg-transparent pl-3 pr-8 outline-none"
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 size-4 text-[#6b6f78]" aria-hidden />
        </label>
      </div>
      <h3 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{t.heading}</h3>
      <div className="mt-6 flex flex-wrap gap-2">
        <label className="relative inline-flex h-10 min-w-0 flex-1 basis-56 items-center rounded-lg border border-[#d9dbe0] focus-within:border-[#2b2d33]">
          <Search className="pointer-events-none absolute left-3 size-4 text-[#6b6f78]" aria-hidden />
          <span className="sr-only">{t.search}</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} className="h-full w-full rounded-lg bg-transparent pl-9 pr-3 text-sm outline-none placeholder:text-[#6b6f78]" />
        </label>
        <Select label={t.department} icon={<Layers className="size-4" />} value={dep} options={uniq("department")} onChange={setDep} />
        <Select label={t.office} icon={<MapPin className="size-4" />} value={office} options={uniq("office")} onChange={setOffice} />
        <Select label={t.type} icon={<Briefcase className="size-4" />} value={type} options={uniq("employmentType")} onChange={setType} />
      </div>

      <div className="mt-8 space-y-8" aria-live="polite">
        {groups.map((g) => (
          <section key={g.name}>
            <h4 className="flex items-center gap-2 text-xl font-semibold">
              {g.name}
              <span className="grid min-w-6 place-items-center rounded-full bg-[#eef0f3] px-2 text-xs font-semibold text-[#6b6f78]">{g.jobs.length}</span>
            </h4>
            <ul className="mt-3 space-y-3">
              {g.jobs.map((j) => (
                <li key={j.id}>
                  <a
                    href={`mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(`${t.apply}: ${j.title} – ${j.office}`)}`}
                    data-track="job_click"
                    className="group flex items-center justify-between gap-4 rounded-xl border border-[#e6e8ec] bg-white px-5 py-4 shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition hover:border-[#c9ccd3] hover:shadow-[0_4px_14px_rgb(0_0_0/0.08)]"
                  >
                    <span className="min-w-0">
                      <span className="block font-semibold leading-snug">{j.title}</span>
                      <span className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#6b6f78]">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-3.5" aria-hidden /> {j.office}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="size-3.5" aria-hidden /> {j.schedule}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="size-3.5" aria-hidden /> {j.employmentType}
                        </span>
                      </span>
                    </span>
                    <ChevronRight className="size-5 shrink-0 text-[#2b2d33] transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {!groups.length && <p className="py-6 text-center text-[#6b6f78]">{t.empty}</p>}
      </div>
    </div>
  );
}
