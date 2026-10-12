import type { Metadata } from "next";
import { EventDetailView, eventMetadata, eventStaticParams } from "@/views/events/EventDetailView";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Promise<Params[]> {
  return eventStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  return eventMetadata((await params).slug, "en");
}

export default async function Page({ params }: { params: Promise<Params> }) {
  return <EventDetailView slug={(await params).slug} locale="en" />;
}
