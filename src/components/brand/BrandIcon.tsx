import {
  Briefcase,
  Building2,
  Clapperboard,
  Gift,
  GraduationCap,
  Handshake,
  Instagram,
  Laptop,
  Megaphone,
  PartyPopper,
  Rocket,
  Shirt,
  Smartphone,
  Sparkles,
  Store,
  Trophy,
  Users,
} from "lucide-react";
import { AppIcon } from "../ui/Icon";
import { cn } from "../ui/cn";

const lucide = {
  briefcase: Briefcase,
  building: Building2,
  clapperboard: Clapperboard,
  gift: Gift,
  graduation: GraduationCap,
  handshake: Handshake,
  instagram: Instagram,
  laptop: Laptop,
  megaphone: Megaphone,
  party: PartyPopper,
  rocket: Rocket,
  shirt: Shirt,
  smartphone: Smartphone,
  sparkles: Sparkles,
  store: Store,
  trophy: Trophy,
  users: Users,
} as const;

/** App icons (from /public/icons) take precedence; otherwise a lucide icon. */
const appIcons: Record<string, string> = { padel: "padel", court: "double_court" };

export type BrandIconName = keyof typeof lucide | "padel" | "court";

/** Round icon badge used on brand / B2B pages. */
export function BrandIcon({ name, className, tone = "gradient" }: { name: BrandIconName; className?: string; tone?: "gradient" | "neon" | "glass" }) {
  const Lucide = name in lucide ? lucide[name as keyof typeof lucide] : null;
  return (
    <span
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-2xl",
        tone === "gradient" && "bg-brand-gradient text-white",
        tone === "neon" && "bg-neon-500 text-ink-800",
        tone === "glass" && "border border-white/15 bg-white/5 text-white",
        className,
      )}
      aria-hidden
    >
      {Lucide ? <Lucide className="size-5" strokeWidth={2} /> : <AppIcon name={appIcons[name] ?? "padel"} className="size-6" />}
    </span>
  );
}
