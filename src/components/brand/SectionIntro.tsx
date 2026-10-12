import { Eyebrow, Headline, Lead } from "../ui/Headline";
import { Reveal } from "../ui/Reveal";
import { cn } from "../ui/cn";

/** Eyebrow + headline + lead block used at the top of brand-page sections. */
export function SectionIntro({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
  actions,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  actions?: React.ReactNode;
}) {
  return (
    <Reveal className={cn("mb-10 md:mb-14", align === "center" && "flex flex-col items-center text-center", className)}>
      {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
      <Headline size="md" className={cn("max-w-4xl", align === "center" && "mx-auto")}>
        {title}
      </Headline>
      {lead && <Lead className={cn("mt-5", align === "center" && "mx-auto")}>{lead}</Lead>}
      {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
    </Reveal>
  );
}
