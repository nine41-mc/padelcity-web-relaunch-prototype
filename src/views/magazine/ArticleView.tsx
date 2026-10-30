import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { formatDate, getArticle, getRelated, hubLabel, magazinContent } from "@/lib/content/magazin";
import { site } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { Headline } from "@/components/ui/Headline";
import { Media } from "@/components/ui/Media";
import { Chip } from "@/components/ui/Chip";
import { ArticleCard } from "@/components/brand/ArticleCard";
import { ShareButton } from "@/components/ui/ShareButton";
import { YouTubeLite } from "@/components/brand/YouTubeLite";

// Contentful content type: article (title, slug, hub, category, author, publishedAt, heroImage, body rich text,
// pullQuote, inlineImage, videoEmbed, relatedArticles) – localised fields DE/EN

/** Magazine article – shared by /magazin/[slug] (de) and /en/magazine/[slug] (en). */
export function ArticleView({ slug, locale }: { slug: string; locale: Locale }) {
  const article = getArticle(slug, locale);
  if (!article) notFound();

  const t = magazinContent[locale];
  const url = `${site.url}${href(locale, "magazine", article.slug)}/`;
  const body = article.body ?? [];
  const related = getRelated(article, locale);
  const [open, close] = locale === "de" ? ["„", "“"] : locale === "pl" ? ["„", "”"] : ["“", "”"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    inLanguage: locale,
    author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: "PadelCity", logo: { "@type": "ImageObject", url: `${site.url}/brand/logo.svg` } },
    image: article.image ? [`${site.url}${article.image.url}`] : undefined,
    mainEntityOfPage: url,
    articleSection: hubLabel(article.hub, locale),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <article lang={locale}>
        <header className="relative isolate overflow-hidden pt-32 md:pt-40">
          <div className="container-site">
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="gradient">{hubLabel(article.hub, locale)}</Chip>
              <Chip>{article.category}</Chip>
            </div>
            <Headline as="h1" size="md" className="mt-5 max-w-5xl lg:text-7xl">
              {article.title}
            </Headline>
            <p className="mt-6 max-w-3xl text-lg text-fg/75 md:text-xl">{article.excerpt}</p>
            <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fg/70">
              <span className="font-medium text-fg/80">{article.author}</span>
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-4" aria-hidden /> {article.readingTimeMin} {t.readingTime}
              </span>
            </p>
          </div>
          <div className="container-site mt-10 md:mt-12">
            <Media
              src={article.image?.url}
              alt={article.image?.alt ?? article.title}
              className="aspect-[4/3] rounded-[28px] md:aspect-[21/9]"
              sizes="(min-width:1440px) 1312px, 100vw"
              priority
            />
          </div>
        </header>

        <div className="container-site py-14 md:py-20">
          <div className="mx-auto max-w-[720px]">
            {/* Contentful module: richText */}
            <div className="space-y-6 text-lg leading-[1.75] text-fg/80">
              {body.slice(0, 2).map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "text-xl text-fg first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:font-extrabold first-letter:italic first-letter:leading-[0.8] first-letter:text-magenta-400"
                      : undefined
                  }
                >
                  {p}
                </p>
              ))}
            </div>

            {article.pullQuote && (
              // Content type article – field pullQuote
              <blockquote className="my-12 border-l-4 border-magenta-500 pl-6 md:my-16 md:pl-10 lg:-mx-12">
                <p className="font-display text-3xl font-extrabold italic uppercase leading-[1.02] text-brand-gradient md:text-5xl">
                  {open}
                  {article.pullQuote}
                  {close}
                </p>
              </blockquote>
            )}

            <div className="space-y-6 text-lg leading-[1.75] text-fg/80">
              {body.slice(2, 4).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {article.inlineImage && (
              // Content type article – field inlineImage
              <figure className="my-12 md:-mx-8 lg:-mx-32">
                <Media src={article.inlineImage.url} alt={article.inlineImage.alt} className="aspect-[16/9] rounded-[20px]" sizes="(min-width:1200px) 980px, 100vw" />
                <figcaption className="mt-3 text-sm text-fg/70">{article.inlineImage.alt}</figcaption>
              </figure>
            )}

            {body.length > 4 && (
              <div className="space-y-6 text-lg leading-[1.75] text-fg/80">
                {body.slice(4).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}

            <div className="my-12 md:-mx-8 lg:-mx-32">
              {/* TODO(content): real PadelCity TV video id per article */}
              <YouTubeLite videoId={article.youtubeId} title={`${t.article.video}: ${article.category}`} poster={article.image?.url} t={t.videoUi} />
            </div>

            <div className="mt-12 flex flex-col gap-4 border-t border-fg/10 pt-8 md:flex-row md:items-center md:justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-fg/70">{t.article.share}</p>
              <ShareButton title={article.title} locale={locale} track="share_article" />
            </div>
          </div>
        </div>
      </article>

      <Section tone="black">
        <h2 className="mb-8 font-display text-4xl font-extrabold italic uppercase md:mb-10 md:text-5xl">{t.article.related}</h2>
        <ul className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {related.map((a, i) => (
            <li key={a.slug} className={i === 2 ? "md:hidden lg:block" : undefined}>
              <ArticleCard article={a} locale={locale} />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
