import { Instagram, Play } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { site } from "@/lib/site";
import { Media } from "../ui/Media";
import { Accent, Eyebrow, Headline } from "../ui/Headline";
import { Button } from "../ui/Button";

/*
 * Contentful module: socialWall (handle, headline, number of posts).
 * Production: the latest Instagram posts of @padelcity.de, fetched server-side at build time via the
 * Instagram Graph API or a feed tool with a JSON endpoint (e.g. Behold, Curator.io, EmbedSocial) – no
 * third-party script in the browser, so no extra consent banner category is needed.
 * Prototype: real PadelCity photos stand in for the posts.
 */
const POSTS: { src: string; reel?: boolean }[] = [
  { src: "/images/events/gameplay-mix-1.jpg", reel: true },
  { src: "/images/clubs/berlin-2.jpg" },
  { src: "/images/events/king-of-the-court.jpg" },
  { src: "/images/events/afterwork.jpg", reel: true },
  { src: "/images/clubs/dortmund-3.jpg" },
  { src: "/images/events/beginner-girls.jpg" },
  { src: "/images/events/series.jpg", reel: true },
  { src: "/images/clubs/muenchen-frankfurter-ring-2.jpg" },
  { src: "/images/events/tournament-1.jpg" },
  { src: "/images/events/gameplay-mix-2.jpg", reel: true },
  { src: "/images/events/kids-camp.jpg" },
  { src: "/images/events/opc.jpg" },
];

const copy = {
  de: { eyebrow: "@padelcity.de", title: "Follow the", accent: "vibe.", cta: "Auf Instagram folgen", alt: "Instagram-Post von PadelCity" },
  en: { eyebrow: "@padelcity.de", title: "Follow the", accent: "vibe.", cta: "Follow on Instagram", alt: "PadelCity Instagram post" },
};

/** Instagram image wall for the home page: dense 3/6-column grid like the profile view, every tile opens Instagram. */
export function SocialWall({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <section aria-labelledby="social-wall-title" className="bg-ink-800 py-20 md:py-28">
      <div className="container-site mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <Headline size="md" className="mt-6">
            <span id="social-wall-title">
              {t.title} <Accent>{t.accent}</Accent>
            </span>
          </Headline>
        </div>
        <Button href={site.social.instagram} variant="outline" data-track="social_wall_follow">
          {t.cta}
        </Button>
      </div>
      <ul className="grid grid-cols-3 gap-1 md:grid-cols-6">
        {POSTS.map((p, i) => (
          <li key={p.src} className={i >= 9 ? "hidden md:block" : undefined}>
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden" data-track="social_wall_post">
              <Media src={p.src} alt={t.alt} className="aspect-[4/5]" imgClassName="transition-transform duration-700 group-hover:scale-105" sizes="(min-width:768px) 17vw, 33vw" />
              {p.reel && <Play className="absolute right-2 top-2 size-5 fill-white text-white drop-shadow" aria-hidden />}
              <span className="absolute inset-0 grid place-items-center bg-purple-900/0 opacity-0 transition group-hover:bg-purple-900/55 group-hover:opacity-100" aria-hidden>
                <Instagram className="size-8 text-white" />
              </span>
            </a>
          </li>
        ))}
      </ul>
      {/* TODO(content): live = latest posts from @padelcity.de (Instagram API); the prototype shows sample images */}
    </section>
  );
}
