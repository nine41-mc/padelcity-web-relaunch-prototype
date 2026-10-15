import type { Metadata } from "next";
import { JobsView } from "@/views/jobs/JobsView";
import { jobsContent } from "@/lib/content/jobs";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: jobsContent.pl.meta.title,
  description: jobsContent.pl.meta.description,
  alternates: alternates("jobs", undefined, "pl"),
};

export default function Page() {
  return <JobsView locale="pl" />;
}
