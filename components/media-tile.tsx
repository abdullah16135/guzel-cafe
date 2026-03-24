"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { resolveMediaUrl, shouldProxyMedia } from "@/lib/media";

type MediaTileProps = {
  src?: string | null;
  alt: string;
  label?: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  contain?: boolean;
  fallbackTone?: "warm" | "dark";
};

function initialsFromLabel(label?: string) {
  if (!label) return "G";
  const words = label.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (!words.length) return "G";
  return words.map((word) => word[0]).join("").toUpperCase();
}

export function MediaTile({
  src,
  alt,
  label,
  className,
  imageClassName,
  priority = false,
  contain = false,
  fallbackTone = "warm",
}: MediaTileProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const initials = useMemo(() => initialsFromLabel(label), [label]);
  const resolvedSrc = useMemo(() => resolveMediaUrl(src), [src]);
  const hasImage = Boolean(resolvedSrc) && !hasError;
  const shouldUseEager = priority && !shouldProxyMedia(src);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [resolvedSrc]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img || !resolvedSrc) return;

    if (img.complete && img.naturalWidth > 0) {
      setIsLoaded(true);
      return;
    }

    const handleLoad = () => setIsLoaded(true);
    const handleError = () => setHasError(true);

    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);

    return () => {
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleError);
    };
  }, [resolvedSrc]);

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-[24px]",
        fallbackTone === "warm"
          ? "bg-[linear-gradient(145deg,#fff8f4_0%,#f5e7df_54%,#ecd8cd_100%)]"
          : "bg-[linear-gradient(145deg,#4f1f2d_0%,#6f3244_55%,#8f4c61_100%)]",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          fallbackTone === "warm"
            ? "bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.9),transparent_24%),radial-gradient(circle_at_82%_24%,rgba(126,20,42,0.16),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(126,20,42,0.08),transparent_30%)]"
            : "bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.18),transparent_24%),radial-gradient(circle_at_82%_24%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(0,0,0,0.14),transparent_30%)]"
        )}
      />

      <div
        className={cn(
          "relative flex h-full w-full flex-col items-center justify-center gap-3 px-5 py-6 text-center transition-opacity duration-300",
          hasImage && isLoaded ? "opacity-0" : "opacity-100"
        )}
      >
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full border font-serif text-xl tracking-[0.08em] shadow-[0_10px_24px_rgba(0,0,0,0.08)] backdrop-blur",
            fallbackTone === "warm"
              ? "border-white/55 bg-white/45 text-maroon"
              : "border-white/20 bg-white/10 text-white"
          )}
        >
          {initials}
        </div>
        <div className="space-y-1.5">
          <p
            className={cn(
              "line-clamp-2 font-serif text-lg leading-snug",
              fallbackTone === "warm" ? "text-maroon/88" : "text-white"
            )}
          >
            {label || alt}
          </p>
          <p
            className={cn(
              "text-[11px] font-semibold uppercase tracking-[0.24em]",
              fallbackTone === "warm" ? "text-maroon/45" : "text-white/65"
            )}
          >
            Güzel Café
          </p>
        </div>
      </div>

      {hasImage ? (
        <>
          <img
            ref={imgRef}
            src={resolvedSrc!}
            alt={alt}
            loading={shouldUseEager ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={shouldUseEager ? "high" : "auto"}
            className={cn(
              "absolute inset-0 h-full w-full transition duration-500",
              contain ? "object-contain p-4" : "object-cover",
              isLoaded ? "opacity-100" : "opacity-0",
              imageClassName
            )}
            onError={() => setHasError(true)}
            onLoad={() => setIsLoaded(true)}
          />

          {!isLoaded ? (
            <div className="absolute inset-0 transition duration-300 opacity-100">
              <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(255,255,255,0.08)_8%,rgba(255,255,255,0.36)_18%,rgba(255,255,255,0.08)_33%)] bg-[length:220%_100%]" />
            </div>
          ) : null}
        </>
      ) : null}

      <div className="pointer-events-none absolute inset-[10px] rounded-[inherit] border border-white/20" />
    </div>
  );
}