"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "./cn";

/**
 * Image with a branded fallback: if the asset is missing (prototype!) we show a
 * purple court-line placeholder instead of a broken image.
 */
export function Media({
  src,
  alt,
  className,
  imgClassName,
  priority,
  sizes = "100vw",
  overlay = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  overlay?: boolean;
}) {
  const [failed, setFailed] = useState(!src);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  // Static export: the image may finish loading before hydration, so onLoad/onError never fire.
  // complete without pixels is not proof of a broken file: a lazy image that has not started (or is switching to a
  // new srcset candidate after a resize) reports the same – decode() waits for it and only rejects when it is broken.
  useEffect(() => {
    const img = imgRef.current;
    if (!img?.complete) return;
    if (img.naturalWidth > 0) setLoaded(true);
    else img.decode().then(() => setLoaded(true), () => setFailed(true));
  }, [src]);
  return (
    <div className={cn(!/(^|\s)!?(absolute|fixed|sticky)(\s|$)/.test(className ?? "") && "relative", "overflow-hidden bg-surface", className)}>
      {(failed || !loaded) && (
        <div className="absolute inset-0 bg-brandbook-gradient opacity-80" aria-label={failed ? alt : undefined} role={failed ? "img" : undefined}>
          <div className="absolute inset-0 bg-court-lines" />
          <svg viewBox="0 0 100 50" className="absolute inset-[18%] h-[64%] w-[64%] opacity-25" fill="none" stroke="white" strokeWidth="0.6" aria-hidden>
            <rect x="1" y="1" width="98" height="48" />
            <line x1="50" y1="1" x2="50" y2="49" />
            <line x1="20" y1="1" x2="20" y2="49" />
            <line x1="80" y1="1" x2="80" y2="49" />
            <line x1="20" y1="25" x2="80" y2="25" />
          </svg>
        </div>
      )}
      {!failed && (
        <Image
          src={src!}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          ref={imgRef}
          className={cn("object-cover", imgClassName)}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
      {overlay && <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />}
    </div>
  );
}
