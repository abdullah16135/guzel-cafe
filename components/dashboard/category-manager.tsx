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
  sort_order: 1,
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
    sort_order: Number(source.sort_order || 1),
    is_visible: source.is_visible !== false,
  };
}

function CategoryCard({
  item,
  parentName,
  canMoveUp,
  canMoveDown,
  onMove,
  onEdit,
  onToggle,
  onDelete,
  onUploadImage,
  onDeleteImage,
}: any) {
  return (
    <div className="rounded-2xl border border-maroon/10 bg-[#fffaf8] p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-[#f7ece7]">
            {item.media?.public_url ? <Image src={item.media.public_url} alt={item.name_ar} fill className="object-cover" sizes="80px" /> : null}
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-maroon">{item.name_ar}</p>
              <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.parent_id ? "bg-[#fff3ef] text-maroon" : "bg-[#f2f6ff] text-[#314b7d]"}`}>
                {item.parent_id ? "قسم فرعي" : "قسم رئيسي"}
              </span>
              <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-maroon/70">ترتيب #{item.sort_order}</span>
            </div>
            <p className="text-sm text-maroon/60">{item.name_en}</p>
            <p className="text-xs text-maroon/50">{parentName ? `تابع لـ ${parentName}` : "يظهر كقسم رئيسي في المنيو"}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => onMove(item.id, "up")} disabled={!canMoveUp}>↑</Button>
          <Button type="button" variant="outline" onClick={() => onMove(item.id, "down")} disabled={!canMoveDown}>↓</Button>
          <Button type="button" variant="outline" onClick={() => onEdit(item)}>تعديل</Button>
          <Button type="button" variant="outline" onClick={() => onToggle(item.id, item.is_visible)}>{item.is_visible ? "إخفاء" : "إظهار"}</Button>
          <label className="inline-flex cursor-pointer items-center rounded-full border border-maroon/15 px-4 py-2 text-sm text-maroon">رفع صورة<input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUploadImage(item.id, e.target.files[0])} /></label>
          {item.media?.public_url ? <Button type="button" variant="outline" onClick={() => onDeleteImage(item.id)}>حذف الصورة</Button> : null}
          <Button type="button" variant="outline" onClick={() => onDelete(item.id)}>حذف</Button>
        </div>
      </div>
    </div>
  );
}

export function CategoryManager({ initialData }: { initialData: any[] }) {
  const [items, setItems] = useState(initialData);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>(null);

  const mainCategories = useMemo(() => items.filter((item) => !item.parent_id).sort((a, b) => a.sort_order - b.sort_order), [items]);
  const subcategories = useMemo(() => items.filter((item) => !!item.parent_id).sort((a, b) => a.sort_order - b.sort_order), [items]);
  const parentOptions = useMemo(() => [{ value: "", label: "قسم رئيسي" }, ...mainCategories.map((item) => ({ value: item.id, label: item.name_ar }))], [mainCategories]);

  function getSiblingInfo(item: any) {
    const siblings = items.filter((row) => (row.parent_id ?? null) === (item.parent_id ?? null)).sort((a, b) => a.sort_order - b.sort_order);
    const index = siblings.findIndex((row) => row.id === item.id);
    return {
      canMoveUp: index > 0,
      canMoveDown: index !== -1 && index < siblings.length - 1,
      parentName: mainCategories.find((row) => row.id === item.parent_id)?.name_ar,
    };
  }

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
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <form onSubmit={submit} className="space-y-4 rounded-[28px] border border-maroon/10 bg-white/90 p-5 shadow-soft">
        <div>
          <h3 className="font-serif text-2xl text-maroon">إضافة قسم</h3>
          <p className="mt-1 text-sm leading-6 text-maroon/60">أنشئ قسمًا رئيسيًا أولًا، ثم اربط به قسمًا فرعيًا واضحًا لاحتواء المنتجات.</p>
        </div>
        <Field label="نوع القسم">
          <Select value={form.parent_id ? "sub" : "main"} onChange={(value) => setForm({ ...form, parent_id: value === "main" ? "" : form.parent_id })} options={[{ value: "main", label: "قسم رئيسي" }, { value: "sub", label: "قسم فرعي" }]} />
        </Field>
        <Field label="اسم القسم بالعربية"><Input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} /></Field>
        <Field label="اسم القسم بالإنجليزية"><Input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} /></Field>
        <Field label="Slug" hint="مثال: drinks أو iced-coffee"><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></Field>
        <Field label="القسم الرئيسي الأب">
          <Select value={form.parent_id} onChange={(value) => setForm({ ...form, parent_id: value })} options={parentOptions} />
        </Field>
        <Field label="الترتيب"><Input type="number" min={1} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value || 1) })} /></Field>
        <Field label="الوصف بالعربية"><Textarea value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} /></Field>
        <Field label="الوصف بالإنجليزية"><Textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} /></Field>
        <label className="flex items-center gap-2 text-sm text-maroon"><input type="checkbox" checked={form.is_visible} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} /> ظاهر في الموقع</label>
        <Button type="submit" className="w-full">حفظ القسم</Button>
      </form>

      <div className="space-y-6 rounded-[28px] border border-maroon/10 bg-white/90 p-5 shadow-soft">
        {editingId && editing ? (
          <div className="rounded-[24px] border border-maroon/10 bg-[#fffaf8] p-4">
            <h4 className="mb-3 font-serif text-xl text-maroon">تعديل القسم</h4>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="اسم القسم بالعربية"><Input value={editing.name_ar ?? ""} onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })} /></Field>
              <Field label="اسم القسم بالإنجليزية"><Input value={editing.name_en ?? ""} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} /></Field>
              <Field label="Slug"><Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field>
              <Field label="القسم الرئيسي الأب"><Select value={editing.parent_id ?? ""} onChange={(value) => setEditing({ ...editing, parent_id: value })} options={parentOptions.filter((option) => option.value !== editing.id)} /></Field>
              <Field label="الترتيب"><Input type="number" min={1} value={editing.sort_order ?? 1} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value || 1) })} /></Field>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Field label="الوصف بالعربية"><Textarea value={editing.description_ar ?? ""} onChange={(e) => setEditing({ ...editing, description_ar: e.target.value })} /></Field>
              <Field label="الوصف بالإنجليزية"><Textarea value={editing.description_en ?? ""} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} /></Field>
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm text-maroon"><input type="checkbox" checked={editing.is_visible !== false} onChange={(e) => setEditing({ ...editing, is_visible: e.target.checked })} /> ظاهر في الموقع</label>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" onClick={() => saveEdit(editing.id)}>حفظ</Button>
              <Button type="button" variant="outline" onClick={() => { setEditingId(null); setEditing(null); }}>إلغاء</Button>
            </div>
          </div>
        ) : null}

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-xl text-maroon">الأقسام الرئيسية</h4>
            <span className="text-sm text-maroon/55">{mainCategories.length}</span>
          </div>
          <div className="space-y-3">
            {mainCategories.map((item) => {
              const siblingInfo = getSiblingInfo(item);
              return (
                <CategoryCard
                  key={item.id}
                  item={item}
                  {...siblingInfo}
                  onMove={move}
                  onEdit={(value: any) => { setEditingId(value.id); setEditing({ ...emptyForm, ...value, parent_id: value.parent_id ?? "" }); }}
                  onToggle={toggle}
                  onDelete={remove}
                  onUploadImage={uploadImage}
                  onDeleteImage={deleteImage}
                />
              );
            })}
          </div>
        </section>

        <section className="space-y-3 border-t border-maroon/10 pt-5">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-xl text-maroon">الأقسام الفرعية</h4>
            <span className="text-sm text-maroon/55">{subcategories.length}</span>
          </div>
          <div className="space-y-3">
            {subcategories.map((item) => {
              const siblingInfo = getSiblingInfo(item);
              return (
                <CategoryCard
                  key={item.id}
                  item={item}
                  {...siblingInfo}
                  onMove={move}
                  onEdit={(value: any) => { setEditingId(value.id); setEditing({ ...emptyForm, ...value, parent_id: value.parent_id ?? "" }); }}
                  onToggle={toggle}
                  onDelete={remove}
                  onUploadImage={uploadImage}
                  onDeleteImage={deleteImage}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
