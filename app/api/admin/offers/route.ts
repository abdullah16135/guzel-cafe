import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sanitizeOfferPayload } from "@/lib/admin-utils";

const OFFER_SELECT = "*, media(*), offer_items(*, products(*))";

export async function GET() {
  await requireAdmin();
  const { data, error } = await supabaseAdmin.from("offers").select(OFFER_SELECT).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json();
  const { product_ids } = body;
  const offerPayload = sanitizeOfferPayload(body);
  const { data: offer, error } = await supabaseAdmin.from("offers").insert(offerPayload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (product_ids?.length) {
    const { error: itemsError } = await supabaseAdmin.from("offer_items").insert(product_ids.map((product_id: string, index: number) => ({ offer_id: offer.id, product_id, sort_order: index + 1 })));
    if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 400 });
  }
  return NextResponse.json(offer);
}
