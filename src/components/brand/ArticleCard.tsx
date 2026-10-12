import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { formatDate, hubLabel, magazinContent, type MagazinArticle } from "@/lib/content/magazin";
import { Media } from "../ui/Media";
import { Chip } from "../ui/Chip";
import { cn } from "../ui/cn";

// Contentful module: articleTeaser (reference to `article`)

export function ArticleCard({ article, locale, className, large = false }: { article: MagazinArticle; locale: Locale; className?: string; large?: boolean }) {
  const t = magazinContent[locale];
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-white/10 bg-ink-700 transition-all duration-300 hover:-translate-y-1 hover:border-magenta-500/50 hover:shadow-glow",
        className,
      )}
    >
      <div className="relative">
        <Media
          src={article.image?.url}
          alt={article.image?.alt ?? article.title}
          className={large ? "aspect-[16/10]" : "aspect-[16/11]"}
          imgClassName="transition-transform duration-700 group-hover:scale-105"
          sizes="(min-width:1200px) 33vw, (min-width:768px) 50vw, 100vw"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <Chip tone="dark">{hubLabel(article.hub, locale)}</Chip>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="flex items-center gap-3 text-sm text-white/70">
          <span className="font-semibold uppercase tracking-[0.12em] text-magenta-300">{article.category}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden /> {article.readingTimeMin} {t.minutes}
          </span>
        </p>
        <h3 className={cn("mt-3 font-display font-extrabold italic uppercase leading-[0.98]", large ? "text-3xl md:text-4xl" : "text-2xl")}>
          <Link href={href(locale, "magazine", article.slug)} className="after:absolute after:inset-0 after:content-['']">
            {article.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/70">{article.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-5 text-sm text-white/70">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time>
          <span className="grid size-9 place-items-center rounded-full bg-white/10 transition-transform duration-300 group-hover:rotate-45 group-hover:bg-neon-500 group-hover:text-ink-800" aria-hidden>
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
