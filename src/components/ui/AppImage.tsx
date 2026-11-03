import Image from "next/image";
import type { ComponentProps } from "react";

/**
 * next/image for the static export. Local files (`/images/…`) exist in one size only, so they are served
 * unoptimized (no srcset of identical URLs, no dev warning "loader does not implement width") with the
 * basePath prefixed here. Remote sources (Contentful) keep going through the global loader for resizing.
 */
export function AppImage({ src, alt, unoptimized, ...props }: ComponentProps<typeof Image>) {
  if (typeof src === "string" && src.startsWith("/")) {
    return <Image {...props} alt={alt} src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}`} unoptimized />;
  }
  return <Image {...props} alt={alt} src={src} unoptimized={unoptimized} />;
}
