export const dynamic = "force-dynamic";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { MenuTabs } from "@/components/menu-tabs";
import { getGroupedMenu, getOffers, getSettings } from "@/lib/data";
import { pickLocaleText } from "@/lib/i18n";
import { resolveLocale } from "@/lib/locale";
import { MediaTile } from "@/components/media-tile";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; section?: string }>;
}) {
  const locale = await resolveLocale();
  const params = (await searchParams) ?? {};
  const [groups, offers, settings] = await Promise.all([getGroupedMenu(locale), getOffers(true), getSettings()]);
  const isAr = locale === "ar";
  const hasOffers = offers.length > 0;
  const cafeName = (pickLocaleText(locale, settings.cafe_name_ar, settings.cafe_name_en) || "Güzel").replace(/Güzil/gi, "Güzel");
  const description = pickLocaleText(locale, settings.description_ar, settings.description_en);

  return (
    <main className="pb-10">
      <SiteHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[28px] border border-maroon/10 bg-white shadow-[0_16px_38px_rgba(115,18,38,0.06)]">
          <div className="grid md:grid-cols-[1fr_0.82fr]">
            <div className="p-4 sm:p-6 lg:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-gold">Güzel Café</p>
              <h2 className="mt-3 font-serif text-[2rem] leading-tight text-maroon sm:text-[2.6rem]">{cafeName}</h2>
              {description ? <p className="mt-3 max-w-[36rem] text-sm leading-7 text-maroon/68 sm:text-base">{description}</p> : null}
              <div className="mt-5 grid gap-2.5 sm:flex sm:flex-wrap sm:items-center">
                <Link href="#menu" className="inline-flex h-12 w-full items-center justify-center rounded-full bg-maroon px-5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition active:scale-[0.995] sm:w-auto">
                  {isAr ? "المنيو" : "Menu"}
                </Link>
                {hasOffers ? (
                  <Link href="/offers" className="inline-flex h-12 items-center justify-center rounded-full border border-maroon/10 bg-[#fff8f5] px-5 text-sm font-semibold text-maroon sm:w-auto">
                    {isAr ? "العروض" : "Offers"}
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="relative min-h-[180px] md:min-h-full">
              <MediaTile src={settings.hero_media?.public_url || "/assets/rose-hero.jpg"} alt={cafeName} label={cafeName} className="h-full rounded-none" fallbackTone="warm" priority />
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <div className="px-1">
            <p className="text-[11px] uppercase tracking-[0.32em] text-gold">{isAr ? "المنيو" : "Menu"}</p>
            <h2 className="mt-2 font-serif text-[1.8rem] text-maroon sm:text-[2.2rem]">{isAr ? "اختر القسم" : "Choose a category"}</h2>
          </div>
          <MenuTabs groups={groups} offers={offers} locale={locale} selectedCategory={params.category} selectedSection={params.section} />
        </div>
      </section>
    </main>
  );
}
