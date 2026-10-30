import { cn } from "@/components/ui/cn";

/**
 * Pure-CSS phone frame around a real app screenshot (see AppScreenImage).
 * `statusBar` renders a stylised iOS status bar for crops whose top is cut off; crops that already
 * contain the real status bar pass `statusBar={false}` (no double status bar / dynamic island).
 */
export function PhoneMockup({
  children,
  className,
  label = "PadelCity App",
  prefix = "Screenshot",
  statusBar = true,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
  prefix?: string;
  statusBar?: boolean;
}) {
  return (
    <div
      role="img"
      aria-label={`${prefix}: ${label}`}
      data-theme="dark"
      className={cn("relative aspect-[9/19] w-[260px] rounded-[44px] border border-white/20 bg-gradient-to-b from-ink-400 to-ink-600 p-[9px] shadow-[0_40px_120px_-30px_rgb(224_5_195/0.55)] md:w-[300px]", className)}
    >
      {/* side buttons */}
      <span className="absolute -left-[3px] top-28 h-10 w-[3px] rounded-l bg-ink-400" aria-hidden />
      <span className="absolute -left-[3px] top-40 h-16 w-[3px] rounded-l bg-ink-400" aria-hidden />
      <span className="absolute -right-[3px] top-36 h-20 w-[3px] rounded-r bg-ink-400" aria-hidden />
      {/* bg = the app's own background colour (#16171C) so partial crops blend in */}
      <div className="relative h-full overflow-hidden rounded-[36px] bg-[#16171c] text-fg" aria-hidden>
        {children}
        {statusBar && (
          <div className="absolute inset-x-0 top-0 z-10 flex h-9 items-center justify-between bg-[#16171c] px-6 text-[10px] font-semibold">
            <span>9:41</span>
            <span className="absolute left-1/2 top-2 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-canvas-deep" />
            <span className="flex items-center gap-1">
              <span className="h-2 w-3 rounded-[2px] border border-fg/80" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
