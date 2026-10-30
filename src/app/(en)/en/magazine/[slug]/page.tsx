import type { Metadata } from "next";
import { ArticleView } from "@/views/magazine/ArticleView";
import { articleSlugs, getArticle } from "@/lib/content/magazin";
import { alternates } from "@/lib/i18n/routes";
import { localeTags } from "@/lib/i18n/config";
import { pageTitle } from "@/lib/site";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return articleSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug, "en");
  if (!a) return {};
  return {
    title: pageTitle(a.title),
    description: a.excerpt,
    alternates: alternates("magazine", slug, "en"),
    openGraph: {
      type: "article",
      locale: localeTags.en.og,
      title: a.title,
      description: a.excerpt,
      publishedTime: a.publishedAt,
      images: a.image ? [a.image.url] : undefined,
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  return <ArticleView slug={slug} locale="en" />;
}
