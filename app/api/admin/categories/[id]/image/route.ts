import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const form = await request.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = file.name.split(".").pop() || "jpg";
  const path = `categories/${id}/${randomUUID()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabaseAdmin.storage.from("guzil-media").upload(path, bytes, { contentType: file.type, upsert: true });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 400 });

  const { data: pub } = supabaseAdmin.storage.from("guzil-media").getPublicUrl(path);
  const { data: media, error: mediaError } = await supabaseAdmin.from("media").insert({ bucket: "guzil-media", path, public_url: pub.publicUrl }).select().single();
  if (mediaError) return NextResponse.json({ error: mediaError.message }, { status: 400 });

  const { error: categoryError } = await supabaseAdmin.from("categories").update({ media_id: media.id }).eq("id", id);
  if (categoryError) return NextResponse.json({ error: categoryError.message }, { status: 400 });

  return NextResponse.json(media);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const { data: category } = await supabaseAdmin.from("categories").select("media_id, media(*)").eq("id", id).single();
  const categoryMedia = Array.isArray(category?.media) ? category.media[0] : category?.media;
  if (categoryMedia?.path) await supabaseAdmin.storage.from("guzil-media").remove([categoryMedia.path]);
  if (category?.media_id) await supabaseAdmin.from("media").delete().eq("id", category.media_id);
  await supabaseAdmin.from("categories").update({ media_id: null }).eq("id", id);
  return NextResponse.json({ ok: true });
}
