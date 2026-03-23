import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sanitizeProductPayload, sanitizeProductSizes } from "@/lib/admin-utils";

export async function GET() {
  await requireAdmin();
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*, categories(*), product_sizes(*), media(*)")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json();
  const sizes = sanitizeProductSizes(body.sizes);
  const productPayload = sanitizeProductPayload(body);

  const { data: product, error } = await supabaseAdmin.from("products").insert(productPayload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (sizes.length) {
    const { error: sizesError } = await supabaseAdmin.from("product_sizes").insert(
      sizes.map((size) => ({ ...size, product_id: product.id }))
    );
    if (sizesError) return NextResponse.json({ error: sizesError.message }, { status: 400 });
  }
  return NextResponse.json(product);
}
