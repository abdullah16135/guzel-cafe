import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sanitizeProductPayload, sanitizeProductSizes } from "@/lib/admin-utils";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const body = await request.json();

  const updatePayload = body.name_ar !== undefined || body.name_en !== undefined || body.slug !== undefined || body.category_id !== undefined || body.description_ar !== undefined || body.description_en !== undefined || body.is_new !== undefined
    ? sanitizeProductPayload(body)
    : { is_visible: body.is_visible !== false };

  const { data, error } = await supabaseAdmin.from("products").update(updatePayload).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (Array.isArray(body.sizes)) {
    const sizes = sanitizeProductSizes(body.sizes);
    await supabaseAdmin.from("product_sizes").delete().eq("product_id", id);
    if (sizes.length) {
      const { error: sizesError } = await supabaseAdmin.from("product_sizes").insert(
        sizes.map((size) => ({ ...size, product_id: id }))
      );
      if (sizesError) return NextResponse.json({ error: sizesError.message }, { status: 400 });
    }
  }

  return NextResponse.json(data);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const { data: product } = await supabaseAdmin.from("products").select("media_id, media(*)").eq("id", id).single();
  const productMedia = Array.isArray(product?.media) ? product.media[0] : product?.media;
  if (productMedia?.path) await supabaseAdmin.storage.from("guzil-media").remove([productMedia.path]);
  if (product?.media_id) await supabaseAdmin.from("media").delete().eq("id", product.media_id);
  await supabaseAdmin.from("product_sizes").delete().eq("product_id", id);
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
