"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MediaTile } from "@/components/media-tile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";

type CategoryLike = {
  id: string;
  parent_id?: string | null;
  name_ar: string;
};

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-maroon">
      <span>{label}</span>
      {children}
      {hint ? <span className="text-xs font-normal leading-5 text-maroon/55">{hint}</span> : null}
    </label>
  );
}

function MultiPicker({
  title,
  hint,
  items,
  value,
  onChange,
}: {
  title: string;
  hint?: string;
  items: { value: string; label: string; muted?: boolean }[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const selected = new Set(value);
  return (
    <div className="space-y-3 rounded-[24px] border border-maroon/10 bg-[#fffaf8] p-4">
      <div>
        <p className="text-sm font-semibold text-maroon">{title}</p>
        {hint ? <p className="mt-1 text-xs leading-5 text-maroon/55">{hint}</p> : null}
      </div>
      <div className="grid max-h-64 gap-2 overflow-auto">
        {items.map((item) => {
          const checked = selected.has(item.value);
          return (
            <label
              key={item.value}
              className={`flex min-h-[48px] items-center gap-3 rounded-2xl border px-3 py-3 text-sm ${checked ? "border-maroon bg-maroon text-white" : "border-maroon/10 bg-white text-maroon"}`}
            >
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={checked}
                onChange={(e) => {
                  const next = e.target.checked ? [...value, item.value] : value.filter((row) => row !== item.value);
                  onChange(next);
                }}
              />
              <span className={item.muted && !checked ? "text-maroon/60" : ""}>{item.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function ProductPicker({ target, setTarget, products }: { target: any; setTarget: (value: any) => void; products: any[] }) {
  const selectedIds = new Set(target.product_ids ?? []);
  return (
    <div className="space-y-3 rounded-[24px] border border-maroon/10 bg-[#fffaf8] p-4">
      <div>
        <p className="text-sm font-semibold text-maroon">المنتجات داخل العرض</p>
        <p className="mt-1 text-xs leading-5 text-maroon/55">يمكنك تكوين عرض يضم أكثر من منتج بسعر نهائي واحد.</p>
      </div>
      <div className="grid max-h-72 gap-2 overflow-auto">
        {products.map((product) => {
          const checked = selectedIds.has(product.id);
          return (
            <label key={product.id} className={`flex min-h-[48px] items-center gap-3 rounded-2xl border px-3 py-3 text-sm ${checked ? "border-maroon bg-maroon text-white" : "border-maroon/10 bg-white text-maroon"}`}>
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={checked}
                onChange={(e) => {
                  const next = e.target.checked ? [...selectedIds, product.id] : [...selectedIds].filter((id) => id !== product.id);
                  setTarget({ ...target, product_ids: next });
                }}
              />
              <span className="truncate">{product.name_ar}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

const emptyForm = {
  name_ar: "",
  name_en: "",
  slug: "",
  description_ar: "",
  description_en: "",
  original_price: "",
  offer_price: "",
  badge_ar: "عرض",
  badge_en: "Offer",
  is_visible: true,
  product_ids: [] as string[],
  category_ids: [] as string[],
  section_ids: [] as string[],
};

function cleanOfferPayload(source: any) {
  return {
    name_ar: source.name_ar || "",
    name_en: source.name_en || "",
    slug: source.slug || slugify(source.name_en || source.name_ar),
    description_ar: source.description_ar || "",
    description_en: source.description_en || "",
    original_price: source.original_price,
    offer_price: source.offer_price,
    badge_ar: source.badge_ar || "عرض",
    badge_en: source.badge_en || "Offer",
    is_visible: source.is_visible !== false,
    product_ids: source.product_ids || [],
    category_ids: source.category_ids || [],
    section_ids: source.section_ids || [],
  };
}

function OfferPlacementSummary({ item, rootMap, sectionMap }: { item: any; rootMap: Map<string, string>; sectionMap: Map<string, string> }) {
  const categoryNames = (item.category_ids ?? []).map((id: string) => rootMap.get(id)).filter(Boolean);
  const sectionNames = (item.section_ids ?? []).map((id: string) => sectionMap.get(id)).filter(Boolean);
  if (!categoryNames.length && !sectionNames.length) {
    return <p className="text-xs text-maroon/50">العرض ظاهر في صفحة العروض فقط.</p>;
  }
  return (
    <div className="space-y-1 text-xs text-maroon/60">
      {categoryNames.length ? <p>أقسام رئيسية: {categoryNames.join(" • ")}</p> : null}
      {sectionNames.length ? <p>أقسام فرعية: {sectionNames.join(" • ")}</p> : null}
    </div>
  );
}

export function OfferManager({ initialData, products, categories }: { initialData: any[]; products: any[]; categories: CategoryLike[] }) {
  const [items, setItems] = useState(initialData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);

  const rootCategories = useMemo(() => categories.filter((item) => !item.parent_id), [categories]);
  const sectionCategories = useMemo(() => categories.filter((item) => item.parent_id), [categories]);
  const rootOptions = useMemo(() => rootCategories.map((item) => ({ value: item.id, label: item.name_ar })), [rootCategories]);
  const sectionOptions = useMemo(
    () =>
      sectionCategories.map((item) => {
        const parent = rootCategories.find((root) => root.id === item.parent_id);
        return { value: item.id, label: `${parent?.name_ar ? `${parent.name_ar} / ` : ""}${item.name_ar}`, muted: true };
      }),
    [sectionCategories, rootCategories]
  );
  const rootMap = useMemo(() => new Map(rootCategories.map((item) => [item.id, item.name_ar])), [rootCategories]);
  const sectionMap = useMemo(() => new Map(sectionOptions.map((item) => [item.value, item.label])), [sectionOptions]);

  async function refresh() {
    const res = await fetch("/api/admin/offers");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanOfferPayload(form)),
    });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل إنشاء العرض");
    setForm(emptyForm);
    await refresh();
    toast.success("تم إنشاء العرض");
  }

  async function saveEdit() {
    const res = await fetch(`/api/admin/offers/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanOfferPayload(editing)),
    });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل حفظ العرض");
    await refresh();
    setEditingId(null);
    setEditing(null);
    toast.success("تم تحديث العرض");
  }

  async function toggle(id: string, isVisible: boolean) {
    const res = await fetch(`/api/admin/offers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_visible: !isVisible }),
    });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل الحفظ");
    await refresh();
    toast.success("تم حفظ التغييرات");
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/offers/${id}`, { method: "DELETE" });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل حذف العرض");
    await refresh();
    toast.success("تم حذف العرض");
  }

  async function uploadImage(id: string, file: File) {
    const data = new FormData();
    data.append("file", file);
    const res = await fetch(`/api/admin/offers/${id}/image`, { method: "POST", body: data });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل رفع الصورة");
    await refresh();
    toast.success("تم رفع الصورة");
  }

  async function deleteImage(id: string) {
    const res = await fetch(`/api/admin/offers/${id}/image`, { method: "DELETE" });
    const result = await res.json().catch(() => null);
    if (!res.ok) return toast.error(result?.error || "فشل حذف الصورة");
    await refresh();
    toast.success("تم حذف الصورة");
  }

  return (
    <div className="space-y-5">
      <form onSubmit={submit} className="grid gap-4 rounded-[28px] border border-maroon/10 bg-white/90 p-4 shadow-soft sm:p-5 xl:grid-cols-2">
        <div className="xl:col-span-2">
          <div className="rounded-[24px] border border-maroon/10 bg-[#fff8f5] p-4">
            <p className="font-serif text-2xl text-maroon">إضافة عرض جديد</p>
            <p className="mt-1 text-sm leading-6 text-maroon/60">أنشئ عرضًا بسعر واحد، اربطه بمنتجات حقيقية، ثم اختر أين يظهر داخل المنيو أو صفحة العروض.</p>
          </div>
        </div>
        <Field label="اسم العرض بالعربية"><Input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} /></Field>
        <Field label="اسم العرض بالإنجليزية"><Input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} /></Field>
        <Field label="Slug"><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></Field>
        <Field label="سعر قبل العرض"><Input type="number" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} /></Field>
        <Field label="سعر العرض"><Input type="number" value={form.offer_price} onChange={(e) => setForm({ ...form, offer_price: e.target.value })} /></Field>
        <Field label="بادج عربي"><Input value={form.badge_ar} onChange={(e) => setForm({ ...form, badge_ar: e.target.value })} /></Field>
        <Field label="Badge EN"><Input value={form.badge_en} onChange={(e) => setForm({ ...form, badge_en: e.target.value })} /></Field>
        <Field label="وصف عربي" hint="اختياري"><Textarea value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} /></Field>
        <Field label="Description EN" hint="Optional"><Textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} /></Field>
        <div className="xl:col-span-2 grid gap-4 xl:grid-cols-3">
          <ProductPicker target={form} setTarget={setForm} products={products} />
          <MultiPicker title="إظهار العرض داخل الأقسام الرئيسية" hint="اختر قسمًا رئيسيًا أو أكثر ليظهر العرض داخل المنيو عند فتح هذا القسم." items={rootOptions} value={form.category_ids} onChange={(next) => setForm({ ...form, category_ids: next })} />
          <MultiPicker title="إظهار العرض داخل الأقسام الفرعية" hint="يمكن وضع العرض داخل أكثر من قسم فرعي، وسيظهر فوق المنتجات مباشرة." items={sectionOptions} value={form.section_ids} onChange={(next) => setForm({ ...form, section_ids: next })} />
        </div>
        <div className="xl:col-span-2 grid gap-3 rounded-[24px] border border-maroon/10 bg-[#fffaf8] p-4 text-sm text-maroon">
          <label className="flex min-h-[44px] items-center gap-3">
            <input type="checkbox" checked={form.is_visible} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} />
            العرض ظاهر حاليًا للعملاء
          </label>
          <Button type="submit" className="w-full sm:w-auto">إضافة العرض</Button>
        </div>
      </form>

      <div className="grid gap-4">
        {items.map((item) => {
          const isEditing = editingId === item.id;
          return (
            <div key={item.id} className="rounded-[26px] border border-maroon/10 bg-white/90 p-4 shadow-soft sm:p-5">
              {isEditing ? (
                <div className="grid gap-4 xl:grid-cols-2">
                  <Field label="اسم العرض بالعربية"><Input value={editing.name_ar ?? ""} onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })} /></Field>
                  <Field label="اسم العرض بالإنجليزية"><Input value={editing.name_en ?? ""} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} /></Field>
                  <Field label="Slug"><Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field>
                  <Field label="سعر قبل العرض"><Input type="number" value={editing.original_price ?? ""} onChange={(e) => setEditing({ ...editing, original_price: e.target.value })} /></Field>
                  <Field label="سعر العرض"><Input type="number" value={editing.offer_price ?? ""} onChange={(e) => setEditing({ ...editing, offer_price: e.target.value })} /></Field>
                  <Field label="بادج عربي"><Input value={editing.badge_ar ?? ""} onChange={(e) => setEditing({ ...editing, badge_ar: e.target.value })} /></Field>
                  <Field label="Badge EN"><Input value={editing.badge_en ?? ""} onChange={(e) => setEditing({ ...editing, badge_en: e.target.value })} /></Field>
                  <Field label="وصف عربي"><Textarea value={editing.description_ar ?? ""} onChange={(e) => setEditing({ ...editing, description_ar: e.target.value })} /></Field>
                  <Field label="Description EN"><Textarea value={editing.description_en ?? ""} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} /></Field>
                  <div className="xl:col-span-2 grid gap-4 xl:grid-cols-3">
                    <ProductPicker target={editing} setTarget={setEditing} products={products} />
                    <MultiPicker title="الأقسام الرئيسية" items={rootOptions} value={editing.category_ids ?? []} onChange={(next) => setEditing({ ...editing, category_ids: next })} />
                    <MultiPicker title="الأقسام الفرعية" items={sectionOptions} value={editing.section_ids ?? []} onChange={(next) => setEditing({ ...editing, section_ids: next })} />
                  </div>
                  <div className="xl:col-span-2 flex flex-wrap gap-2"><Button type="button" onClick={saveEdit}>حفظ</Button><Button type="button" variant="outline" onClick={() => { setEditingId(null); setEditing(null); }}>إلغاء</Button></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="w-full sm:w-28">
                      <MediaTile src={item.media?.public_url} alt={item.name_ar} label={item.name_ar} className="h-28 w-full" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-serif text-2xl text-maroon">{item.name_ar}</p>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.is_visible ? "bg-[#eef7ef] text-[#23623a]" : "bg-[#fff1f1] text-[#8f2133]"}`}>{item.is_visible ? "ظاهر" : "مخفي"}</span>
                      </div>
                      <p className="text-sm leading-6 text-maroon/60">{item.offer_items?.map((row: any) => row.products?.name_ar).filter(Boolean).join(" + ") || "بدون منتجات"}</p>
                      <p className="text-sm font-semibold text-maroon/85">{item.offer_price} جنيه</p>
                      <OfferPlacementSummary item={item} rootMap={rootMap} sectionMap={sectionMap} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" onClick={() => { setEditingId(item.id); setEditing({ ...item, product_ids: (item.offer_items ?? []).map((row: any) => row.product_id), category_ids: item.category_ids ?? [], section_ids: item.section_ids ?? [] }); }}>تعديل</Button>
                    <Button type="button" variant="outline" onClick={() => toggle(item.id, item.is_visible)}>{item.is_visible ? "إخفاء" : "إظهار"}</Button>
                    <label className="inline-flex min-h-[40px] cursor-pointer items-center rounded-full border border-maroon/15 px-4 py-2 text-sm text-maroon">رفع صورة<input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(item.id, e.target.files[0])} /></label>
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
