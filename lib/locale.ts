import "server-only";

import { cookies } from "next/headers";
import { getSettings } from "@/lib/data";
import { Locale } from "@/lib/types";

export async function resolveLocale(): Promise<Locale> {
  const settings = await getSettings();

  if (settings.force_single_language || !settings.show_language_switch) {
    return settings.default_language;
  }

  const cookieStore = await cookies();
  const locale = cookieStore.get("guzil-locale")?.value as Locale | undefined;
  return locale === "ar" || locale === "en" ? locale : settings.default_language;
}
