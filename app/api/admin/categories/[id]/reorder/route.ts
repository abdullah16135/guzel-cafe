import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { direction } = await request.json();
  const { id } = await params;

  const { data: current } = await supabaseAdmin.from("categories").select("id, sort_order, parent_id").eq("id", id).single();
  if (!current) return NextResponse.json({ error: "Category not found" }, { status: 404 });

  const comparator = direction === "up" ? "lt" : "gt";
  const ascending = direction !== "up";

  let query = supabaseAdmin.from("categories").select("id, sort_order");
  query = current.parent_id ? query.eq("parent_id", current.parent_id) : query.is("parent_id", null);
  query = comparator === "lt" ? query.lt("sort_order", current.sort_order) : query.gt("sort_order", current.sort_order);
  const { data: neighbor } = await query.order("sort_order", { ascending }).limit(1).maybeSingle();

  if (!neighbor) return NextResponse.json({ ok: true });

  await supabaseAdmin.from("categories").update({ sort_order: neighbor.sort_order }).eq("id", current.id);
  await supabaseAdmin.from("categories").update({ sort_order: current.sort_order }).eq("id", neighbor.id);

  return NextResponse.json({ ok: true });
}
