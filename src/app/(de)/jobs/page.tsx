import type { Metadata } from "next";
import { JobsView } from "@/views/jobs/JobsView";
import { jobsContent } from "@/lib/content/jobs";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: jobsContent.de.meta.title,
  description: jobsContent.de.meta.description,
  alternates: alternates("jobs", undefined, "de"),
};

export default function Page() {
  return <JobsView locale="de" />;
}
