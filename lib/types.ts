export type Locale = "ar" | "en";

export type Media = {
  id: string;
  bucket: string;
  path: string;
  public_url: string | null;
  alt_ar: string | null;
  alt_en: string | null;
};

export type Category = {
  id: string;
  slug: string;
  parent_id?: string | null;
  name_ar: string;
  name_en: string;
  description_ar?: string | null;
  description_en?: string | null;
  media_id?: string | null;
  media?: Media | null;
  sort_order: number;
  is_visible: boolean;
  is_featured: boolean;
  created_at?: string;
};

export type ProductSize = {
  id: string;
  product_id: string;
  label_ar: string;
  label_en: string;
  price: number;
  sort_order: number;
  is_default: boolean;
};

export type Product = {
  id: string;
  slug: string;
  category_id: string;
  main_category_id: string;
  subcategory_id: string;
  media_id?: string | null;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  sort_order: number;
  is_visible: boolean;
  is_available: boolean;
  is_featured: boolean;
  is_new: boolean;
  created_at: string;
  main_category?: Category | null;
  subcategory?: Category | null;
  product_sizes?: ProductSize[];
  media?: Media | null;
};

export type Offer = {
  id: string;
  slug: string;
  media_id?: string | null;
  name_ar: string;
  name_en: string;
  description_ar?: string | null;
  description_en?: string | null;
  original_price?: number | null;
  offer_price: number;
  badge_ar?: string | null;
  badge_en?: string | null;
  is_visible: boolean;
  category_ids?: string[] | null;
  section_ids?: string[] | null;
  created_at?: string;
  media?: Media | null;
  offer_items?: OfferItem[];
};

export type OfferItem = {
  id: string;
  offer_id: string;
  product_id: string;
  sort_order: number;
  products?: Product;
};

export type CafeSettings = {
  id: string;
  cafe_name_ar: string;
  cafe_name_en: string;
  description_ar: string | null;
  description_en: string | null;
  location_text_ar: string;
  location_text_en: string;
  google_maps_link: string;
  coordinates: string | null;
  phone: string | null;
  instagram: string | null;
  tiktok: string | null;
  logo_media_id?: string | null;
  logo_media?: Media | null;
  hero_media_id?: string | null;
  hero_media?: Media | null;
  banner_media_id?: string | null;
  banner_media?: Media | null;
  admin_email?: string | null;
  default_language: Locale;
  show_language_switch: boolean;
  force_single_language: boolean;
  offers_empty_behavior?: "hide" | "message" | null;
  home_primary_section?: "menu" | "offers" | null;
};

export type MenuSubcategoryGroup = {
  id: string;
  slug: string;
  label: string;
  description?: string | null;
  media?: Media | null;
  sort_order: number;
  products: Product[];
};

export type MenuMainCategoryGroup = {
  id: string;
  slug: string;
  label: string;
  description?: string | null;
  media?: Media | null;
  sort_order: number;
  products_count: number;
  subcategories: MenuSubcategoryGroup[];
};
