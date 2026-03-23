"use client";

import { useMemo, useState } from "react";
import { Locale, Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function ProductSizeSelector({ product, locale }: { product: Product; locale: Locale }) {
  const orderedSizes = [...(product.product_sizes ?? [])].sort((a, b) => Number(b.is_default) - Number(a.is_default) || a.sort_order - b.sort_order);
  const [selectedSizeId, setSelectedSizeId] = useState(orderedSizes[0]?.id ?? "");
  const selectedSize = useMemo(() => orderedSizes.find((item) => item.id === selectedSizeId) ?? orderedSizes[0], [orderedSizes, selectedSizeId]);

  if (!orderedSizes.length) return null;

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-3 text-sm font-semibold text-maroon">{locale === "ar" ? "المقاسات" : "Sizes"}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {orderedSizes.map((size) => {
            const label = locale === "ar" ? size.label_ar : size.label_en;
            return (
              <button
                key={size.id}
                type="button"
                onClick={() => setSelectedSizeId(size.id)}
                className={`rounded-[22px] border px-4 py-4 text-start transition ${selectedSizeId === size.id ? "border-maroon bg-maroon text-white" : "border-maroon/10 bg-[#fff8f8] text-maroon hover:bg-blush"}`}
              >
                <p className="font-semibold">{label}</p>
                <p className={`mt-2 text-sm ${selectedSizeId === size.id ? "text-white/80" : "text-maroon/70"}`}>{formatCurrency(size.price)}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-[26px] bg-gradient-to-r from-maroon to-rose p-5 text-white shadow-soft">
        <p className="text-sm text-white/70">{locale === "ar" ? "السعر" : "Price"}</p>
        <p className="mt-2 font-serif text-4xl">{selectedSize ? formatCurrency(selectedSize.price) : "—"}</p>
      </div>
    </div>
  );
}
