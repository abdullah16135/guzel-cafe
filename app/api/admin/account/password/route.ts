import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await requireAdmin();
  const { currentPassword, newPassword, confirmPassword } = await request.json();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json({ error: "Password confirmation mismatch" }, { status: 400 });
  }

  const email = user.email;
  if (!email) return NextResponse.json({ error: "No email found" }, { status: 400 });

  const verifier = createSupabaseClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
  const { error: signInError } = await verifier.auth.signInWithPassword({ email, password: currentPassword });
  if (signInError) return NextResponse.json({ error: "Current password is invalid" }, { status: 400 });

  const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, { password: newPassword });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
