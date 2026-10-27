import { Mail, Phone } from "lucide-react";
import { asset } from "@/lib/asset";

type Contact = { name: string; role: string; email: string; phone: string; image: string; eyebrow: string; text: string };

/** People & Culture contact next to the open positions (Contentful: jobs page). */
export function JobsContact({ contact }: { contact: Contact }) {
  return (
    <aside className="h-fit rounded-[24px] border border-white/10 bg-ink-700 pad-panel lg:sticky lg:top-28">
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
  );
}
