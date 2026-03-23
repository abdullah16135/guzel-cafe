import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { getOffers, getSettings } from "@/lib/data";
import { pickLocaleText } from "@/lib/i18n";
import { resolveLocale } from "@/lib/locale";
import { formatCurrency } from "@/lib/utils";

export default async function OffersPage() {
  const locale = await resolveLocale();
  const [offers, settings] = await Promise.all([getOffers(true), getSettings()]);
  const isAr = locale === "ar";

  return (
    <main className="pb-10">
      <SiteHeader locale={locale} />
      <section className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="soft-card p-5 sm:p-6">
          <h1 className="font-serif text-4xl text-maroon">{isAr ? "العروض" : "Offers"}</h1>
          <p className="mt-2 text-sm text-maroon/70">{isAr ? "كل عرض مربوط بمنتجات حقيقية داخل المنيو." : "Every offer is connected to real products in the menu."}</p>

          {!offers.length && settings.offers_empty_behavior === "message" ? (
            <div className="mt-6 rounded-[24px] border border-maroon/10 bg-[#fff9f7] p-6 text-center text-maroon/75">
              {isAr ? "لا توجد عروض متاحة الآن." : "There are no offers available right now."}
            </div>
          ) : null}

          {offers.length ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {offers.map((offer) => (
                <Link key={offer.id} href={`/offers/${offer.slug}`} className="group overflow-hidden rounded-[24px] border border-maroon/10 bg-[#fff9f7] p-4 transition hover:-translate-y-1 hover:shadow-soft active:scale-[0.99]">
                  <div className="relative mb-4 h-48 overflow-hidden rounded-[20px] bg-gradient-to-br from-[#f7d4dd] via-[#f8efe5] to-[#ecd7ca]">
                    {offer.media?.public_url ? <Image src={offer.media.public_url} alt={pickLocaleText(locale, offer.name_ar, offer.name_en)} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" /> : null}
                  </div>
                  <h3 className="font-serif text-2xl text-maroon">{pickLocaleText(locale, offer.name_ar, offer.name_en)}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-maroon/70">{pickLocaleText(locale, offer.description_ar, offer.description_en)}</p>
                  <div className="mt-4 text-lg font-semibold text-maroon">{formatCurrency(offer.offer_price)}</div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
