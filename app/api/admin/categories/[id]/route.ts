import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sanitizeCategoryPayload } from "@/lib/admin-utils";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const body = await request.json();
  const { id } = await params;

  const payload = body.name_ar !== undefined || body.name_en !== undefined || body.slug !== undefined || body.parent_id !== undefined || body.description_ar !== undefined || body.description_en !== undefined
    ? sanitizeCategoryPayload(body, id)
    : { is_visible: body.is_visible !== false };

  const { data, error } = await supabaseAdmin.from("categories").update(payload).eq("id", id).select("*, media(*)").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (payload.is_visible === false) await supabaseAdmin.from("products").update({ is_visible: false }).eq("category_id", id);
  return NextResponse.json(data);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
