import type { Metadata } from "next";
import { ArticleView } from "@/views/magazine/ArticleView";
import { articleSlugs, getArticle } from "@/lib/content/magazin";
import { alternates } from "@/lib/i18n/routes";
import { localeTags } from "@/lib/i18n/config";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return articleSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug, "de");
  if (!a) return {};
  return {
    title: a.title,
    description: a.excerpt,
    alternates: alternates("magazine", slug, "de"),
    openGraph: {
      type: "article",
      locale: localeTags.de.og,
      title: a.title,
      description: a.excerpt,
      publishedTime: a.publishedAt,
      images: a.image ? [a.image.url] : undefined,
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  return <ArticleView slug={slug} locale="de" />;
}
