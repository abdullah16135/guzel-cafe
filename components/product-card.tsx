"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { Locale, Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { pickLocaleText } from "@/lib/i18n";
import { MediaTile } from "@/components/media-tile";
import { cn } from "@/lib/utils";

export function ProductCard({ product, locale, compact = false }: { product: Product; locale: Locale; compact?: boolean }) {
  const name = pickLocaleText(locale, product.name_ar, product.name_en);
  const description = pickLocaleText(locale, product.description_ar, product.description_en);
  const sizes = useMemo(() => [...(product.product_sizes ?? [])].sort((a, b) => Number(b.is_default) - Number(a.is_default) || a.sort_order - b.sort_order), [product.product_sizes]);
  const initialSizeId = sizes[0]?.id ?? null;
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(initialSizeId);
  const selectedSize = sizes.find((item) => item.id === selectedSizeId) ?? sizes[0] ?? null;
  const activePrice = selectedSize?.price ?? null;

  return (
    <Link href={`/menu/${product.slug}`} className="block overflow-hidden rounded-[22px] border border-maroon/10 bg-white shadow-[0_8px_22px_rgba(115,18,38,0.05)] active:scale-[0.995]">
      <article className={`grid gap-0 ${compact ? "grid-cols-[96px_minmax(0,1fr)]" : "grid-cols-[112px_minmax(0,1fr)] sm:grid-cols-[128px_minmax(0,1fr)]"}`}>
        <div className={compact ? "min-h-[96px]" : "min-h-[112px] sm:min-h-[128px]"}>
          <MediaTile src={product.media?.public_url} alt={name} label={name} className="h-full rounded-none" />
        </div>

        <div className="flex min-w-0 flex-col justify-between p-3.5">
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 flex-1 font-serif text-[1rem] leading-6 text-maroon sm:text-[1.08rem]">{name}</h3>
              {activePrice ? <span className="shrink-0 text-sm font-semibold text-maroon">{formatCurrency(activePrice)}</span> : null}
            </div>

            {product.is_new ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#fff3ef] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-maroon">
                <Sparkles className="h-3 w-3" />
                New
              </span>
            ) : null}

            {description ? <p className="line-clamp-2 text-[13px] leading-5 text-maroon/66">{description}</p> : null}
          </div>

          <div className="mt-3 flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              {sizes.length === 2 ? (
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const isActive = size.id === selectedSizeId;
                    const label = pickLocaleText(locale, size.label_ar, size.label_en);
                    return (
                      <button
                        key={size.id}
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setSelectedSizeId(size.id);
                        }}
                        className={cn(
                          "inline-flex min-h-[34px] items-center rounded-full border px-3 text-[11px] font-semibold transition",
                          isActive ? "border-maroon bg-maroon text-white" : "border-maroon/12 bg-[#fff8f5] text-maroon/72"
                        )}
                        aria-pressed={isActive}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              ) : sizes.length > 2 ? (
                <p className="text-[11px] font-medium leading-5 text-maroon/48">
                  {locale === "ar" ? "اضغط لمعرفة الأحجام" : "Tap for sizes"}
                </p>
              ) : sizes.length === 1 ? (
                <p className="text-[11px] font-medium leading-5 text-maroon/48">
                  {pickLocaleText(locale, sizes[0].label_ar, sizes[0].label_en)}
                </p>
              ) : <span />}
            </div>

            <span className="inline-flex h-9 shrink-0 items-center rounded-full border border-maroon/10 px-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-maroon/70">
              {locale === "ar" ? "التفاصيل" : "Details"}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
