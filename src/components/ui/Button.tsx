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
  // HIGHLIGHT role – reserved for the newsletter module only (see globals.css colour roles)
  neon: "bg-neon-500 text-ink-800 hover:bg-neon-400 hover:shadow-neon",
  outline: "border-2 border-white/60 text-white hover:border-white hover:bg-white/5",
  ghost: "text-white hover:text-magenta-300",
};

// Söhne Schmal is condensed – it needs a larger size than Poppins to read well.
const sizes: Record<Size, string> = {
  sm: "h-11 text-lg",
  md: "h-13 text-lg md:text-xl",
  lg: "h-14 md:h-16 text-xl md:text-2xl",
};
// With arrow: text left, round arrow right. Without arrow: symmetric padding so the label is centred.
const paddings: Record<Size, { arrow: string; plain: string }> = {
  sm: { arrow: "pl-5 pr-1.5", plain: "px-5" },
  md: { arrow: "pl-6 pr-1.5", plain: "px-7" },
  lg: { arrow: "pl-7 pr-2", plain: "px-8" },
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
  const cls = cn(base, variants[variant], sizes[size], arrow ? paddings[size].arrow : paddings[size].plain, className);
  const content = (
    <>
      {/* No top nudge: measured Söhne Schmal caps ink sits within 0.4px of the line centre; pt-0.5 pushed labels ~1.4px low */}
      <span className="leading-none">{children}</span>
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
