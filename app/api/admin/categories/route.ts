import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sanitizeCategoryPayload } from "@/lib/admin-utils";

export async function GET() {
  await requireAdmin();
  const { data, error } = await supabaseAdmin.from("categories").select("*, media(*)").order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json();
  const payload = sanitizeCategoryPayload(body);
  let maxQuery = supabaseAdmin.from("categories").select("sort_order");
  maxQuery = payload.parent_id ? maxQuery.eq("parent_id", payload.parent_id) : maxQuery.is("parent_id", null);
  const { data: maxItem } = await maxQuery.order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const { data, error } = await supabaseAdmin
    .from("categories")
    .insert({ ...payload, sort_order: (maxItem?.sort_order ?? 0) + 1 })
    .select("*, media(*)")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
