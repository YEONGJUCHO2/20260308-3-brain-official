"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

type OptionalArtworkTileProps = {
  src?: string;
  alt: string;
  fallback: React.ReactNode;
  className?: string;
  imageClassName?: string;
};

export function OptionalArtworkTile({
  src,
  alt,
  fallback,
  className,
  imageClassName,
}: OptionalArtworkTileProps) {
  const [hasError, setHasError] = useState(false);
  const shouldShowImage = Boolean(src) && !hasError;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.4rem] border border-white/70 bg-white/88 shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      {shouldShowImage ? (
        <img
          src={src}
          alt={alt}
          className={cn("h-full w-full object-cover", imageClassName)}
          style={{ imageRendering: "pixelated" }}
          onError={() => setHasError(true)}
        />
      ) : (
        fallback
      )}
    </div>
  );
}
