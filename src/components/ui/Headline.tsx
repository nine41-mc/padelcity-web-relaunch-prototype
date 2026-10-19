import { cn } from "./cn";

type Tag = "h1" | "h2" | "h3" | "p";
const sizes = {
  xl: "text-[13vw] leading-[0.88] md:text-[9vw] lg:text-[8.5rem]",
  lg: "text-5xl leading-[0.92] md:text-7xl lg:text-8xl",
  md: "text-4xl leading-[0.95] md:text-5xl lg:text-6xl",
  sm: "text-3xl leading-none md:text-4xl",
};

/**
 * Big italic display headline (Söhne Schmal Fett Kursiv, as in the app's headline1).
 * Wrap single words in <Accent> to get the Good Brush + Optic Yellow treatment from Elephant's pitch.
 */
export function Headline({
  as: Comp = "h2",
  size = "lg",
  className,
  children,
}: {
  as?: Tag;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Comp className={cn("font-display font-extrabold italic uppercase tracking-tight text-balance", sizes[size], className)}>
      {children}
    </Comp>
  );
}

export function Accent({
  children,
  tone = "optic",
  className,
}: {
  children: React.ReactNode;
  tone?: "optic" | "magenta" | "gradient";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-brush not-italic font-normal normal-case relative -top-[0.06em] inline-block -rotate-2 px-[0.04em] text-[1.08em] leading-[0.8] align-baseline",
        tone === "optic" && "text-optic-500",
        tone === "magenta" && "text-magenta-500",
        tone === "gradient" && "text-brand-gradient",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Eyebrow({ children, className, dot = true }: { children: React.ReactNode; className?: string; dot?: boolean }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/85 backdrop-blur",
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-magenta-400 animate-pulse-dot" aria-hidden />}
      {children}
    </p>
  );
}

export function Lead({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl text-pretty", className)}>{children}</p>;
}
