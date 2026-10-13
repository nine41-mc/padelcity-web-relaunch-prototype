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
        tone === "default" && "border border-white/35 text-white/90",
        tone === "gradient" && "bg-brand-gradient text-white",
        tone === "solid" && "bg-white text-ink-800",
        tone === "dark" && "bg-black/60 text-white backdrop-blur",
        // Skill level ("Level 1–3") – HIGHLIGHT role: the only chip allowed in neon
        tone === "level" && "border border-neon-500/70 text-neon-500",
        className,
      )}
    >
      {children}
    </span>
  );
}
