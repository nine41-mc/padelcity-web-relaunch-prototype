import { cn } from "../ui/cn";

/** Numbered step heading inside a long form (Figma: Form Step) – gradient number badge and title. */
export function FormStep({ number, title, as: Tag = "h3", className }: { number: number; title: string; as?: "h2" | "h3"; className?: string }) {
  return (
    <Tag className={cn("flex items-center gap-3 text-lg font-semibold text-fg", className)}>
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-gradient text-sm font-semibold" aria-hidden>
        {number}
      </span>
      {title}
    </Tag>
  );
}
