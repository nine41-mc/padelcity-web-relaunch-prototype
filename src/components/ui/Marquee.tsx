import { cn } from "./cn";

/** Infinite horizontal ticker. Children are rendered twice for a seamless loop. */
export function Marquee({ children, className, reverse }: { children: React.ReactNode; className?: string; reverse?: boolean }) {
  return (
    <div className={cn("relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]", className)}>
      <div className={cn("flex w-max shrink-0 animate-marquee items-center hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]", reverse && "[animation-direction:reverse]")}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
