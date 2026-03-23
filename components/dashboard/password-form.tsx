"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) return toast.error("كلمة المرور الجديدة قصيرة جدًا");
    if (newPassword !== confirmPassword) return toast.error("تأكيد كلمة المرور غير مطابق");
    const res = await fetch("/api/admin/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل تغيير كلمة المرور");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("تم تغيير كلمة المرور بنجاح");
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-[28px] border border-maroon/10 bg-white/90 p-5 shadow-soft lg:grid-cols-3">
      <Input type="password" placeholder="كلمة المرور الحالية" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
      <Input type="password" placeholder="كلمة المرور الجديدة" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      <Input type="password" placeholder="تأكيد كلمة المرور الجديدة" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      <Button type="submit" className="lg:col-span-3">تحديث كلمة المرور</Button>
    </form>
  );
}
