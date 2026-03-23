import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CafeSettings, Category, Locale, Offer, Product } from "@/lib/types";

const PRODUCT_SELECT = "*, categories(*), product_sizes(*), media(*)";
const OFFER_SELECT = "*, media(*), offer_items(*, products(*, categories(*), media(*), product_sizes(*)))";
const SETTINGS_SELECT = "*, logo_media:media!settings_logo_media_id_fkey(*), hero_media:media!settings_hero_media_id_fkey(*), banner_media:media!settings_banner_media_id_fkey(*)";

export async function getSettings(): Promise<CafeSettings> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase.from("settings").select(SETTINGS_SELECT).single();
  if (error) throw error;
  return {
    offers_empty_behavior: "hide",
    home_primary_section: "menu",
    ...data,
  } as CafeSettings;
}

export const getCategories = cache(async (visibleOnly = true) => {
  const supabase = await createClient();
  let query = supabase.from("categories").select("*, media(*)").order("sort_order");
  if (visibleOnly) query = query.eq("is_visible", true);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Category[];
});

export const getProducts = cache(async (visibleOnly = true) => {
  const supabase = await createClient();
  let query = supabase.from("products").select(PRODUCT_SELECT).order("created_at", { ascending: false });
  if (visibleOnly) query = query.eq("is_visible", true);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Product[];
});

export const getOffers = cache(async (visibleOnly = true) => {
  const supabase = await createClient();
  let query = supabase.from("offers").select(OFFER_SELECT).order("created_at", { ascending: false });
  if (visibleOnly) query = query.eq("is_visible", true);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Offer[];
});

export async function getGroupedMenu(locale: Locale) {
  const [categories, products] = await Promise.all([getCategories(true), getProducts(true)]);
  const roots = categories.filter((category) => !category.parent_id);
  const childrenByParent = new Map<string, Category[]>();

  categories
    .filter((category) => category.parent_id)
    .forEach((category) => {
      const list = childrenByParent.get(category.parent_id!) ?? [];
      list.push(category);
      childrenByParent.set(category.parent_id!, list.sort((a, b) => a.sort_order - b.sort_order));
    });

  return roots
    .map((root) => {
      const directProducts = products.filter((product) => product.category_id === root.id && product.is_visible);
      const subcategories = (childrenByParent.get(root.id) ?? [])
        .map((child) => ({
          ...child,
          label: locale === "ar" ? child.name_ar : child.name_en,
          description: locale === "ar" ? child.description_ar : child.description_en,
          products: products.filter((product) => product.category_id === child.id && product.is_visible),
        }))
        .filter((group) => group.products.length > 0);

      return {
        ...root,
        label: locale === "ar" ? root.name_ar : root.name_en,
        description: locale === "ar" ? root.description_ar : root.description_en,
        products: directProducts,
        subcategories,
      };
    })
    .filter((group) => group.products.length > 0 || group.subcategories.length > 0);
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).eq("slug", slug).single();
  if (error) throw error;
  return data as Product;
}

export async function getOfferBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("offers").select(OFFER_SELECT).eq("slug", slug).single();
  if (error) throw error;
  return data as Offer;
}

export async function getDashboardStats() {
  const supabase = await createClient();
  const [
    { count: totalProducts },
    { count: totalCategories },
    { count: visibleProducts },
    { count: hiddenProducts },
    { count: newBadgeProducts },
    { count: totalOffers },
    { count: visibleOffers },
    { data: recentProducts },
    { data: recentOffers },
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_visible", true),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_visible", false),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_new", true),
    supabase.from("offers").select("id", { count: "exact", head: true }),
    supabase.from("offers").select("id", { count: "exact", head: true }).eq("is_visible", true),
    supabase.from("products").select("id, name_ar, name_en, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("offers").select("id, name_ar, name_en, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  return {
    totalProducts,
    totalCategories,
    visibleProducts,
    hiddenProducts,
    newBadgeProducts,
    totalOffers,
    visibleOffers,
    recentProducts: recentProducts ?? [],
    recentOffers: recentOffers ?? [],
  };
}
