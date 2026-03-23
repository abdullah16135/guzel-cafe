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

const makeEmptyForm = (mainCategoryId = "", subcategoryId = "") => ({
  name_ar: "",
  name_en: "",
  slug: "",
  description_ar: "",
  description_en: "",
  main_category_id: mainCategoryId,
  subcategory_id: subcategoryId,
  sort_order: 1,
  is_new: false,
  is_visible: true,
  is_available: true,
  sizes: [{ ...emptySize, label_ar: "عادي", label_en: "Regular", price: 55, is_default: true }],
});

function cleanProductPayload(source: any) {
  return {
    name_ar: source.name_ar || "",
    name_en: source.name_en || "",
    slug: source.slug || slugify(source.name_en || source.name_ar),
    description_ar: source.description_ar || "",
    description_en: source.description_en || "",
    main_category_id: source.main_category_id,
    subcategory_id: source.subcategory_id,
    sort_order: Number(source.sort_order || 1),
    is_visible: source.is_visible !== false,
    is_available: source.is_available !== false,
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
  const rootCategories = useMemo(() => categories.filter((item) => !item.parent_id).sort((a, b) => a.sort_order - b.sort_order), [categories]);
  const subcategories = useMemo(() => categories.filter((item) => !!item.parent_id).sort((a, b) => a.sort_order - b.sort_order), [categories]);

  const [items, setItems] = useState(initialData);
  const [formMainCategoryId, setFormMainCategoryId] = useState(rootCategories[0]?.id ?? "");
  const [form, setForm] = useState<any>(makeEmptyForm(rootCategories[0]?.id ?? "", subcategories.find((item) => item.parent_id === rootCategories[0]?.id)?.id ?? ""));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>(null);

  const formSubcategoryOptions = useMemo(() => subcategories.filter((item) => item.parent_id === formMainCategoryId), [subcategories, formMainCategoryId]);

  async function refresh() {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.main_category_id || !form.subcategory_id) return toast.error("اختر قسمًا رئيسيًا وقسمًا فرعيًا للمنتج");
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanProductPayload(form)),
    });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل إضافة المنتج");
    const fallbackSubcategory = subcategories.find((item) => item.parent_id === formMainCategoryId)?.id ?? "";
    setForm(makeEmptyForm(formMainCategoryId, fallbackSubcategory));
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

  async function toggleVisibility(id: string, isVisible: boolean) {
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

  async function toggleAvailability(id: string, isAvailable: boolean) {
    const item = items.find((row) => row.id === id);
    if (!item) return;
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...cleanProductPayload({ ...item, sizes: item.product_sizes }), is_available: !isAvailable }),
    });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل تحديث التوفر");
    await refresh();
    toast.success("تم تحديث التوفر");
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
    if (!form.main_category_id && rootCategories[0]?.id) {
      const nextMain = rootCategories[0].id;
      const nextSubcategory = subcategories.find((item) => item.parent_id === nextMain)?.id ?? "";
      setFormMainCategoryId(nextMain);
      setForm(makeEmptyForm(nextMain, nextSubcategory));
    }
  }, [form.main_category_id, rootCategories, subcategories]);

  useEffect(() => {
    if (formSubcategoryOptions.length && !formSubcategoryOptions.some((item) => item.id === form.subcategory_id)) {
      setForm((prev: any) => ({ ...prev, subcategory_id: formSubcategoryOptions[0].id, main_category_id: formMainCategoryId }));
    }
  }, [formSubcategoryOptions, form.subcategory_id, formMainCategoryId]);

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

  const groupedItems = useMemo(() => {
    return rootCategories.map((main) => ({
      main,
      sections: subcategories
        .filter((subcategory) => subcategory.parent_id === main.id)
        .map((subcategory) => ({
          subcategory,
          products: items.filter((product) => product.subcategory_id === subcategory.id).sort((a, b) => a.sort_order - b.sort_order || a.name_ar.localeCompare(b.name_ar, "ar")),
        }))
        .filter((section) => section.products.length > 0),
    })).filter((group) => group.sections.length > 0);
  }, [items, rootCategories, subcategories]);

  return (
    <div className="grid gap-6 xl:grid-cols-[440px_1fr]">
      <form onSubmit={submit} className="space-y-4 rounded-[28px] border border-maroon/10 bg-white/90 p-5 shadow-soft">
        <div>
          <h3 className="font-serif text-2xl text-maroon">إضافة منتج</h3>
          <p className="mt-1 text-sm leading-6 text-maroon/60">كل منتج يجب أن ينتمي إلى قسم رئيسي ثم قسم فرعي محدد. لا توجد إضافة عشوائية بعد الآن.</p>
        </div>
        <Field label="اسم المنتج"><Input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} /></Field>
        <Field label="الاسم بالإنجليزية"><Input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} /></Field>
        <Field label="Slug" hint="مثال: spanish-latte"><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></Field>
        <Field label="القسم الرئيسي"><Select value={formMainCategoryId} onChange={(value) => { setFormMainCategoryId(value); const nextSub = subcategories.find((item) => item.parent_id === value)?.id ?? ""; setForm({ ...form, main_category_id: value, subcategory_id: nextSub }); }} options={rootCategories.map((c) => ({ value: c.id, label: c.name_ar }))} /></Field>
        <Field label="القسم الفرعي"><Select value={form.subcategory_id} onChange={(value) => setForm({ ...form, subcategory_id: value, main_category_id: formMainCategoryId })} options={formSubcategoryOptions.map((c) => ({ value: c.id, label: c.name_ar }))} /></Field>
        <Field label="الترتيب داخل القسم الفرعي"><Input type="number" min={1} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value || 1) })} /></Field>
        <Field label="الوصف بالعربية"><Textarea value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} /></Field>
        <Field label="الوصف بالإنجليزية"><Textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} /></Field>
        <label className="flex items-center gap-2 text-sm text-maroon"><input type="checkbox" checked={form.is_visible} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} /> ظاهر في الموقع</label>
        <label className="flex items-center gap-2 text-sm text-maroon"><input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} /> متاح للطلب</label>
        <label className="flex items-center gap-2 text-sm text-maroon"><input type="checkbox" checked={form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} /> شارة NEW</label>
        {renderSizeEditor(form, setForm)}
        <Button type="submit" className="w-full">حفظ المنتج</Button>
      </form>

      <div className="space-y-5 rounded-[28px] border border-maroon/10 bg-white/90 p-5 shadow-soft">
        {editingId && editing ? (
          <div className="rounded-[24px] border border-maroon/10 bg-[#fffaf8] p-4">
            <h4 className="mb-3 font-serif text-xl text-maroon">تعديل المنتج</h4>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="اسم المنتج"><Input value={editing.name_ar} onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })} /></Field>
              <Field label="الاسم بالإنجليزية"><Input value={editing.name_en} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} /></Field>
              <Field label="Slug"><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field>
              <Field label="الترتيب"><Input type="number" min={1} value={editing.sort_order ?? 1} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value || 1) })} /></Field>
              <Field label="القسم الرئيسي"><Select value={editing.main_category_id} onChange={(value) => { const nextSub = subcategories.find((item) => item.parent_id === value)?.id ?? ""; setEditing({ ...editing, main_category_id: value, subcategory_id: nextSub }); }} options={rootCategories.map((c) => ({ value: c.id, label: c.name_ar }))} /></Field>
              <Field label="القسم الفرعي"><Select value={editing.subcategory_id} onChange={(value) => setEditing({ ...editing, subcategory_id: value })} options={subcategories.filter((item) => item.parent_id === editing.main_category_id).map((c) => ({ value: c.id, label: c.name_ar }))} /></Field>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Field label="الوصف بالعربية"><Textarea value={editing.description_ar ?? ""} onChange={(e) => setEditing({ ...editing, description_ar: e.target.value })} /></Field>
              <Field label="الوصف بالإنجليزية"><Textarea value={editing.description_en ?? ""} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} /></Field>
            </div>
            <div className="mt-3 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-maroon"><input type="checkbox" checked={editing.is_visible} onChange={(e) => setEditing({ ...editing, is_visible: e.target.checked })} /> ظاهر في الموقع</label>
              <label className="flex items-center gap-2 text-sm text-maroon"><input type="checkbox" checked={editing.is_available} onChange={(e) => setEditing({ ...editing, is_available: e.target.checked })} /> متاح للطلب</label>
              <label className="flex items-center gap-2 text-sm text-maroon"><input type="checkbox" checked={editing.is_new} onChange={(e) => setEditing({ ...editing, is_new: e.target.checked })} /> شارة NEW</label>
            </div>
            <div className="mt-3">{renderSizeEditor(editing, setEditing)}</div>
            <div className="mt-4 flex flex-wrap gap-2"><Button type="button" onClick={saveEdit}>حفظ</Button><Button type="button" variant="outline" onClick={() => { setEditingId(null); setEditing(null); }}>إلغاء</Button></div>
          </div>
        ) : null}

        {groupedItems.map(({ main, sections }) => (
          <section key={main.id} className="space-y-3">
            <div className="flex items-center justify-between border-b border-maroon/10 pb-2">
              <h4 className="font-serif text-2xl text-maroon">{main.name_ar}</h4>
              <span className="text-sm text-maroon/55">{sections.reduce((count, section) => count + section.products.length, 0)} منتج</span>
            </div>

            {sections.map(({ subcategory, products }) => (
              <div key={subcategory.id} className="space-y-3 rounded-[24px] border border-maroon/10 bg-[#fffaf8] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-maroon">{subcategory.name_ar}</p>
                    <p className="text-xs text-maroon/55">{subcategory.name_en}</p>
                  </div>
                  <span className="text-sm text-maroon/50">{products.length}</span>
                </div>

                {products.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-maroon/10 bg-white p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-maroon">{item.name_ar}</p>
                          <span className="inline-flex rounded-full bg-[#fff8f5] px-2.5 py-1 text-[11px] font-semibold text-maroon/70">ترتيب #{item.sort_order}</span>
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.is_available ? "bg-[#eef7ef] text-[#23623a]" : "bg-[#fff1f1] text-[#8f2133]"}`}>{item.is_available ? "متاح" : "غير متاح"}</span>
                        </div>
                        <p className="text-sm text-maroon/60">{item.name_en}</p>
                        <p className="text-xs text-maroon/50">{main.name_ar} ← {subcategory.name_ar}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                                                <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingId(item.id);
                            setEditing({
                              ...makeEmptyForm(item.main_category_id, item.subcategory_id),
                              ...item,
                              sizes: item.product_sizes?.length
                                ? item.product_sizes.map((size: any) => ({
                                    label_ar: size.label_ar,
                                    label_en: size.label_en,
                                    price: size.price,
                                    is_default: size.is_default,
                                  }))
                                : [{ ...emptySize, label_ar: "عادي", label_en: "Regular", price: 0, is_default: true }],
                            });
                          }}
                        >
                          تعديل
                        </Button>
<Button type="button" variant="outline" onClick={() => toggleVisibility(item.id, item.is_visible)}>{item.is_visible ? "إخفاء" : "إظهار"}</Button>
                        <Button type="button" variant="outline" onClick={() => toggleAvailability(item.id, item.is_available)}>{item.is_available ? "تعطيل التوفر" : "تفعيل التوفر"}</Button>
                        <label className="inline-flex cursor-pointer items-center rounded-full border border-maroon/15 px-4 py-2 text-sm text-maroon">رفع صورة<input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(item.id, e.target.files[0])} /></label>
                        {item.media?.public_url ? <Button type="button" variant="outline" onClick={() => deleteImage(item.id)}>حذف الصورة</Button> : null}
                        <Button type="button" variant="outline" onClick={() => remove(item.id)}>حذف</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
