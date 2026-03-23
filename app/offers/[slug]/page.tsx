import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { getOfferBySlug } from "@/lib/data";
import { pickLocaleText } from "@/lib/i18n";
import { resolveLocale } from "@/lib/locale";
import { formatCurrency } from "@/lib/utils";

export default async function OfferDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await resolveLocale();
  const isAr = locale === "ar";
  const offer = await getOfferBySlug(slug);

  return (
    <main className="pb-10">
      <SiteHeader locale={locale} />
      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="soft-card overflow-hidden p-4 sm:p-6">
          <Link href="/offers" className="inline-flex items-center gap-2 text-sm text-maroon/75">
            {isAr ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {isAr ? "رجوع للعروض" : "Back to offers"}
          </Link>
          <div className="mt-4 grid gap-6 lg:grid-cols-2 lg:items-start">
            <div className="relative min-h-[320px] overflow-hidden rounded-[28px] bg-gradient-to-br from-[#f7d4dd] via-[#f8efe5] to-[#ecd7ca]">
              {offer.media?.public_url ? <Image src={offer.media.public_url} alt={pickLocaleText(locale, offer.name_ar, offer.name_en)} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" /> : null}
            </div>
            <div>
              <span className="inline-flex rounded-full bg-maroon px-3 py-1 text-xs font-semibold text-white">{isAr ? (offer.badge_ar || "عرض") : (offer.badge_en || "Offer")}</span>
              <h1 className="mt-3 font-serif text-4xl text-maroon">{pickLocaleText(locale, offer.name_ar, offer.name_en)}</h1>
              <p className="mt-3 leading-8 text-maroon/72">{pickLocaleText(locale, offer.description_ar, offer.description_en)}</p>
              <div className="mt-5 rounded-[24px] bg-[#fff8f5] p-4">
                <p className="text-sm text-maroon/60">{isAr ? "السعر النهائي" : "Offer price"}</p>
                <p className="mt-1 text-3xl font-semibold text-maroon">{formatCurrency(offer.offer_price)}</p>
                {offer.original_price ? <p className="mt-1 text-sm text-maroon/45 line-through">{formatCurrency(offer.original_price)}</p> : null}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="font-serif text-2xl text-maroon">{isAr ? "المنتجات داخل العرض" : "Included products"}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(offer.offer_items ?? []).map((item) => (
                <Link key={item.id} href={`/menu/${item.products?.slug}`} className="rounded-[22px] border border-maroon/10 bg-white p-4 transition hover:bg-blush/40">
                  <p className="font-semibold text-maroon">{pickLocaleText(locale, item.products?.name_ar, item.products?.name_en)}</p>
                  <p className="mt-1 text-sm text-maroon/60">{pickLocaleText(locale, item.products?.categories?.name_ar, item.products?.categories?.name_en)}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
