import { cn } from "./cn";

/**
 * Tile with label, big value and text (Figma: Info Tile) – franchise requirements, vision & mission.
 * Label grey in caps, value in Söhne with the brand gradient, text white/70–75.
 * md: grid tile (pad-card, radius 20) · lg: two-column statement (pad-banner, radius 28).
 */
export function InfoTile({ label, value, text, size = "md", className }: { label: string; value: React.ReactNode; text: string; size?: "md" | "lg"; className?: string }) {
  const lg = size === "lg";
  return (
    <div className={cn("flex h-full flex-col border border-fg/10 bg-raised", lg ? "rounded-[28px] pad-banner" : "rounded-[20px] pad-card", className)}>
      <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-fg/70">{label}</p>
      <p className={cn("mt-4 font-display font-extrabold italic uppercase text-brand-gradient", lg ? "text-4xl leading-none md:text-5xl" : "text-4xl md:text-3xl lg:text-5xl")}>{value}</p>
      <p className={cn(lg ? "mt-5 text-lg text-fg/75" : "mt-4 text-fg/70")}>{text}</p>
    </div>
  );
}
