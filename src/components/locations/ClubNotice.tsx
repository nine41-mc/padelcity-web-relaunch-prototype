import { Megaphone } from "lucide-react";
import type { Club } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { cn } from "../ui/cn";

// Contentful module: clubNotice – a current notice (closed court, changed hours …), team feedback ort-4.
// Shows only when filled and until validUntil has passed.
export function ClubNotice({
  notice,
  locale,
  labels,
  className,
  now = new Date(),
}: {
  notice: NonNullable<Club["notice"]>;
  locale: Locale;
  labels: { label: string; until: string };
  className?: string;
  now?: Date;
}) {
  if (notice.validUntil && new Date(`${notice.validUntil}T23:59:59`) < now) return null;
  const until = notice.validUntil
    ? labels.until.replace("{date}", new Date(`${notice.validUntil}T12:00:00`).toLocaleDateString(localeTags[locale].intl, { day: "numeric", month: "long" }))
    : undefined;
  return (
    <aside className={cn("flex items-start gap-4 rounded-[20px] border border-fg/15 bg-raised p-5", className)} aria-label={labels.label}>
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-gradient text-white">
        <Megaphone className="size-5" aria-hidden />
      </span>
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-fg/70">
          {labels.label}
          {until && <span className="font-normal normal-case tracking-normal"> · {until}</span>}
        </p>
        <p className="mt-1 font-semibold">{notice.text}</p>
      </div>
    </aside>
  );
}
