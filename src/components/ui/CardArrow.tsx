import { ArrowUpRight } from "lucide-react";
import { cn } from "./cn";

const tones = {
  /** default on dark cards */
  glass: "bg-white/10 text-white group-hover:bg-brand-gradient",
  /** on photos (club poster) */
  photo: "bg-white/15 text-white backdrop-blur group-hover:bg-brand-gradient",
  /** featured article – white disc, ink arrow */
  solid: "bg-fg text-fg-inverse",
};

/**
 * Round arrow at the corner of a linked card (Figma: Card Arrow). Decorative – the whole card is the link,
 * so it is a span with aria-hidden. Turns 45° on card hover (the card carries `group`).
 */
export function CardArrow({ tone = "glass", size = "md", className }: { tone?: keyof typeof tones; size?: "sm" | "md"; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full transition-all duration-300 group-hover:rotate-45",
        size === "md" ? "size-11" : "size-9",
        tones[tone],
        className,
      )}
    >
      <ArrowUpRight className={size === "md" ? "size-5" : "size-4"} />
    </span>
  );
}
