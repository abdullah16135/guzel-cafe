"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { slugify } from "@/lib/utils";

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-maroon">
      <span>{label}</span>
      {children}
      {hint ? <span className="text-xs font-normal text-maroon/55">{hint}</span> : null}
    </label>
  );
}

const emptyForm = {
  name_ar: "",
  name_en: "",
  slug: "",
  description_ar: "",
  description_en: "",
  parent_id: "",
  is_visible: true,
};

function cleanCategoryPayload(source: any) {
  return {
    name_ar: source.name_ar || "",
    name_en: source.name_en || "",
    slug: source.slug || slugify(source.name_en || source.name_ar),
    description_ar: source.description_ar || "",
    description_en: source.description_en || "",
    parent_id: source.parent_id || null,
    is_visible: source.is_visible !== false,
  };
}

export function CategoryManager({ initialData }: { initialData: any[] }) {
  const [items, setItems] = useState(initialData);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>(null);

  const parentOptions = useMemo(
    () => [{ value: "", label: "بدون - قسم رئيسي" }, ...items.filter((item) => !item.parent_id).map((item) => ({ value: item.id, label: item.name_ar }))],
    [items]
  );

  async function refresh() {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanCategoryPayload(form)),
    });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل إنشاء القسم");
    setForm(emptyForm);
    await refresh();
    toast.success("تم إنشاء القسم");
  }

  async function uploadImage(id: string, file: File) {
    const data = new FormData();
    data.append("file", file);
    const res = await fetch(`/api/admin/categories/${id}/image`, { method: "POST", body: data });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل رفع الصورة");
    await refresh();
    toast.success("تم رفع الصورة");
  }

  async function deleteImage(id: string) {
    const res = await fetch(`/api/admin/categories/${id}/image`, { method: "DELETE" });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل حذف الصورة");
    await refresh();
    toast.success("تم حذف الصورة");
  }

  async function toggle(id: string, isVisible: boolean) {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_visible: !isVisible }),
    });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل الحفظ");
    await refresh();
    toast.success("تم حفظ التغييرات");
  }

  async function move(id: string, direction: "up" | "down") {
    const res = await fetch(`/api/admin/categories/${id}/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction }),
    });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل ترتيب القسم");
    await refresh();
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل حذف القسم");
    await refresh();
    toast.success("تم حذف القسم");
  }

  async function saveEdit(id: string) {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanCategoryPayload(editing)),
    });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل حفظ التعديل");
    setEditingId(null);
    setEditing(null);
    await refresh();
    toast.success("تم تحديث القسم");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form onSubmit={submit} className="space-y-4 rounded-[28px] border border-maroon/10 bg-white/90 p-5 shadow-soft">
        <h3 className="font-serif text-2xl text-maroon">إضافة قسم</h3>
        <Field label="اسم القسم">
          <Input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} />
        </Field>
        <Field label="الاسم بالإنجليزية">
          <Input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} />
        </Field>
        <Field label="رابط القسم بالإنجليزية" hint="مثال: drinks أو hot-coffee">
          <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </Field>
        <Field label="القسم الرئيسي">
          <Select value={form.parent_id} onChange={(value) => setForm({ ...form, parent_id: value })} options={parentOptions} />
        </Field>
        <Field label="الوصف بالعربية">
          <Textarea value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} />
        </Field>
        <Field label="الوصف بالإنجليزية">
          <Textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-maroon"><input type="checkbox" checked={form.is_visible} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} /> ظاهر في الموقع</label>
        <Button type="submit" className="w-full">حفظ القسم</Button>
      </form>

      <div className="rounded-[28px] border border-maroon/10 bg-white/90 p-5 shadow-soft">
        <div className="space-y-3">
          {items.map((item, index) => {
            const isEditing = editingId === item.id;
            const parentName = items.find((row) => row.id === item.parent_id)?.name_ar;
            return (
              <div key={item.id} className="rounded-2xl border border-maroon/10 bg-[#fffaf8] p-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <Field label="اسم القسم"><Input value={editing.name_ar ?? ""} onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })} /></Field>
                    <Field label="الاسم بالإنجليزية"><Input value={editing.name_en ?? ""} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} /></Field>
                    <Field label="رابط القسم بالإنجليزية"><Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field>
                    <Field label="القسم الرئيسي"><Select value={editing.parent_id ?? ""} onChange={(value) => setEditing({ ...editing, parent_id: value })} options={parentOptions.filter((option) => option.value !== item.id)} /></Field>
                    <Field label="الوصف بالعربية"><Textarea value={editing.description_ar ?? ""} onChange={(e) => setEditing({ ...editing, description_ar: e.target.value })} /></Field>
                    <Field label="الوصف بالإنجليزية"><Textarea value={editing.description_en ?? ""} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} /></Field>
                    <label className="flex items-center gap-2 text-sm text-maroon"><input type="checkbox" checked={editing.is_visible !== false} onChange={(e) => setEditing({ ...editing, is_visible: e.target.checked })} /> ظاهر في الموقع</label>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" onClick={() => saveEdit(item.id)}>حفظ</Button>
                      <Button type="button" variant="outline" onClick={() => { setEditingId(null); setEditing(null); }}>إلغاء</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-[#f7ece7]">
                        {item.media?.public_url ? <Image src={item.media.public_url} alt={item.name_ar} fill className="object-cover" sizes="80px" /> : null}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-maroon">{item.name_ar}</p>
                        <p className="text-sm text-maroon/60">{item.name_en}</p>
                        <p className="text-xs text-maroon/50">{parentName ? `تابع لـ ${parentName}` : "قسم رئيسي"}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" onClick={() => move(item.id, "up")} disabled={index === 0}>↑</Button>
                      <Button type="button" variant="outline" onClick={() => move(item.id, "down")} disabled={index === items.length - 1}>↓</Button>
                      <Button type="button" variant="outline" onClick={() => { setEditingId(item.id); setEditing({ ...emptyForm, ...item, parent_id: item.parent_id ?? "" }); }}>تعديل</Button>
                      <Button type="button" variant="outline" onClick={() => toggle(item.id, item.is_visible)}>{item.is_visible ? "إخفاء" : "إظهار"}</Button>
                      <label className="inline-flex cursor-pointer items-center rounded-full border border-maroon/15 px-4 py-2 text-sm text-maroon">رفع صورة<input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(item.id, e.target.files[0])} /></label>
                      {item.media?.public_url ? <Button type="button" variant="outline" onClick={() => deleteImage(item.id)}>حذف الصورة</Button> : null}
                      <Button type="button" variant="outline" onClick={() => remove(item.id)}>حذف</Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
