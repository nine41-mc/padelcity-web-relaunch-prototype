import type { Metadata } from "next";
import { ClubView, clubMetadata, clubStaticParams, type ClubParams } from "@/views/locations/ClubView";

export const dynamicParams = false;

export function generateStaticParams() {
  return clubStaticParams("de");
}

export async function generateMetadata({ params }: { params: Promise<ClubParams> }): Promise<Metadata> {
  return clubMetadata((await params).slug, "de");
}

export default async function Page({ params }: { params: Promise<ClubParams> }) {
  return <ClubView slug={(await params).slug} locale="de" />;
}
