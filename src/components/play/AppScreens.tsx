import Image from "next/image";
import type { AppScreenshot } from "@/lib/content/app";
import { cn } from "@/components/ui/cn";

/**
 * Real app screen (cropped from the official App Store screenshots) for use inside <PhoneMockup>.
 * The phone frame provides the accessible label, so the image itself is decorative here.
 * Crops without status bar sit below the mockup's status bar; the rest of the screen keeps the
 * app's background colour.
 */
export function AppScreenImage({
  shot,
  sizes = "320px",
  priority,
  eager,
  className,
}: {
  shot: AppScreenshot;
  sizes?: string;
  priority?: boolean;
  /** load immediately (e.g. screens swapped in by the sticky FeatureStory phone) */
  eager?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={shot.src}
      alt=""
      width={shot.width}
      height={shot.height}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : eager ? "eager" : "lazy"}
      className={cn("absolute inset-x-0 h-auto w-full", shot.hasStatusBar ? "top-0" : "top-9", className)}
    />
  );
}
