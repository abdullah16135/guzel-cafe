import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductSizeSelector } from "@/components/product-size-selector";
import { getProductBySlug } from "@/lib/data";
import { pickLocaleText } from "@/lib/i18n";
import { resolveLocale } from "@/lib/locale";
import { MediaTile } from "@/components/media-tile";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await resolveLocale();
  const product = await getProductBySlug(slug);
  const name = pickLocaleText(locale, product.name_ar, product.name_en);
  const description = pickLocaleText(locale, product.description_ar, product.description_en);
  const category = pickLocaleText(locale, product.main_category?.name_ar, product.main_category?.name_en);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[34px] border border-maroon/10 bg-white/85 shadow-soft backdrop-blur">
        <div className="border-b border-maroon/10 px-5 py-5">
          <Link href="/#menu" className="inline-flex items-center gap-2 text-sm font-semibold text-maroon/80">{locale === "ar" ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}{locale === "ar" ? "العودة إلى المنيو" : "Back to menu"}</Link>
        </div>
        <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <MediaTile
            src={product.media?.public_url}
            alt={name}
            label={name}
            contain
            className="min-h-[380px] rounded-[28px]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="space-y-5">
            {category ? <p className="inline-flex rounded-full border border-gold/30 bg-[#fff7ee] px-3 py-1 text-xs uppercase tracking-[0.28em] text-gold">{category}</p> : null}
            <h1 className="font-serif text-4xl text-maroon sm:text-5xl">{name}</h1>
            <ProductSizeSelector product={product} locale={locale} />
            {description ? <div className="rounded-[24px] border border-maroon/10 bg-[#fff9f7] p-5"><p className="leading-8 text-maroon/72">{description}</p></div> : null}
          </div>
        </div>
      </div>
    </main>
  );
}
