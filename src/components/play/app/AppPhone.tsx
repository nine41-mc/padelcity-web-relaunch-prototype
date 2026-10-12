import type { AppScreenshot } from "@/lib/content/app";
import { PhoneMockup } from "../PhoneMockup";
import { AppScreenImage } from "../AppScreens";

/** Phone frame + real app screenshot; the screenshot's alt text becomes the phone's accessible label. */
export function AppPhone({
  shot,
  prefix,
  className,
  sizes,
  priority,
}: {
  shot: AppScreenshot;
  prefix: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <PhoneMockup className={className} label={shot.alt} prefix={prefix} statusBar={!shot.hasStatusBar}>
      <AppScreenImage shot={shot} sizes={sizes} priority={priority} />
    </PhoneMockup>
  );
}
