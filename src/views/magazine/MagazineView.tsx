import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { formatDate, getArticles, hubLabel, hubs, magazinContent } from "@/lib/content/magazin";
import { Section } from "@/components/ui/Section";
import { Accent, Eyebrow, Headline } from "@/components/ui/Headline";
import { Reveal } from "@/components/ui/Reveal";
import { Media } from "@/components/ui/Media";
import { Chip } from "@/components/ui/Chip";
import { PressLogos } from "@/components/modules/PressLogos";
import { ArticleCard } from "@/components/brand/ArticleCard";
import { MagazinHub } from "@/components/brand/MagazinHub";

// Contentful page "magazine": contentHubs, featuredArticle, articleGrid (filter by hub), pressLogos

/** Magazine hub – shared by /magazin (de) and /en/magazine (en). */
export function MagazineView({ locale }: { locale: Locale }) {
  // TODO(data): move behind @/lib/data (getArticles) once the Contentful adapter exists.
  const t = magazinContent[locale];
  const articles = getArticles(locale);
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a.slug !== featured.slug);
  const cards = Object.fromEntries(rest.map((a) => [a.slug, <ArticleCard key={a.slug} article={a} locale={locale} />]));

  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-10 md:pt-44 md:pb-14">
        <div className="pointer-events-none absolute -top-40 right-[-20%] h-[520px] w-[520px] rounded-full bg-magenta-500/25 blur-[140px]" aria-hidden />
        <div className="container-site relative">
          <Eyebrow className="mb-6">{t.hero.eyebrow}</Eyebrow>
          <Headline as="h1" size="xl">
            {t.hero.title} <Accent>{t.hero.accent}</Accent>
          </Headline>
        </div>
      </section>

      <section className="pb-6">
        <div className="container-site">
          <Reveal>
            <article className="group relative grid overflow-hidden rounded-[28px] border border-white/10 bg-ink-700 lg:grid-cols-[1.3fr_1fr]">
              <Media
                src={featured.image?.url}
                alt={featured.image?.alt ?? featured.title}
                className="aspect-[16/10] lg:aspect-auto lg:min-h-[480px]"
                imgClassName="transition-transform duration-700 group-hover:scale-105"
                sizes="(min-width:1200px) 60vw, 100vw"
                priority
              />
              <div className="flex flex-col p-6 md:p-10">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip tone="gradient">{t.featured}</Chip>
                  <Chip>{hubLabel(featured.hub, locale)}</Chip>
                </div>
                <h2 className="mt-5 font-display text-4xl font-extrabold italic uppercase leading-[0.95] md:text-5xl">
                  <Link href={href(locale, "magazine", featured.slug)} className="after:absolute after:inset-0 after:content-['']">
                    {featured.title}
                  </Link>
                </h2>
                <p className="mt-5 text-lg text-white/70">{featured.excerpt}</p>
                <div className="mt-auto flex items-center justify-between pt-8 text-sm text-white/70">
                  <span className="flex items-center gap-3">
                    <time dateTime={featured.publishedAt}>{formatDate(featured.publishedAt, locale)}</time>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-4" aria-hidden /> {featured.readingTimeMin} {t.minutes}
                    </span>
                  </span>
                  <span className="grid size-12 place-items-center rounded-full bg-white text-ink-800 transition-transform duration-300 group-hover:rotate-45" aria-hidden>
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <Section className="pt-12 md:pt-16 lg:pt-20">
        <MagazinHub t={t.filter} hubs={hubs[locale]} articles={rest.map(({ slug, hub }) => ({ slug, hub }))} cards={cards} />
      </Section>

      <PressLogos locale={locale} />
    </>
  );
}
