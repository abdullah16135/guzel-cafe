import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSettings } from "@/lib/data";

export async function POST(request: Request) {
  const { locale } = await request.json();
  const settings = await getSettings();
  const cookieStore = await cookies();

  if (settings.force_single_language || !settings.show_language_switch) {
    cookieStore.set("guzil-locale", settings.default_language, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return NextResponse.json({ locale: settings.default_language });
  }

  cookieStore.set("guzil-locale", locale === "ar" ? "ar" : "en", { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return NextResponse.json({ locale: locale === "ar" ? "ar" : "en" });
}
