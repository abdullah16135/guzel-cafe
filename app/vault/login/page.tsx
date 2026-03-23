"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VaultLoginPage() {
  const [email, setEmail] = useState("Guzil.eg@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("الإيميل أو كلمة المرور غير صحيحة");
      return;
    }
    router.push("/vault");
    router.refresh();
  }

  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[#fcf8f6] px-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-[32px] border border-maroon/10 bg-white/95 p-8 text-right shadow-soft">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon text-white"><LockKeyhole className="h-5 w-5" /></div>
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-gold">دخول الإدارة</p>
            <h1 className="font-serif text-4xl text-maroon">لوحة التحكم</h1>
          </div>
        </div>
        <Input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full">دخول</Button>
      </form>
    </main>
  );
}
