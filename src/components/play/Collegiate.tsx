import { cn } from "@/components/ui/cn";

/**
 * "Collegiate" accent style for the Academy (brand book uses Octin College; not licensed for
 * the prototype → emulated with bold uppercase Söhne Schmal, outline strokes and varsity borders).
 */
export function CollegiateBadge({ className, top = "PadelCity", main = "Academy", bottom = "Est. 2022" }: { className?: string; top?: string; main?: string; bottom?: string }) {
  return (
    <div
      className={cn(
        "inline-flex flex-col items-center rounded-[18px] border-[3px] border-white p-1 text-white [transform:rotate(-4deg)]",
        className,
      )}
      aria-label={`${top} ${main}, ${bottom}`}
      role="img"
    >
      <div className="flex flex-col items-center rounded-[12px] border border-white/60 px-5 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.35em]">{top}</span>
        <span className="font-display text-4xl font-extrabold uppercase not-italic leading-none tracking-wide text-transparent [-webkit-text-stroke:1.5px_white] md:text-5xl">
          {main}
        </span>
        <span className="mt-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em]">
          <span aria-hidden>★</span>
          {bottom}
          <span aria-hidden>★</span>
        </span>
      </div>
    </div>
  );
}

/** Varsity-style text: filled + offset outline shadow. */
export function VarsityText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("relative inline-block whitespace-nowrap font-display font-extrabold uppercase not-italic tracking-wide", className)}>
      <span aria-hidden className="absolute left-[0.06em] top-[0.06em] [-webkit-text-stroke:1.5px_var(--color-magenta-500)] [color:transparent]">
        {children}
      </span>
      <span className="relative">{children}</span>
    </span>
  );
}
