import { asset } from "@/lib/asset";
import { cn } from "./cn";

/**
 * Renders an app icon from /public/icons (copied from mobile-app-flutter/assets/icons)
 * as a CSS mask so it inherits `currentColor`.
 */
export function AppIcon({ name, className, label }: { name: string; className?: string; label?: string }) {
  const url = `url(${asset(`/icons/${name}.svg`)})`;
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("inline-block size-6 shrink-0 bg-current", className)}
      style={{ maskImage: url, WebkitMaskImage: url, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }}
    />
  );
}
