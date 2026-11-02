import type { Metadata } from "next";
import { JobsView } from "@/views/jobs/JobsView";
import { jobsContent } from "@/lib/content/jobs";
import { alternates } from "@/lib/i18n/routes";
import { ogFor } from "@/lib/og";

export const metadata: Metadata = {
  title: jobsContent.en.meta.title,
  description: jobsContent.en.meta.description,
  alternates: alternates("jobs", undefined, "en"),
  openGraph: ogFor("en", "jobs"),
};

export default function Page() {
  return <JobsView locale="en" />;
}
