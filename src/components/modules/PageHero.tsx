import { Media } from "../ui/Media";
import { Eyebrow, Headline, Lead } from "../ui/Headline";
import { cn } from "../ui/cn";

/** Standard hero for sub-pages. Pass the headline as children (use <Accent> for one word). */
export function PageHero({
  eyebrow,
  lead,
  image,
  actions,
  className,
  children,
  align = "left",
}: {
  eyebrow?: React.ReactNode;
  lead?: React.ReactNode;
  image?: { url: string; alt: string };
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <section className={cn("relative isolate overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24 lg:min-h-[72vh] lg:pt-52", className)}>
      <div className="absolute inset-0 -z-10">
        {image ? (
          <Media src={image.url} alt={image.alt} className="h-full w-full" priority imgClassName="grayscale-[35%]" />
        ) : (
          <div className="h-full w-full bg-brandbook-gradient" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-800/75 via-purple-900/70 to-ink-800" />
        <div className="absolute inset-0 bg-grain" />
      </div>
      <div className={cn("container-site", align === "center" && "flex flex-col items-center text-center")}>
        {eyebrow && <Eyebrow className="mb-6">{eyebrow}</Eyebrow>}
        <Headline as="h1" size="lg" className={cn("max-w-5xl", align === "center" && "mx-auto")}>
          {children}
        </Headline>
        {lead && <Lead className={cn("mt-6", align === "center" && "mx-auto")}>{lead}</Lead>}
        {actions && <div className={cn("mt-10 flex flex-wrap gap-3", align === "center" && "justify-center")}>{actions}</div>}
      </div>
    </section>
  );
}
