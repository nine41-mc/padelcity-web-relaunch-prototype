import { cn } from "./cn";

export function Chip({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "gradient" | "solid" | "dark" | "level";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-semibold leading-tight whitespace-nowrap",
        tone === "default" && "border border-fg/35 text-fg/90",
        tone === "gradient" && "bg-brand-gradient text-white",
        tone === "solid" && "bg-fg text-fg-inverse",
        tone === "dark" && "bg-black/60 text-fg backdrop-blur",
        // Skill level ("Level 1–3") – HIGHLIGHT role: the only chip allowed in Optic Yellow
        tone === "level" && "border border-optic-500/70 text-highlight-fg",
        className,
      )}
    >
      {children}
    </span>
  );
}
