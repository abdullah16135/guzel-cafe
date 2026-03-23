import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { getSettings } from "@/lib/data";
import { pickLocaleText } from "@/lib/i18n";
import { resolveLocale } from "@/lib/locale";

export default async function ContactPage() {
  const locale = await resolveLocale();
  const settings = await getSettings();
  const isAr = locale === "ar";

  return (
    <main className="pb-10">
      <SiteHeader locale={locale} />
      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="soft-card p-5 sm:p-6">
          <h1 className="font-serif text-4xl text-maroon">{isAr ? "تواصل معنا" : "Contact us"}</h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] bg-[#fff8f5] p-4">
              <div className="flex items-center gap-2 text-maroon"><MapPin className="h-4 w-4" /> {pickLocaleText(locale, settings.location_text_ar, settings.location_text_en)}</div>
              <Link href={settings.google_maps_link} target="_blank" className="mt-4 inline-flex rounded-full bg-maroon px-4 py-2 text-sm font-semibold text-white">{isAr ? "فتح الخريطة" : "Open maps"}</Link>
            </div>
            <div className="rounded-[24px] bg-[#fff8f5] p-4 space-y-3">
              {settings.phone ? <div className="flex items-center gap-2 text-maroon"><Phone className="h-4 w-4" /> {settings.phone}</div> : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
