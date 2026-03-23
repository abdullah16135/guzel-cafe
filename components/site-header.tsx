import Link from "next/link";
import { MapPin } from "lucide-react";
import { getSettings } from "@/lib/data";
import { Locale } from "@/lib/types";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SecretVaultTrigger } from "@/components/secret-vault-trigger";
import { SocialIcons } from "@/components/social-icons";
import { pickLocaleText } from "@/lib/i18n";
import { resolveMediaUrl } from "@/lib/media";

function BrandMark({ src }: { src?: string | null }) {
  const logoSrc = resolveMediaUrl(src);

  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-maroon/10 bg-white shadow-soft sm:h-14 sm:w-14">
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-maroon to-rose font-serif text-xl text-white">G</div>
      {logoSrc ? <img src={logoSrc} alt="Güzel logo" className="relative h-full w-full object-cover" loading="eager" decoding="async" fetchPriority="high" /> : null}
    </div>
  );
}

export async function SiteHeader({ locale }: { locale: Locale }) {
  const settings = await getSettings();
  const location = pickLocaleText(locale, settings.location_text_ar, settings.location_text_en);
  const cafeName = pickLocaleText(locale, settings.cafe_name_ar, settings.cafe_name_en)?.replace(/Güzil/gi, "Güzel") || "Güzel";
  const shouldShowLanguageSwitch = settings.show_language_switch && !settings.force_single_language;

  return (
    <header className="border-b border-maroon/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-3">
          <SecretVaultTrigger>
            <div className="inline-flex min-w-0 items-center gap-3 rounded-[20px] py-1">
              <BrandMark src={settings.logo_media?.public_url} />
              <div className="min-w-0">
                <h1 className="truncate font-serif text-[1.55rem] leading-none tracking-[0.02em] text-maroon sm:text-[2rem]">{cafeName}</h1>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-maroon/62">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
              </div>
            </div>
          </SecretVaultTrigger>

          <div className="flex shrink-0 items-center gap-2 pt-1">
            {shouldShowLanguageSwitch ? <LanguageSwitcher currentLocale={locale} /> : null}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          {settings.google_maps_link ? (
            <Link
              href={settings.google_maps_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center rounded-full border border-maroon/10 bg-white px-4 text-sm font-medium text-maroon/74 shadow-soft transition hover:bg-[#fff8f6]"
            >
              {locale === "ar" ? "الموقع" : "Location"}
            </Link>
          ) : <span />}

          <SocialIcons instagram={settings.instagram} tiktok={settings.tiktok} />
        </div>
      </div>
    </header>
  );
}
