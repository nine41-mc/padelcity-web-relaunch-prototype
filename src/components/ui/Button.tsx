import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "./cn";

type Variant = "primary" | "gradient" | "neon" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-3 rounded-full font-display italic uppercase tracking-wide transition-all duration-300 select-none whitespace-nowrap disabled:opacity-40 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  // Elephant pitch: white pill + round gradient arrow
  primary: "bg-white text-ink-800 hover:shadow-glow",
  gradient: "bg-brand-gradient text-white hover:shadow-glow hover:brightness-110",
  neon: "bg-neon-500 text-ink-800 hover:bg-neon-400 hover:shadow-neon",
  outline: "border-2 border-white/60 text-white hover:border-white hover:bg-white/5",
  ghost: "text-white hover:text-neon-500",
};

const sizes: Record<Size, string> = {
  // Söhne Schmal is condensed – it needs a larger size than Poppins to read well.
  sm: "h-11 pl-5 pr-1.5 text-lg",
  md: "h-13 pl-6 pr-1.5 text-lg md:text-xl",
  lg: "h-14 md:h-16 pl-7 pr-2 text-xl md:text-2xl",
};

const arrowSizes: Record<Size, string> = { sm: "size-8", md: "size-10", lg: "size-10 md:size-12" };

const arrowStyles: Record<Variant, string> = {
  primary: "bg-brand-gradient text-white",
  gradient: "bg-white/15 text-white",
  neon: "bg-ink-800 text-neon-500",
  outline: "bg-white/10 text-white",
  ghost: "bg-white/10 text-white",
};

type Props = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
} & (
  | ({ href: string; external?: boolean } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">)
  | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">)
);

export function Button({ variant = "primary", size = "md", arrow = true, className, children, ...rest }: Props) {
  const cls = cn(base, variants[variant], sizes[size], !arrow && "px-6", className);
  const content = (
    <>
      <span className="pt-0.5 leading-none">{children}</span>
      {arrow && (
        <span
          className={cn(
            "grid place-items-center rounded-full transition-transform duration-300 group-hover/btn:rotate-45",
            arrowSizes[size],
            arrowStyles[variant],
          )}
          aria-hidden
        >
          <ArrowUpRight className="size-1/2" strokeWidth={2.5} />
        </span>
      )}
    </>
  );
  if ("href" in rest && rest.href !== undefined) {
    const { href, external, ...anchor } = rest;
    if (external || href.startsWith("http")) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...anchor}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...anchor}>
        {content}
      </Link>
    );
  }
  const { href: _h, ...button } = rest as { href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>;
  void _h;
  return (
    <button className={cls} {...button}>
      {content}
    </button>
  );
}
