"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { slugify } from "@/lib/utils";

const emptySize = { label_ar: "", label_en: "", price: 0, is_default: false };

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-maroon">
      <span>{label}</span>
      {children}
      {hint ? <span className="text-xs font-normal text-maroon/55">{hint}</span> : null}
    </label>
  );
}

const makeEmptyForm = (categoryId = "") => ({
  name_ar: "",
  name_en: "",
  slug: "",
  description_ar: "",
  description_en: "",
  category_id: categoryId,
  is_new: false,
  is_visible: true,
  sizes: [{ ...emptySize, label_ar: "عادي", label_en: "Regular", price: 55, is_default: true }],
});

function cleanProductPayload(source: any) {
  return {
    name_ar: source.name_ar || "",
    name_en: source.name_en || "",
    slug: source.slug || slugify(source.name_en || source.name_ar),
    description_ar: source.description_ar || "",
    description_en: source.description_en || "",
    category_id: source.category_id,
    is_visible: source.is_visible !== false,
    is_new: !!source.is_new,
    sizes: (source.sizes || []).map((size: any) => ({
      label_ar: size.label_ar || "",
      label_en: size.label_en || "",
      price: Number(size.price || 0),
      is_default: !!size.is_default,
    })),
  };
}

export function ProductManager({ initialData, categories }: { initialData: any[]; categories: any[] }) {
  const rootCategories = useMemo(() => categories.filter((item) => !item.parent_id), [categories]);
  const [items, setItems] = useState(initialData);
  const [mainCategoryId, setMainCategoryId] = useState(rootCategories[0]?.id ?? "");
  const [form, setForm] = useState<any>(makeEmptyForm(categories[0]?.id ?? ""));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>(null);

  const subcategoryOptions = useMemo(() => {
    const linked = categories.filter((item) => item.parent_id === mainCategoryId);
    return linked.length ? linked : rootCategories.filter((item) => item.id === mainCategoryId);
  }, [categories, mainCategoryId, rootCategories]);

  async function refresh() {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanProductPayload(form)),
    });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل إضافة المنتج");
    setForm(makeEmptyForm(subcategoryOptions[0]?.id ?? rootCategories[0]?.id ?? ""));
    await refresh();
    toast.success("تم إضافة المنتج بنجاح");
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل حذف المنتج");
    await refresh();
    toast.success("تم حذف المنتج");
  }

  async function toggle(id: string, isVisible: boolean) {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_visible: !isVisible }),
    });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل الحفظ");
    await refresh();
    toast.success("تم حفظ التغييرات بنجاح");
  }

  async function uploadImage(id: string, file: File) {
    const data = new FormData();
    data.append("file", file);
    const res = await fetch(`/api/admin/products/${id}/image`, { method: "POST", body: data });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل رفع الصورة");
    await refresh();
    toast.success("تم رفع الصورة");
  }

  async function deleteImage(id: string) {
    const res = await fetch(`/api/admin/products/${id}/image`, { method: "DELETE" });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل حذف الصورة");
    await refresh();
    toast.success("تم حذف الصورة");
  }

  async function saveEdit() {
    if (!editingId) return;
    const res = await fetch(`/api/admin/products/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanProductPayload(editing)),
    });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل حفظ التعديل");
    setEditingId(null);
    setEditing(null);
    await refresh();
    toast.success("تم تعديل المنتج");
  }

  useEffect(() => {
    const initialMain = rootCategories[0]?.id || "";
    setMainCategoryId(initialMain);
    const linked = categories.filter((item) => item.parent_id === initialMain);
    const fallbackId = linked[0]?.id ?? initialMain;
    setForm((prev: any) => ({ ...prev, category_id: prev.category_id || fallbackId }));
  }, [categories, rootCategories]);

  useEffect(() => {
    if (!subcategoryOptions.some((item) => item.id === form.category_id)) {
      setForm((prev: any) => ({ ...prev, category_id: subcategoryOptions[0]?.id ?? rootCategories.find((item) => item.id === mainCategoryId)?.id ?? "" }));
    }
  }, [subcategoryOptions, form.category_id, rootCategories, mainCategoryId]);

  function renderSizeEditor(target: any, setTarget: (value: any) => void) {
    return (
      <div className="space-y-2 rounded-2xl border border-maroon/10 p-3">
        <p className="font-semibold text-maroon">المقاسات والأسعار</p>
        {target.sizes.map((size: any, index: number) => (
          <div key={index} className="grid gap-2 md:grid-cols-4">
            <Input value={size.label_ar} onChange={(e) => { const sizes = [...target.sizes]; sizes[index].label_ar = e.target.value; setTarget({ ...target, sizes }); }} placeholder="المقاس" />
            <Input value={size.label_en} onChange={(e) => { const sizes = [...target.sizes]; sizes[index].label_en = e.target.value; setTarget({ ...target, sizes }); }} placeholder="Size EN" />
            <Input type="number" value={size.price} onChange={(e) => { const sizes = [...target.sizes]; sizes[index].price = Number(e.target.value); setTarget({ ...target, sizes }); }} placeholder="السعر" />
            <div className="flex gap-2">
              <label className="flex flex-1 items-center gap-2 rounded-2xl border border-maroon/10 px-3 text-sm text-maroon"><input type="radio" checked={size.is_default} onChange={() => { const sizes = target.sizes.map((s: any, i: number) => ({ ...s, is_default: i === index })); setTarget({ ...target, sizes }); }} /> الافتراضي</label>
              <Button type="button" variant="outline" onClick={() => { const sizes = target.sizes.filter((_: any, i: number) => i !== index); setTarget({ ...target, sizes: sizes.length ? sizes : [{ ...emptySize, label_ar: "عادي", label_en: "Regular", price: 0, is_default: true }] }); }}>حذف</Button>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" className="w-full" onClick={() => setTarget({ ...target, sizes: [...target.sizes, { ...emptySize }] })}>إضافة مقاس</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <form onSubmit={submit} className="space-y-4 rounded-[28px] border border-maroon/10 bg-white/90 p-5 shadow-soft">
        <h3 className="font-serif text-2xl text-maroon">إضافة منتج</h3>
        <Field label="اسم المنتج"><Input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} /></Field>
        <Field label="الاسم بالإنجليزية"><Input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} /></Field>
        <Field label="رابط المنتج بالإنجليزية" hint="مثال: spanish-latte"><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></Field>
        <Field label="القسم الرئيسي"><Select value={mainCategoryId} onChange={(value) => { setMainCategoryId(value); const linked = categories.filter((item) => item.parent_id === value); setForm({ ...form, category_id: linked[0]?.id ?? value }); }} options={rootCategories.map((c) => ({ value: c.id, label: c.name_ar }))} /></Field>
        <Field label="القسم الفرعي"><Select value={form.category_id} onChange={(value) => setForm({ ...form, category_id: value })} options={subcategoryOptions.map((c) => ({ value: c.id, label: c.name_ar }))} /></Field>
        <Field label="الوصف بالعربية"><Textarea value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} /></Field>
        <Field label="الوصف بالإنجليزية"><Textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} /></Field>
        <label className="flex items-center gap-2 text-sm text-maroon"><input type="checkbox" checked={form.is_visible} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} /> ظاهر في الموقع</label>
        <label className="flex items-center gap-2 text-sm text-maroon"><input type="checkbox" checked={form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} /> شارة NEW</label>
        {renderSizeEditor(form, setForm)}
        <Button type="submit" className="w-full">حفظ المنتج</Button>
      </form>

      <div className="space-y-3 rounded-[28px] border border-maroon/10 bg-white/90 p-5 shadow-soft">
        {items.map((item) => {
          const isEditing = editingId === item.id;
          const parentCategory = categories.find((row) => row.id === item.categories?.parent_id);
          const editMainId = editing?.main_category_id ?? parentCategory?.id ?? item.category_id;
          const editSubOptions = categories.filter((row) => row.parent_id === editMainId);

          return (
            <div key={item.id} className="rounded-2xl border border-maroon/10 bg-[#fffaf8] p-4">
              {isEditing ? (
                <div className="space-y-3">
                  <Field label="اسم المنتج"><Input value={editing.name_ar} onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })} /></Field>
                  <Field label="الاسم بالإنجليزية"><Input value={editing.name_en} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} /></Field>
                  <Field label="رابط المنتج بالإنجليزية"><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field>
                  <Field label="القسم الرئيسي"><Select value={editMainId} onChange={(value) => { const linked = categories.filter((row) => row.parent_id === value); setEditing({ ...editing, main_category_id: value, category_id: linked[0]?.id ?? value }); }} options={rootCategories.map((c) => ({ value: c.id, label: c.name_ar }))} /></Field>
                  <Field label="القسم الفرعي"><Select value={editing.category_id} onChange={(value) => setEditing({ ...editing, category_id: value })} options={(editSubOptions.length ? editSubOptions : rootCategories.filter((row) => row.id === editMainId)).map((c) => ({ value: c.id, label: c.name_ar }))} /></Field>
                  <Field label="الوصف بالعربية"><Textarea value={editing.description_ar ?? ""} onChange={(e) => setEditing({ ...editing, description_ar: e.target.value })} /></Field>
                  <Field label="الوصف بالإنجليزية"><Textarea value={editing.description_en ?? ""} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} /></Field>
                  <label className="flex items-center gap-2 text-sm text-maroon"><input type="checkbox" checked={editing.is_visible} onChange={(e) => setEditing({ ...editing, is_visible: e.target.checked })} /> ظاهر في الموقع</label>
                  <label className="flex items-center gap-2 text-sm text-maroon"><input type="checkbox" checked={editing.is_new} onChange={(e) => setEditing({ ...editing, is_new: e.target.checked })} /> شارة NEW</label>
                  {renderSizeEditor(editing, setEditing)}
                  <div className="flex flex-wrap gap-2"><Button type="button" onClick={saveEdit}>حفظ</Button><Button type="button" variant="outline" onClick={() => { setEditingId(null); setEditing(null); }}>إلغاء</Button></div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-maroon">{item.name_ar}</p>
                    <p className="text-sm text-maroon/60">{item.name_en}</p>
                    <p className="text-xs text-maroon/50">{parentCategory ? `${parentCategory.name_ar} ← ${item.categories?.name_ar}` : item.categories?.name_ar}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" onClick={() => { setEditingId(item.id); setEditing({ ...makeEmptyForm(item.category_id), ...item, main_category_id: parentCategory?.id ?? item.category_id, sizes: item.product_sizes?.length ? item.product_sizes.map((size: any) => ({ label_ar: size.label_ar, label_en: size.label_en, price: size.price, is_default: size.is_default })) : [{ ...emptySize, label_ar: "عادي", label_en: "Regular", price: 0, is_default: true }] }); }}>تعديل</Button>
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
  );
}
