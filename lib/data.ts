import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CafeSettings, Category, Locale, MenuMainCategoryGroup, Offer, Product } from "@/lib/types";

const PRODUCT_SELECT = `
  *,
  main_category:categories!products_main_category_id_fkey(*),
  subcategory:categories!products_subcategory_id_fkey(*),
  product_sizes(*),
  media(*)
`;
const OFFER_SELECT = "*, media(*), offer_items(*, products(*, main_category:categories!products_main_category_id_fkey(*), subcategory:categories!products_subcategory_id_fkey(*), media(*), product_sizes(*)))";
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
  let query = supabase.from("categories").select("*, media(*)").order("parent_id", { ascending: true }).order("sort_order", { ascending: true }).order("created_at", { ascending: true });
  if (visibleOnly) query = query.eq("is_visible", true);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Category[];
});

export const getProducts = cache(async (visibleOnly = true) => {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("main_category_id", { ascending: true })
    .order("subcategory_id", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (visibleOnly) query = query.eq("is_visible", true).eq("is_available", true);
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

export async function getGroupedMenu(locale: Locale): Promise<MenuMainCategoryGroup[]> {
  const [categories, products] = await Promise.all([getCategories(true), getProducts(true)]);
  const rootCategories = categories
    .filter((category) => !category.parent_id)
    .sort((a, b) => a.sort_order - b.sort_order || a.name_ar.localeCompare(b.name_ar, "ar"));

  const subcategoriesByMain = new Map<string, Category[]>();
  categories
    .filter((category) => !!category.parent_id)
    .forEach((category) => {
      const parentId = category.parent_id!;
      const current = subcategoriesByMain.get(parentId) ?? [];
      current.push(category);
      current.sort((a, b) => a.sort_order - b.sort_order || a.name_ar.localeCompare(b.name_ar, "ar"));
      subcategoriesByMain.set(parentId, current);
    });

  const productsBySubcategory = new Map<string, Product[]>();
  products.forEach((product) => {
    if (!product.subcategory_id) return;
    const current = productsBySubcategory.get(product.subcategory_id) ?? [];
    current.push(product);
    current.sort((a, b) => a.sort_order - b.sort_order || a.name_ar.localeCompare(b.name_ar, "ar"));
    productsBySubcategory.set(product.subcategory_id, current);
  });

  return rootCategories
    .map((mainCategory) => {
      const subcategories = (subcategoriesByMain.get(mainCategory.id) ?? [])
        .map((subcategory) => {
          const subcategoryProducts = productsBySubcategory.get(subcategory.id) ?? [];
          return {
            id: subcategory.id,
            slug: subcategory.slug,
            label: locale === "ar" ? subcategory.name_ar : subcategory.name_en,
            description: locale === "ar" ? subcategory.description_ar : subcategory.description_en,
            media: subcategory.media ?? null,
            sort_order: subcategory.sort_order,
            products: subcategoryProducts,
          };
        })
        .filter((subcategory) => subcategory.products.length > 0);

      return {
        id: mainCategory.id,
        slug: mainCategory.slug,
        label: locale === "ar" ? mainCategory.name_ar : mainCategory.name_en,
        description: locale === "ar" ? mainCategory.description_ar : mainCategory.description_en,
        media: mainCategory.media ?? null,
        sort_order: mainCategory.sort_order,
        products_count: subcategories.reduce((total, subcategory) => total + subcategory.products.length, 0),
        subcategories,
      };
    })
    .filter((mainCategory) => mainCategory.products_count > 0);
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
    { count: totalMainCategories },
    { count: totalSubcategories },
    { count: visibleProducts },
    { count: hiddenProducts },
    { count: unavailableProducts },
    { count: newBadgeProducts },
    { count: totalOffers },
    { count: visibleOffers },
    { data: recentProducts },
    { data: recentOffers },
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }).is("parent_id", null),
    supabase.from("categories").select("id", { count: "exact", head: true }).not("parent_id", "is", null),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_visible", true),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_visible", false),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_available", false),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_new", true),
    supabase.from("offers").select("id", { count: "exact", head: true }),
    supabase.from("offers").select("id", { count: "exact", head: true }).eq("is_visible", true),
    supabase.from("products").select("id, name_ar, name_en, created_at, main_category:categories!products_main_category_id_fkey(name_ar), subcategory:categories!products_subcategory_id_fkey(name_ar)").order("created_at", { ascending: false }).limit(5),
    supabase.from("offers").select("id, name_ar, name_en, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  return {
    totalProducts,
    totalCategories,
    totalMainCategories,
    totalSubcategories,
    visibleProducts,
    hiddenProducts,
    unavailableProducts,
    newBadgeProducts,
    totalOffers,
    visibleOffers,
    recentProducts: recentProducts ?? [],
    recentOffers: recentOffers ?? [],
  };
}
