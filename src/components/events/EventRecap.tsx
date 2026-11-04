import type { EventContent } from "@/lib/content/events";
import { Headline, Lead } from "../ui/Headline";
import { Media } from "../ui/Media";

type Labels = { recapEyebrow: string; recapTitle: string; results: string; gallery: string };

// Contentful module: eventRecap – filled after the event (team feedback v-event-8): results per category and photos
// stay on the event page, under the same URL that was shared for the sign-up. Only shows when filled.
export function EventRecap({ recap, labels }: { recap: NonNullable<EventContent["recap"]>; labels: Labels }) {
  return (
    <div className="grid gap-10">
      <div className="max-w-3xl">
        <Headline size="md">{labels.recapTitle}</Headline>
        {recap.text && <Lead className="mt-5">{recap.text}</Lead>}
      </div>
      {recap.results && recap.results.length > 0 && (
        <section aria-label={labels.results}>
          <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-fg/70">{labels.results}</h3>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recap.results.map((r) => (
              <div key={r.category ?? "results"} className="rounded-[20px] border border-fg/10 pad-card">
                {r.category && <p className="font-display text-2xl font-extrabold italic uppercase">{r.category}</p>}
                <ol className="mt-3 space-y-3">
                  {r.places.map((p) => (
                    <li key={p.rank} className="flex items-baseline gap-4 border-t border-fg/10 pt-3">
                      <span className="w-8 shrink-0 font-display text-2xl font-extrabold italic text-brand-gradient">{p.rank}.</span>
                      <span className="font-semibold">{p.name}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      )}
      {recap.gallery && recap.gallery.length > 0 && (
        <section aria-label={labels.gallery}>
          <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-fg/70">{labels.gallery}</h3>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {recap.gallery.map((img, i) => (
              <li key={img.url} className={i === 0 ? "col-span-2 row-span-2" : undefined}>
                <Media src={img.url} alt={img.alt} className="aspect-square h-full rounded-[16px]" sizes="(min-width:768px) 25vw, 50vw" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
