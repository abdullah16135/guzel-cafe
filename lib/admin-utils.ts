import { slugify } from "@/lib/utils";

export function ensureSlug(...values: Array<string | null | undefined>) {
  for (const value of values) {
    const slug = slugify(value || "");
    if (slug) return slug;
  }
  return `item-${Date.now()}`;
}

export function sanitizeCategoryPayload(input: any, currentId?: string) {
  const parentId = input.parent_id || null;
  return {
    name_ar: String(input.name_ar || "").trim(),
    name_en: String(input.name_en || "").trim(),
    slug: ensureSlug(input.slug, input.name_en, input.name_ar),
    description_ar: input.description_ar?.trim?.() || null,
    description_en: input.description_en?.trim?.() || null,
    parent_id: parentId === currentId ? null : parentId,
    is_visible: input.is_visible !== false,
  };
}

export function sanitizeProductSizes(sizes: any[] = []) {
  const normalized = sizes
    .map((size, index) => ({
      label_ar: String(size.label_ar || "").trim(),
      label_en: String(size.label_en || "").trim(),
      price: Number(size.price || 0),
      is_default: !!size.is_default,
      sort_order: index + 1,
    }))
    .filter((size) => size.label_ar || size.label_en);

  if (!normalized.length) return [];
  if (!normalized.some((size) => size.is_default)) normalized[0].is_default = true;
  return normalized.map((size, index) => ({ ...size, is_default: normalized.findIndex((row) => row.is_default) === index }));
}

export function sanitizeProductPayload(input: any) {
  return {
    category_id: input.category_id || null,
    slug: ensureSlug(input.slug, input.name_en, input.name_ar),
    name_ar: String(input.name_ar || "").trim(),
    name_en: String(input.name_en || "").trim(),
    description_ar: input.description_ar?.trim?.() || null,
    description_en: input.description_en?.trim?.() || null,
    is_visible: input.is_visible !== false,
    is_new: !!input.is_new,
  };
}

export function sanitizeOfferPayload(input: any) {
  return {
    slug: ensureSlug(input.slug, input.name_en, input.name_ar),
    name_ar: String(input.name_ar || "").trim(),
    name_en: String(input.name_en || "").trim(),
    description_ar: input.description_ar?.trim?.() || null,
    description_en: input.description_en?.trim?.() || null,
    original_price: input.original_price === "" || input.original_price == null ? null : Number(input.original_price),
    offer_price: Number(input.offer_price || 0),
    badge_ar: input.badge_ar?.trim?.() || "عرض",
    badge_en: input.badge_en?.trim?.() || "Offer",
    is_visible: input.is_visible !== false,
    category_ids: Array.isArray(input.category_ids) ? input.category_ids.filter(Boolean) : [],
    section_ids: Array.isArray(input.section_ids) ? input.section_ids.filter(Boolean) : [],
  };
}
