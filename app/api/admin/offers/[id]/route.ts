import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sanitizeOfferPayload } from "@/lib/admin-utils";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const body = await request.json();
  const { product_ids } = body;

  const updatePayload = body.name_ar !== undefined || body.name_en !== undefined || body.slug !== undefined || body.description_ar !== undefined || body.description_en !== undefined || body.offer_price !== undefined || body.category_ids !== undefined || body.section_ids !== undefined
    ? sanitizeOfferPayload(body)
    : { is_visible: body.is_visible !== false };

  const { data, error } = await supabaseAdmin.from("offers").update(updatePayload).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (Array.isArray(product_ids)) {
    await supabaseAdmin.from("offer_items").delete().eq("offer_id", id);
    if (product_ids.length) {
      const { error: itemsError } = await supabaseAdmin.from("offer_items").insert(product_ids.map((product_id: string, index: number) => ({ offer_id: id, product_id, sort_order: index + 1 })));
      if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 400 });
    }
  }

  return NextResponse.json(data);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const { data: offer } = await supabaseAdmin.from("offers").select("media_id, media(*)").eq("id", id).single();
  const offerMedia = Array.isArray(offer?.media) ? offer.media[0] : offer?.media;
  if (offerMedia?.path) await supabaseAdmin.storage.from("guzil-media").remove([offerMedia.path]);
  if (offer?.media_id) await supabaseAdmin.from("media").delete().eq("id", offer.media_id);
  await supabaseAdmin.from("offer_items").delete().eq("offer_id", id);
  const { error } = await supabaseAdmin.from("offers").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
