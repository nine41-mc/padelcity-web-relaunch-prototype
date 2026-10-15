import { cn } from "./cn";

/** Each half repeats the children this often, so one half is wider than any screen (no empty strip on wide displays). */
const REPEAT = 4;

/** Infinite horizontal ticker: two identical halves, the track moves by one half for a seamless loop. */
export function Marquee({ children, className, reverse }: { children: React.ReactNode; className?: string; reverse?: boolean }) {
  const half = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {Array.from({ length: REPEAT }, (_, i) => (
        <div key={i} className="flex shrink-0 items-center" aria-hidden={(!hidden && i > 0) || undefined}>
          {children}
        </div>
      ))}
    </div>
  );
  return (
    <div className={cn("relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]", className)}>
      {/* 40 s per content length (as before) × REPEAT */}
      <div className={cn("flex w-max shrink-0 animate-marquee items-center [animation-duration:160s] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]", reverse && "[animation-direction:reverse]")}>
        {half(false)}
        {half(true)}
      </div>
    </div>
  );
}
