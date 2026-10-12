import { cn } from "./cn";

type Tone = "ink" | "black" | "purple" | "light" | "neon";
const tones: Record<Tone, string> = {
  ink: "bg-ink-800 text-chalk",
  black: "bg-black text-chalk",
  purple: "bg-brandbook-gradient text-white",
  light: "bg-chalk text-ink-800",
  neon: "bg-neon-500 text-ink-800",
};

export function Section({
  id,
  tone = "ink",
  className,
  containerClassName,
  bleed = false,
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  bleed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("relative py-20 md:py-28 lg:py-32", tones[tone], className)}>
      {bleed ? children : <div className={cn("container-site", containerClassName)}>{children}</div>}
    </section>
  );
}
