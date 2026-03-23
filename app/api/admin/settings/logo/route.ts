import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

const SETTINGS_ID = "11111111-1111-1111-1111-111111111111";

export async function POST(request: Request) {
  await requireAdmin();
  const form = await request.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = file.name.split(".").pop() || "png";
  const path = `branding/logo-${randomUUID()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabaseAdmin.storage.from("guzil-media").upload(path, bytes, {
    contentType: file.type,
    upsert: true,
  });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 400 });

  const { data: pub } = supabaseAdmin.storage.from("guzil-media").getPublicUrl(path);
  const { data: media, error: mediaError } = await supabaseAdmin
    .from("media")
    .insert({ bucket: "guzil-media", path, public_url: pub.publicUrl, alt_ar: "شعار جوزيل", alt_en: "Güzil logo" })
    .select()
    .single();

  if (mediaError) return NextResponse.json({ error: mediaError.message }, { status: 400 });

  const { error: settingsError } = await supabaseAdmin.from("settings").update({ logo_media_id: media.id }).eq("id", SETTINGS_ID);
  if (settingsError) return NextResponse.json({ error: settingsError.message }, { status: 400 });

  return NextResponse.json(media);
}
