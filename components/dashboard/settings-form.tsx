"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-sm font-medium text-maroon"><span>{label}</span>{children}</label>;
}

export function SettingsForm({ initialData }: { initialData: any }) {
  const [form, setForm] = useState({ offers_empty_behavior: "hide", home_primary_section: "menu", ...initialData });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form };
    if (payload.show_language_switch) payload.force_single_language = false;
    delete payload.logo_media;
    delete payload.hero_media;
    delete payload.banner_media;
    const res = await fetch("/api/admin/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل حفظ التغييرات");
    if (result) {
      setForm((prev: any) => ({ ...prev, ...result }));
    }
    toast.success("تم حفظ التغييرات");
  }

  async function uploadAsset(file: File, type: "logo" | "hero") {
    const data = new FormData();
    data.append("file", file);
    const res = await fetch(`/api/admin/settings/${type}`, { method: "POST", body: data });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل رفع الصورة");
    toast.success(type === "logo" ? "تم رفع الشعار" : "تم رفع صورة الهيرو");
    location.reload();
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-[28px] border border-maroon/10 bg-white/90 p-5 shadow-soft lg:grid-cols-2">
      <div className="flex items-center gap-4 rounded-[24px] border border-maroon/10 bg-[#fff7f4] p-4 lg:col-span-2">
        <div className="relative h-20 w-20 overflow-hidden rounded-full border border-maroon/10 bg-white">{form.logo_media?.public_url ? <Image src={form.logo_media.public_url} alt="Logo" fill className="object-cover" sizes="80px" /> : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-maroon to-rose font-serif text-3xl text-white">G</div>}</div>
        <div className="space-y-2"><p className="font-semibold text-maroon">شعار الكافيه</p><label className="inline-flex cursor-pointer items-center rounded-full bg-maroon px-4 py-2 text-sm font-semibold text-white">رفع الشعار<input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadAsset(e.target.files[0], "logo")} /></label></div>
      </div>
      <div className="flex items-center gap-4 rounded-[24px] border border-maroon/10 bg-[#fff7f4] p-4 lg:col-span-2">
        <div className="relative h-24 w-32 overflow-hidden rounded-[22px] border border-maroon/10 bg-white">{form.hero_media?.public_url ? <Image src={form.hero_media.public_url} alt="Hero" fill className="object-cover" sizes="128px" /> : <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,_#f8d9df_0%,_#fff4ef_48%,_#ecd9cf_100%)] text-sm text-maroon/70">Hero</div>}</div>
        <div className="space-y-2"><p className="font-semibold text-maroon">صورة الهيرو</p><label className="inline-flex cursor-pointer items-center rounded-full bg-maroon px-4 py-2 text-sm font-semibold text-white">رفع الصورة<input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadAsset(e.target.files[0], "hero")} /></label></div>
      </div>
      <Field label="اسم الكافيه"><Input value={form.cafe_name_ar} onChange={(e) => setForm({ ...form, cafe_name_ar: e.target.value })} /></Field>
      <Field label="الاسم بالإنجليزية"><Input value={form.cafe_name_en} onChange={(e) => setForm({ ...form, cafe_name_en: e.target.value })} /></Field>
      <Field label="وصف الصفحة"><Textarea value={form.description_ar ?? ""} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} /></Field>
      <Field label="الوصف بالإنجليزية"><Textarea value={form.description_en ?? ""} onChange={(e) => setForm({ ...form, description_en: e.target.value })} /></Field>
      <Field label="العنوان"><Input value={form.location_text_ar} onChange={(e) => setForm({ ...form, location_text_ar: e.target.value })} /></Field>
      <Field label="العنوان بالإنجليزية"><Input value={form.location_text_en} onChange={(e) => setForm({ ...form, location_text_en: e.target.value })} /></Field>
      <Field label="رابط الخريطة"><Input value={form.google_maps_link} onChange={(e) => setForm({ ...form, google_maps_link: e.target.value })} /></Field>
      <Field label="الإحداثيات"><Input value={form.coordinates ?? ""} onChange={(e) => setForm({ ...form, coordinates: e.target.value })} /></Field>
      <Field label="رقم الهاتف"><Input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
      <Field label="إنستجرام"><Input value={form.instagram ?? ""} onChange={(e) => setForm({ ...form, instagram: e.target.value })} /></Field>
      <Field label="تيك توك"><Input value={form.tiktok ?? ""} onChange={(e) => setForm({ ...form, tiktok: e.target.value })} /></Field>
      <Field label="إيميل الأدمن"><Input value={form.admin_email ?? ""} onChange={(e) => setForm({ ...form, admin_email: e.target.value })} /></Field>
      <Field label="اللغة الافتراضية"><Select value={form.default_language} onChange={(value) => setForm({ ...form, default_language: value })} options={[{ value: "ar", label: "العربية" }, { value: "en", label: "English" }]} /></Field>
      <Field label="ما الذي يظهر أولًا"><Select value={form.home_primary_section} onChange={(value) => setForm({ ...form, home_primary_section: value })} options={[{ value: "menu", label: "المنيو" }, { value: "offers", label: "العروض" }]} /></Field>
      <Field label="عند عدم وجود عروض"><Select value={form.offers_empty_behavior} onChange={(value) => setForm({ ...form, offers_empty_behavior: value })} options={[{ value: "hide", label: "إخفاء زر العروض" }, { value: "message", label: "إظهار تنبيه داخل صفحة العروض فقط" }]} /></Field>
      <div className="grid gap-3 rounded-2xl border border-maroon/10 p-4 text-sm text-maroon lg:col-span-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.show_language_switch}
            onChange={(e) => setForm({ ...form, show_language_switch: e.target.checked, force_single_language: e.target.checked ? false : form.force_single_language })}
          />
          إظهار زر تغيير اللغة في الواجهة العامة
        </label>
        <label className={`flex items-center gap-2 ${form.show_language_switch ? "opacity-50" : ""}`}>
          <input
            type="checkbox"
            checked={form.force_single_language}
            disabled={form.show_language_switch}
            onChange={(e) => setForm({ ...form, force_single_language: e.target.checked, show_language_switch: e.target.checked ? false : form.show_language_switch })}
          />
          فرض لغة واحدة فقط عند إخفاء الزر
        </label>
        <p className="text-xs leading-6 text-maroon/60">لوحة التحكم تبقى بالعربية دائمًا. هذا الإعداد يغيّر الواجهة العامة فقط.</p>
      </div>
      <Button type="submit" className="lg:col-span-2">حفظ الإعدادات</Button>
    </form>
  );
}
