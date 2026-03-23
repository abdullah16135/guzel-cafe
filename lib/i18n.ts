import { Locale } from "@/lib/types";

export function pickLocaleText(locale: Locale, ar?: string | null, en?: string | null) {
  const normalizedAr = typeof ar === "string" ? ar.trim() : "";
  const normalizedEn = typeof en === "string" ? en.trim() : "";

  if (locale === "ar") return normalizedAr || normalizedEn || "";
  return normalizedEn || normalizedAr || "";
}
