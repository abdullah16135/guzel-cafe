import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function PATCH(request: Request) {
  await requireAdmin();
  const body = await request.json();

  const defaultLanguage = body.default_language === "en" ? "en" : "ar";
  const showLanguageSwitch = body.show_language_switch === true;
  const forceSingleLanguage = showLanguageSwitch ? false : body.force_single_language === true;

  const payload = {
    id: body.id,
    cafe_name_ar: body.cafe_name_ar,
    cafe_name_en: body.cafe_name_en,
    description_ar: body.description_ar || null,
    description_en: body.description_en || null,
    location_text_ar: body.location_text_ar,
    location_text_en: body.location_text_en,
    google_maps_link: body.google_maps_link,
    coordinates: body.coordinates || null,
    phone: body.phone || null,
    instagram: body.instagram || null,
    tiktok: body.tiktok || null,
    admin_email: body.admin_email?.replace("Güzil", "Guzil")?.replace("güzil", "guzil") || body.admin_email || null,
    default_language: defaultLanguage,
    show_language_switch: showLanguageSwitch,
    force_single_language: forceSingleLanguage,
    offers_empty_behavior: body.offers_empty_behavior === "message" ? "message" : "hide",
    home_primary_section: body.home_primary_section === "offers" ? "offers" : "menu",
    whatsapp: null,
  };

  const { data, error } = await supabaseAdmin.from("settings").update(payload).eq("id", body.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/offers");
  revalidatePath("/contact");
  revalidatePath("/vault");

  return NextResponse.json(data);
}
