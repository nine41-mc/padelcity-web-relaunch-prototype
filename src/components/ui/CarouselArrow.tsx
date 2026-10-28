import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "./cn";

/**
 * Carousel step button (Figma: Carousel Arrow) – coaches, testimonials, club showcase, store screenshots.
 * 44 px circle, border white/40, hover white + white/5, disabled 30 %.
 */
export function CarouselArrow({
  direction,
  label,
  onClick,
  disabled,
  controls,
  className,
}: {
  direction: "prev" | "next";
  label: string;
  onClick: () => void;
  disabled?: boolean;
  /** id of the scrolled track (aria-controls) */
  controls?: string;
  className?: string;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-controls={controls}
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-full border border-white/40 transition hover:border-white hover:bg-white/5 disabled:pointer-events-none disabled:opacity-30",
        className,
      )}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}
