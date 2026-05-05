import { cache } from "react";
import { CafeSettings, Category, Locale, MenuMainCategoryGroup, Offer, Product, ProductSize } from "@/lib/types";

function media(public_url: string) {
  return {
    id: public_url,
    bucket: "local",
    path: public_url,
    public_url,
    alt_ar: null,
    alt_en: null,
    width: null,
    height: null,
    blur_data_url: null,
    mime_type: null,
    size_bytes: null,
    duration_seconds: null,
  };
}

const settings: CafeSettings = {
  id: "settings-local",
  cafe_name_ar: "Güzel Cafe",
  cafe_name_en: "Güzel Cafe",
  description_ar: "استمتع بتجربة مميزة من المشروبات والحلويات المختارة بعناية في Güzel Cafe.",
  description_en: "Enjoy a premium selection of drinks and desserts at Güzel Cafe.",
  location_text_ar: "مصر",
  location_text_en: "Egypt",
  google_maps_link: "https://maps.app.goo.gl/ukU1ynQN8Ahi2KSa7",
  coordinates: null,
  phone: null,
  instagram: null,
  tiktok: null,

  logo_media_id: "local-logo",
  logo_media: media("/logo/cafe-logo.png"),

  hero_media_id: "local-hero",
  hero_media: media("/images/menu-banner.jpg"),

  banner_media_id: "local-banner",
  banner_media: media("/images/menu-banner.jpg"),

  admin_email: null,
  default_language: "ar",
  show_language_switch: true,
  force_single_language: false,
  offers_empty_behavior: "hide",
  home_primary_section: "menu",
};
const categories: Category[] = [
{
  id: "cat-drinks",
  slug: "drinks",
  parent_id: null,
  name_ar: "مشروبات",
  name_en: "Drinks",
  description_ar: "جميع المشروبات الساخنة والباردة والإضافات.",
  description_en: "All hot drinks, cold drinks, and additions.",
  media_id: "cat-drinks-media",
  media: media("/images/drinks.jpg"),
  sort_order: 1,
  is_visible: true,
  is_featured: true,
},
{
  id: "cat-desserts",
  slug: "desserts",
  parent_id: null,
  name_ar: "حلويات",
  name_en: "Desserts",
  description_ar: "تشكيلة الحلويات.",
  description_en: "Dessert selection.",
  media_id: "cat-desserts-media",
  media: media("/images/desserts.jpg"),
  sort_order: 2,
  is_visible: true,
  is_featured: true,
},

  {
    id: "sub-specialty-coffee",
    slug: "specialty-coffee",
    parent_id: "cat-drinks",
    name_ar: "\u0642\u0647\u0648\u0629 \u0645\u062e\u062a\u0635\u0629",
    name_en: "Specialty Coffee",
    description_ar: "\u0627\u0644\u0642\u0647\u0648\u0629 \u0627\u0644\u0645\u062e\u062a\u0635\u0629.",
    description_en: "Specialty coffee.",
    media_id: null,
    media: null,
    sort_order: 1,
    is_visible: true,
    is_featured: false,
  },
  {
    id: "sub-soft-drink",
    slug: "soft-drink",
    parent_id: "cat-drinks",
    name_ar: "\u0633\u0648\u0641\u062a \u062f\u0631\u064a\u0646\u0643",
    name_en: "Soft Drink",
    description_ar: "\u0645\u0634\u0631\u0648\u0628\u0627\u062a \u063a\u0627\u0632\u064a\u0629 \u0648\u0645\u064a\u0627\u0647.",
    description_en: "Soft drinks and water.",
    media_id: null,
    media: null,
    sort_order: 2,
    is_visible: true,
    is_featured: false,
  },
  {
    id: "sub-mojito",
    slug: "mojito",
    parent_id: "cat-drinks",
    name_ar: "\u0645\u0648\u0647\u064a\u062a\u0648",
    name_en: "Mojito",
    description_ar: "\u0645\u0634\u0631\u0648\u0628\u0627\u062a \u0645\u0648\u0647\u064a\u062a\u0648.",
    description_en: "Mojito drinks.",
    media_id: null,
    media: null,
    sort_order: 3,
    is_visible: true,
    is_featured: false,
  },
  {
    id: "sub-matcha",
    slug: "matcha",
    parent_id: "cat-drinks",
    name_ar: "\u0645\u0627\u062a\u0634\u0627",
    name_en: "Matcha",
    description_ar: "\u0645\u0634\u0631\u0648\u0628\u0627\u062a \u0645\u0627\u062a\u0634\u0627.",
    description_en: "Matcha drinks.",
    media_id: null,
    media: null,
    sort_order: 4,
    is_visible: true,
    is_featured: false,
  },
  {
    id: "sub-iced-drink",
    slug: "iced-drink",
    parent_id: "cat-drinks",
    name_ar: "\u0645\u0634\u0631\u0648\u0628\u0627\u062a \u0628\u0627\u0631\u062f\u0629",
    name_en: "Iced Drink",
    description_ar: "\u0627\u0644\u0645\u0634\u0631\u0648\u0628\u0627\u062a \u0627\u0644\u0628\u0627\u0631\u062f\u0629.",
    description_en: "Iced drinks.",
    media_id: null,
    media: null,
    sort_order: 5,
    is_visible: true,
    is_featured: false,
  },
  {
    id: "sub-hot-drinks",
    slug: "hot-drinks",
    parent_id: "cat-drinks",
    name_ar: "\u0645\u0634\u0631\u0648\u0628\u0627\u062a \u0633\u0627\u062e\u0646\u0629",
    name_en: "Hot Drinks",
    description_ar: "\u0627\u0644\u0645\u0634\u0631\u0648\u0628\u0627\u062a \u0627\u0644\u0633\u0627\u062e\u0646\u0629.",
    description_en: "Hot drinks.",
    media_id: null,
    media: null,
    sort_order: 6,
    is_visible: true,
    is_featured: false,
  },
  {
    id: "sub-hot-coffee",
    slug: "hot-coffee",
    parent_id: "cat-drinks",
    name_ar: "\u0642\u0647\u0648\u0629 \u0633\u0627\u062e\u0646\u0629",
    name_en: "Hot Coffee",
    description_ar: "\u0642\u0647\u0648\u0629 \u0633\u0627\u062e\u0646\u0629.",
    description_en: "Hot coffee.",
    media_id: null,
    media: null,
    sort_order: 7,
    is_visible: true,
    is_featured: false,
  },
  {
    id: "sub-frappe",
    slug: "frappe",
    parent_id: "cat-drinks",
    name_ar: "\u0641\u0631\u0627\u0628\u064a\u0647",
    name_en: "Frappe",
    description_ar: "\u0645\u0634\u0631\u0648\u0628\u0627\u062a \u0641\u0631\u0627\u0628\u064a\u0647.",
    description_en: "Frappe drinks.",
    media_id: null,
    media: null,
    sort_order: 8,
    is_visible: true,
    is_featured: false,
  },
  {
    id: "sub-frappe-non-coffee",
    slug: "frappe-non-coffee",
    parent_id: "cat-drinks",
    name_ar: "\u0641\u0631\u0627\u0628\u064a\u0647 \u0628\u062f\u0648\u0646 \u0642\u0647\u0648\u0629",
    name_en: "Frappe Non Coffee",
    description_ar: "\u0641\u0631\u0627\u0628\u064a\u0647 \u0628\u062f\u0648\u0646 \u0642\u0647\u0648\u0629.",
    description_en: "Frappe without coffee.",
    media_id: null,
    media: null,
    sort_order: 9,
    is_visible: true,
    is_featured: false,
  },
  {
    id: "sub-cold-drinks",
    slug: "cold-drinks",
    parent_id: "cat-drinks",
    name_ar: "\u0645\u0634\u0631\u0648\u0628\u0627\u062a \u0628\u0627\u0631\u062f\u0629",
    name_en: "Cold Drinks",
    description_ar: "\u0645\u0634\u0631\u0648\u0628\u0627\u062a \u0628\u0627\u0631\u062f\u0629.",
    description_en: "Cold drinks.",
    media_id: null,
    media: null,
    sort_order: 10,
    is_visible: true,
    is_featured: false,
  },
  {
    id: "sub-additions",
    slug: "additions",
    parent_id: "cat-drinks",
    name_ar: "\u0625\u0636\u0627\u0641\u0627\u062a",
    name_en: "Additions",
    description_ar: "\u0625\u0636\u0627\u0641\u0627\u062a \u0644\u0644\u0645\u0634\u0631\u0648\u0628\u0627\u062a.",
    description_en: "Drink additions.",
    media_id: null,
    media: null,
    sort_order: 11,
    is_visible: true,
    is_featured: false,
  },
  {
    id: "sub-dessert",
    slug: "dessert",
    parent_id: "cat-desserts",
    name_ar: "\u062d\u0644\u0648\u064a\u0627\u062a",
    name_en: "Dessert",
    description_ar: "\u0642\u0633\u0645 \u0627\u0644\u062d\u0644\u0648\u064a\u0627\u062a.",
    description_en: "Dessert section.",
    media_id: null,
    media: null,
    sort_order: 1,
    is_visible: true,
    is_featured: false,
  },
];

function size(id: string, productId: string, label_ar: string, label_en: string, price: number, sort_order = 1, is_default = true): ProductSize {
  return { id, product_id: productId, label_ar, label_en, price, sort_order, is_default };
}

function product(params: {
  id: string;
  slug: string;
  main: string;
  sub: string;
  name_ar: string;
  name_en: string;
  description_ar?: string | null;
  description_en?: string | null;
  sizes: ProductSize[];
  sort_order: number;
}): Product {
  return {
    id: params.id,
    slug: params.slug,
    category_id: params.sub,
    main_category_id: params.main,
    subcategory_id: params.sub,
    media_id: null,
    media: null,
    name_ar: params.name_ar,
    name_en: params.name_en,
    description_ar: params.description_ar ?? null,
    description_en: params.description_en ?? null,
    sort_order: params.sort_order,
    is_visible: true,
    is_available: true,
    is_featured: false,
    is_new: false,
    created_at: new Date().toISOString(),
    product_sizes: params.sizes,
  };
}

const products: Product[] = [
  // ADD_ON
  product({ id: "p-add-on-espresso-shot", slug: "add-on-espresso-shot", main: "cat-drinks", sub: "sub-additions", name_ar: "Espresso Shot", name_en: "Espresso Shot", sort_order: 1, sizes: [size("s-add-on-espresso-shot", "p-add-on-espresso-shot", "Default", "Default", 35)] }),
  product({ id: "p-add-on-flavor-syrup", slug: "add-on-flavor-syrup", main: "cat-drinks", sub: "sub-additions", name_ar: "Flavor Syrup", name_en: "Flavor Syrup", sort_order: 2, sizes: [size("s-add-on-flavor-syrup", "p-add-on-flavor-syrup", "Default", "Default", 30)] }),
  product({ id: "p-add-on-nutella", slug: "add-on-nutella", main: "cat-drinks", sub: "sub-additions", name_ar: "Nutella", name_en: "Nutella", sort_order: 3, sizes: [size("s-add-on-nutella", "p-add-on-nutella", "Default", "Default", 40)] }),
  product({ id: "p-add-on-lotus", slug: "add-on-lotus", main: "cat-drinks", sub: "sub-additions", name_ar: "Lotus", name_en: "Lotus", sort_order: 4, sizes: [size("s-add-on-lotus", "p-add-on-lotus", "Default", "Default", 40)] }),
  product({ id: "p-add-on-pistachio", slug: "add-on-pistachio", main: "cat-drinks", sub: "sub-additions", name_ar: "Pistachio", name_en: "Pistachio", sort_order: 5, sizes: [size("s-add-on-pistachio", "p-add-on-pistachio", "Default", "Default", 30)] }),
  product({ id: "p-add-on-milk", slug: "add-on-milk", main: "cat-drinks", sub: "sub-additions", name_ar: "Milk", name_en: "Milk", sort_order: 6, sizes: [size("s-add-on-milk", "p-add-on-milk", "Default", "Default", 25)] }),
  product({ id: "p-add-on-chocolate", slug: "add-on-chocolate", main: "cat-drinks", sub: "sub-additions", name_ar: "Chocolate", name_en: "Chocolate", sort_order: 7, sizes: [size("s-add-on-chocolate", "p-add-on-chocolate", "Default", "Default", 30)] }),
  product({ id: "p-add-on-caramel", slug: "add-on-caramel", main: "cat-drinks", sub: "sub-additions", name_ar: "Caramel", name_en: "Caramel", sort_order: 8, sizes: [size("s-add-on-caramel", "p-add-on-caramel", "Default", "Default", 30)] }),
  product({ id: "p-add-on-topping", slug: "add-on-topping", main: "cat-drinks", sub: "sub-additions", name_ar: "Topping", name_en: "Topping", sort_order: 9, sizes: [size("s-add-on-topping", "p-add-on-topping", "Default", "Default", 40)] }),
  product({ id: "p-add-on-cup-ice", slug: "add-on-cup-ice", main: "cat-drinks", sub: "sub-additions", name_ar: "Cup ice", name_en: "Cup ice", sort_order: 10, sizes: [size("s-add-on-cup-ice", "p-add-on-cup-ice", "Default", "Default", 10)] }),
  product({ id: "p-add-on-whipped-cream", slug: "add-on-whipped-cream", main: "cat-drinks", sub: "sub-additions", name_ar: "Whipped Cream", name_en: "Whipped Cream", sort_order: 11, sizes: [size("s-add-on-whipped-cream", "p-add-on-whipped-cream", "Default", "Default", 30)] }),
  product({ id: "p-add-on-condensed-milk", slug: "add-on-condensed-milk", main: "cat-drinks", sub: "sub-additions", name_ar: "Condensed Milk", name_en: "Condensed Milk", sort_order: 12, sizes: [size("s-add-on-condensed-milk", "p-add-on-condensed-milk", "Default", "Default", 25)] }),

  // Specialty_Coffee
  product({ id: "p-specialty-coffee-v-60", slug: "specialty-coffee-v-60", main: "cat-drinks", sub: "sub-specialty-coffee", name_ar: "V-60", name_en: "V-60", sort_order: 1, sizes: [size("s-specialty-coffee-v-60", "p-specialty-coffee-v-60", "Default", "Default", 130)] }),
  product({ id: "p-specialty-coffee-aeropress", slug: "specialty-coffee-aeropress", main: "cat-drinks", sub: "sub-specialty-coffee", name_ar: "Aeropress", name_en: "Aeropress", sort_order: 2, sizes: [size("s-specialty-coffee-aeropress", "p-specialty-coffee-aeropress", "Default", "Default", 130)] }),
  product({ id: "p-specialty-coffee-cold-prow", slug: "specialty-coffee-cold-prow", main: "cat-drinks", sub: "sub-specialty-coffee", name_ar: "Cold Prow", name_en: "Cold Prow", sort_order: 3, sizes: [size("s-specialty-coffee-cold-prow", "p-specialty-coffee-cold-prow", "Default", "Default", 130)] }),
  product({ id: "p-specialty-coffee-phonex", slug: "specialty-coffee-phonex", main: "cat-drinks", sub: "sub-specialty-coffee", name_ar: "Phonex", name_en: "Phonex", sort_order: 4, sizes: [size("s-specialty-coffee-phonex", "p-specialty-coffee-phonex", "Default", "Default", 130)] }),
  product({ id: "p-specialty-coffee-chemex", slug: "specialty-coffee-chemex", main: "cat-drinks", sub: "sub-specialty-coffee", name_ar: "Chemex", name_en: "Chemex", sort_order: 5, sizes: [size("s-specialty-coffee-chemex", "p-specialty-coffee-chemex", "Default", "Default", 130)] }),
  product({ id: "p-specialty-coffee-clever-dripper", slug: "specialty-coffee-clever-dripper", main: "cat-drinks", sub: "sub-specialty-coffee", name_ar: "Clever Dripper", name_en: "Clever Dripper", sort_order: 6, sizes: [size("s-specialty-coffee-clever-dripper", "p-specialty-coffee-clever-dripper", "Default", "Default", 130)] }),

  // Soft_Drinks
  product({ id: "p-soft-drinks-redbull", slug: "soft-drinks-redbull", main: "cat-drinks", sub: "sub-soft-drink", name_ar: "Redbull", name_en: "Redbull", sort_order: 1, sizes: [size("s-soft-drinks-redbull", "p-soft-drinks-redbull", "Default", "Default", 100)] }),
  product({ id: "p-soft-drinks-water", slug: "soft-drinks-water", main: "cat-drinks", sub: "sub-soft-drink", name_ar: "Water", name_en: "Water", sort_order: 2, sizes: [size("s-soft-drinks-water", "p-soft-drinks-water", "Default", "Default", 15)] }),

  // Mojito
  product({ id: "p-mojito-mojito-classic", slug: "mojito-mojito-classic", main: "cat-drinks", sub: "sub-mojito", name_ar: "Mojito Classic", name_en: "Mojito Classic", sort_order: 1, sizes: [size("s-mojito-mojito-classic", "p-mojito-mojito-classic", "Default", "Default", 80)] }),
  product({ id: "p-mojito-mojito-passion", slug: "mojito-mojito-passion", main: "cat-drinks", sub: "sub-mojito", name_ar: "Mojito Passion", name_en: "Mojito Passion", sort_order: 2, sizes: [size("s-mojito-mojito-passion", "p-mojito-mojito-passion", "Default", "Default", 90)] }),
  product({ id: "p-mojito-mojito-bluberry", slug: "mojito-mojito-bluberry", main: "cat-drinks", sub: "sub-mojito", name_ar: "Mojito Bluberry", name_en: "Mojito Bluberry", sort_order: 3, sizes: [size("s-mojito-mojito-bluberry", "p-mojito-mojito-bluberry", "Default", "Default", 90)] }),
  product({ id: "p-mojito-mojito-strawberry", slug: "mojito-mojito-strawberry", main: "cat-drinks", sub: "sub-mojito", name_ar: "Mojito Strawberry", name_en: "Mojito Strawberry", sort_order: 4, sizes: [size("s-mojito-mojito-strawberry", "p-mojito-mojito-strawberry", "Default", "Default", 90)] }),

  // Matcha
  product({ id: "p-matcha-ice-matcha-latte", slug: "matcha-ice-matcha-latte", main: "cat-drinks", sub: "sub-matcha", name_ar: "Ice Matcha Latte", name_en: "Ice Matcha Latte", sort_order: 1, sizes: [size("s-matcha-ice-matcha-latte", "p-matcha-ice-matcha-latte", "Default", "Default", 110)] }),
  product({ id: "p-matcha-hot-matcha", slug: "matcha-hot-matcha", main: "cat-drinks", sub: "sub-matcha", name_ar: "Hot Matcha", name_en: "Hot Matcha", sort_order: 2, sizes: [size("s-matcha-hot-matcha", "p-matcha-hot-matcha", "Default", "Default", 110)] }),
  product({ id: "p-matcha-ice-matcha-strawberry", slug: "matcha-ice-matcha-strawberry", main: "cat-drinks", sub: "sub-matcha", name_ar: "Ice Matcha Strawberry", name_en: "Ice Matcha Strawberry", sort_order: 3, sizes: [size("s-matcha-ice-matcha-strawberry", "p-matcha-ice-matcha-strawberry", "Default", "Default", 130)] }),
  product({ id: "p-matcha-ice-matcha-mango", slug: "matcha-ice-matcha-mango", main: "cat-drinks", sub: "sub-matcha", name_ar: "Ice Matcha Mango", name_en: "Ice Matcha Mango", sort_order: 4, sizes: [size("s-matcha-ice-matcha-mango", "p-matcha-ice-matcha-mango", "Default", "Default", 130)] }),

  // Ice_Cubes
  product({ id: "p-ice-cubes-ice-white-mocha", slug: "ice-cubes-ice-white-mocha", main: "cat-drinks", sub: "sub-iced-drink", name_ar: "Ice White Mocha", name_en: "Ice White Mocha", sort_order: 1, sizes: [size("s-ice-cubes-ice-white-mocha", "p-ice-cubes-ice-white-mocha", "Default", "Default", 110)] }),
  product({ id: "p-ice-cubes-ice-mocha", slug: "ice-cubes-ice-mocha", main: "cat-drinks", sub: "sub-iced-drink", name_ar: "Ice Mocha", name_en: "Ice Mocha", sort_order: 2, sizes: [size("s-ice-cubes-ice-mocha", "p-ice-cubes-ice-mocha", "Default", "Default", 120)] }),
  product({ id: "p-ice-cubes-ice-spanish-latte", slug: "ice-cubes-ice-spanish-latte", main: "cat-drinks", sub: "sub-iced-drink", name_ar: "Ice Spanish Latte", name_en: "Ice Spanish Latte", sort_order: 3, sizes: [size("s-ice-cubes-ice-spanish-latte", "p-ice-cubes-ice-spanish-latte", "Default", "Default", 120)] }),
  product({ id: "p-ice-cubes-ice-latte", slug: "ice-cubes-ice-latte", main: "cat-drinks", sub: "sub-iced-drink", name_ar: "Ice Latte", name_en: "Ice Latte", sort_order: 4, sizes: [size("s-ice-cubes-ice-latte", "p-ice-cubes-ice-latte", "Default", "Default", 95)] }),
  product({ id: "p-ice-cubes-ice-salted-caramel", slug: "ice-cubes-ice-salted-caramel", main: "cat-drinks", sub: "sub-iced-drink", name_ar: "Ice Salted Caramel", name_en: "Ice Salted Caramel", sort_order: 5, sizes: [size("s-ice-cubes-ice-salted-caramel", "p-ice-cubes-ice-salted-caramel", "Default", "Default", 120)] }),
  product({ id: "p-ice-cubes-guzel", slug: "ice-cubes-guzel", main: "cat-drinks", sub: "sub-iced-drink", name_ar: "Guzel", name_en: "Guzel", sort_order: 6, sizes: [size("s-ice-cubes-guzel", "p-ice-cubes-guzel", "Default", "Default", 110)] }),
  product({ id: "p-ice-cubes-ice-dulce", slug: "ice-cubes-ice-dulce", main: "cat-drinks", sub: "sub-iced-drink", name_ar: "Ice Dulce", name_en: "Ice Dulce", sort_order: 7, sizes: [size("s-ice-cubes-ice-dulce", "p-ice-cubes-ice-dulce", "Default", "Default", 110)] }),

  // Hot_Drinks
  product({ id: "p-hot-drinks-tea", slug: "hot-drinks-tea", main: "cat-drinks", sub: "sub-hot-drinks", name_ar: "Tea", name_en: "Tea", sort_order: 1, sizes: [size("s-hot-drinks-tea", "p-hot-drinks-tea", "Default", "Default", 30)] }),
  product({ id: "p-hot-drinks-flavor-tea", slug: "hot-drinks-flavor-tea", main: "cat-drinks", sub: "sub-hot-drinks", name_ar: "Flavor Tea", name_en: "Flavor Tea", sort_order: 2, sizes: [size("s-hot-drinks-flavor-tea", "p-hot-drinks-flavor-tea", "Default", "Default", 40)] }),
  product({ id: "p-hot-drinks-hot-chocolate", slug: "hot-drinks-hot-chocolate", main: "cat-drinks", sub: "sub-hot-drinks", name_ar: "Hot Chocolate", name_en: "Hot Chocolate", sort_order: 3, sizes: [size("s-hot-drinks-hot-chocolate", "p-hot-drinks-hot-chocolate", "Default", "Default", 100)] }),
  product({ id: "p-hot-drinks-hot-white-chocolate", slug: "hot-drinks-hot-white-chocolate", main: "cat-drinks", sub: "sub-hot-drinks", name_ar: "Hot White Chocolate", name_en: "Hot White Chocolate", sort_order: 4, sizes: [size("s-hot-drinks-hot-white-chocolate", "p-hot-drinks-hot-white-chocolate", "Default", "Default", 90)] }),
  product({ id: "p-hot-drinks-hot-nutella", slug: "hot-drinks-hot-nutella", main: "cat-drinks", sub: "sub-hot-drinks", name_ar: "Hot Nutella", name_en: "Hot Nutella", sort_order: 5, sizes: [size("s-hot-drinks-hot-nutella", "p-hot-drinks-hot-nutella", "Default", "Default", 125)] }),
  product({ id: "p-hot-drinks-hot-cider", slug: "hot-drinks-hot-cider", main: "cat-drinks", sub: "sub-hot-drinks", name_ar: "Hot Cider", name_en: "Hot Cider", sort_order: 6, sizes: [size("s-hot-drinks-hot-cider", "p-hot-drinks-hot-cider", "Default", "Default", 80)] }),

  // Hot_Coffee
  product({ id: "p-hot-coffee-piccolo-latte", slug: "hot-coffee-piccolo-latte", main: "cat-drinks", sub: "sub-hot-coffee", name_ar: "Piccolo Latte", name_en: "Piccolo Latte", sort_order: 1, sizes: [size("s-hot-coffee-piccolo-latte", "p-hot-coffee-piccolo-latte", "Default", "Default", 80)] }),
  product({ id: "p-hot-coffee-espresso", slug: "hot-coffee-espresso", main: "cat-drinks", sub: "sub-hot-coffee", name_ar: "Espresso", name_en: "Espresso", sort_order: 2, sizes: [size("s-hot-coffee-espresso", "p-hot-coffee-espresso", "Default", "Default", 70)] }),
  product({ id: "p-hot-coffee-espresso-macchiato", slug: "hot-coffee-espresso-macchiato", main: "cat-drinks", sub: "sub-hot-coffee", name_ar: "Espresso Macchiato", name_en: "Espresso Macchiato", sort_order: 3, sizes: [size("s-hot-coffee-espresso-macchiato", "p-hot-coffee-espresso-macchiato", "Default", "Default", 75)] }),
  product({ id: "p-hot-coffee-cortado", slug: "hot-coffee-cortado", main: "cat-drinks", sub: "sub-hot-coffee", name_ar: "Cortado", name_en: "Cortado", sort_order: 4, sizes: [size("s-hot-coffee-cortado", "p-hot-coffee-cortado", "Default", "Default", 95)] }),
  product({ id: "p-hot-coffee-latte", slug: "hot-coffee-latte", main: "cat-drinks", sub: "sub-hot-coffee", name_ar: "Latte", name_en: "Latte", sort_order: 5, sizes: [size("s-hot-coffee-latte", "p-hot-coffee-latte", "Default", "Default", 105)] }),
  product({ id: "p-hot-coffee-cappuccino", slug: "hot-coffee-cappuccino", main: "cat-drinks", sub: "sub-hot-coffee", name_ar: "Cappuccino", name_en: "Cappuccino", sort_order: 6, sizes: [size("s-hot-coffee-cappuccino", "p-hot-coffee-cappuccino", "Default", "Default", 105)] }),
  product({ id: "p-hot-coffee-spanish-latte", slug: "hot-coffee-spanish-latte", main: "cat-drinks", sub: "sub-hot-coffee", name_ar: "Spanish Latte", name_en: "Spanish Latte", sort_order: 7, sizes: [size("s-hot-coffee-spanish-latte", "p-hot-coffee-spanish-latte", "Default", "Default", 115)] }),
  product({ id: "p-hot-coffee-white-mocha", slug: "hot-coffee-white-mocha", main: "cat-drinks", sub: "sub-hot-coffee", name_ar: "White Mocha", name_en: "White Mocha", sort_order: 8, sizes: [size("s-hot-coffee-white-mocha", "p-hot-coffee-white-mocha", "Default", "Default", 120)] }),
  product({ id: "p-hot-coffee-mocha", slug: "hot-coffee-mocha", main: "cat-drinks", sub: "sub-hot-coffee", name_ar: "Mocha", name_en: "Mocha", sort_order: 9, sizes: [size("s-hot-coffee-mocha", "p-hot-coffee-mocha", "Default", "Default", 130)] }),
  product({ id: "p-hot-coffee-flat-white", slug: "hot-coffee-flat-white", main: "cat-drinks", sub: "sub-hot-coffee", name_ar: "Flat White", name_en: "Flat White", sort_order: 10, sizes: [size("s-hot-coffee-flat-white", "p-hot-coffee-flat-white", "Default", "Default", 100)] }),
  product({ id: "p-hot-coffee-american-coffee", slug: "hot-coffee-american-coffee", main: "cat-drinks", sub: "sub-hot-coffee", name_ar: "American Coffee", name_en: "American Coffee", sort_order: 11, sizes: [size("s-hot-coffee-american-coffee", "p-hot-coffee-american-coffee", "Default", "Default", 100)] }),
  product({ id: "p-hot-coffee-lotus-latte", slug: "hot-coffee-lotus-latte", main: "cat-drinks", sub: "sub-hot-coffee", name_ar: "Lotus Latte", name_en: "Lotus Latte", sort_order: 12, sizes: [size("s-hot-coffee-lotus-latte", "p-hot-coffee-lotus-latte", "Default", "Default", 130)] }),
  product({ id: "p-hot-coffee-pistachio-latte", slug: "hot-coffee-pistachio-latte", main: "cat-drinks", sub: "sub-hot-coffee", name_ar: "Pistachio Latte", name_en: "Pistachio Latte", sort_order: 13, sizes: [size("s-hot-coffee-pistachio-latte", "p-hot-coffee-pistachio-latte", "Default", "Default", 130)] }),
  product({ id: "p-hot-coffee-french-coffee", slug: "hot-coffee-french-coffee", main: "cat-drinks", sub: "sub-hot-coffee", name_ar: "French Coffee", name_en: "French Coffee", sort_order: 14, sizes: [size("s-hot-coffee-french-coffee", "p-hot-coffee-french-coffee", "Default", "Default", 70)] }),
  product({ id: "p-hot-coffee-salted-caramel-latte", slug: "hot-coffee-salted-caramel-latte", main: "cat-drinks", sub: "sub-hot-coffee", name_ar: "Salted Caramel Latte", name_en: "Salted Caramel Latte", sort_order: 15, sizes: [size("s-hot-coffee-salted-caramel-latte", "p-hot-coffee-salted-caramel-latte", "Default", "Default", 130)] }),
  product({ id: "p-hot-coffee-turkish-coffee-s", slug: "hot-coffee-turkish-coffee-s", main: "cat-drinks", sub: "sub-hot-coffee", name_ar: "Turkish Coffee ( S )", name_en: "Turkish Coffee ( S )", sort_order: 16, sizes: [size("s-hot-coffee-turkish-coffee-s", "p-hot-coffee-turkish-coffee-s", "Default", "Default", 50)] }),
  product({ id: "p-hot-coffee-turkish-coffee-d", slug: "hot-coffee-turkish-coffee-d", main: "cat-drinks", sub: "sub-hot-coffee", name_ar: "Turkish Coffee ( D )", name_en: "Turkish Coffee ( D )", sort_order: 17, sizes: [size("s-hot-coffee-turkish-coffee-d", "p-hot-coffee-turkish-coffee-d", "Default", "Default", 70)] }),

  // Frappe_With_Coffee
  product({ id: "p-frappe-with-coffee-espresso-frappe", slug: "frappe-with-coffee-espresso-frappe", main: "cat-drinks", sub: "sub-frappe", name_ar: "Espresso Frappe", name_en: "Espresso Frappe", sort_order: 1, sizes: [size("s-frappe-with-coffee-espresso-frappe", "p-frappe-with-coffee-espresso-frappe", "Default", "Default", 110)] }),
  product({ id: "p-frappe-with-coffee-vanilla-frappe", slug: "frappe-with-coffee-vanilla-frappe", main: "cat-drinks", sub: "sub-frappe", name_ar: "Vanilla Frappe", name_en: "Vanilla Frappe", sort_order: 2, sizes: [size("s-frappe-with-coffee-vanilla-frappe", "p-frappe-with-coffee-vanilla-frappe", "Default", "Default", 130)] }),
  product({ id: "p-frappe-with-coffee-caramel-frappe", slug: "frappe-with-coffee-caramel-frappe", main: "cat-drinks", sub: "sub-frappe", name_ar: "Caramel Frappe", name_en: "Caramel Frappe", sort_order: 3, sizes: [size("s-frappe-with-coffee-caramel-frappe", "p-frappe-with-coffee-caramel-frappe", "Default", "Default", 130)] }),
  product({ id: "p-frappe-with-coffee-white-mocha-frappe", slug: "frappe-with-coffee-white-mocha-frappe", main: "cat-drinks", sub: "sub-frappe", name_ar: "White Mocha Frappe", name_en: "White Mocha Frappe", sort_order: 4, sizes: [size("s-frappe-with-coffee-white-mocha-frappe", "p-frappe-with-coffee-white-mocha-frappe", "Default", "Default", 130)] }),
  product({ id: "p-frappe-with-coffee-mocha-frappe", slug: "frappe-with-coffee-mocha-frappe", main: "cat-drinks", sub: "sub-frappe", name_ar: "Mocha Frappe", name_en: "Mocha Frappe", sort_order: 5, sizes: [size("s-frappe-with-coffee-mocha-frappe", "p-frappe-with-coffee-mocha-frappe", "Default", "Default", 130)] }),
  product({ id: "p-frappe-with-coffee-dulce-frappe", slug: "frappe-with-coffee-dulce-frappe", main: "cat-drinks", sub: "sub-frappe", name_ar: "Dulce Frappe", name_en: "Dulce Frappe", sort_order: 6, sizes: [size("s-frappe-with-coffee-dulce-frappe", "p-frappe-with-coffee-dulce-frappe", "Default", "Default", 130)] }),
  product({ id: "p-frappe-with-coffee-salted-caramel-frappe", slug: "frappe-with-coffee-salted-caramel-frappe", main: "cat-drinks", sub: "sub-frappe", name_ar: "Salted Caramel Frappe", name_en: "Salted Caramel Frappe", sort_order: 7, sizes: [size("s-frappe-with-coffee-salted-caramel-frappe", "p-frappe-with-coffee-salted-caramel-frappe", "Default", "Default", 130)] }),

  // Frappe_Non_Coffee
  product({ id: "p-frappe-non-coffee-vanilla-frappe", slug: "frappe-non-coffee-vanilla-frappe", main: "cat-drinks", sub: "sub-frappe-non-coffee", name_ar: "Vanilla Frappe", name_en: "Vanilla Frappe", sort_order: 1, sizes: [size("s-frappe-non-coffee-vanilla-frappe", "p-frappe-non-coffee-vanilla-frappe", "Default", "Default", 100)] }),
  product({ id: "p-frappe-non-coffee-caramel-frappe", slug: "frappe-non-coffee-caramel-frappe", main: "cat-drinks", sub: "sub-frappe-non-coffee", name_ar: "Caramel Frappe", name_en: "Caramel Frappe", sort_order: 2, sizes: [size("s-frappe-non-coffee-caramel-frappe", "p-frappe-non-coffee-caramel-frappe", "Default", "Default", 100)] }),
  product({ id: "p-frappe-non-coffee-dulce-frappe", slug: "frappe-non-coffee-dulce-frappe", main: "cat-drinks", sub: "sub-frappe-non-coffee", name_ar: "Dulce Frappe", name_en: "Dulce Frappe", sort_order: 3, sizes: [size("s-frappe-non-coffee-dulce-frappe", "p-frappe-non-coffee-dulce-frappe", "Default", "Default", 100)] }),
  product({ id: "p-frappe-non-coffee-nutella-frappe", slug: "frappe-non-coffee-nutella-frappe", main: "cat-drinks", sub: "sub-frappe-non-coffee", name_ar: "Nutella Frappe", name_en: "Nutella Frappe", sort_order: 4, sizes: [size("s-frappe-non-coffee-nutella-frappe", "p-frappe-non-coffee-nutella-frappe", "Default", "Default", 130)] }),
  product({ id: "p-frappe-non-coffee-mango-frappe", slug: "frappe-non-coffee-mango-frappe", main: "cat-drinks", sub: "sub-frappe-non-coffee", name_ar: "Mango Frappe", name_en: "Mango Frappe", sort_order: 5, sizes: [size("s-frappe-non-coffee-mango-frappe", "p-frappe-non-coffee-mango-frappe", "Default", "Default", 120)] }),
  product({ id: "p-frappe-non-coffee-passion-fruite-frappe", slug: "frappe-non-coffee-passion-fruite-frappe", main: "cat-drinks", sub: "sub-frappe-non-coffee", name_ar: "Passion Fruite Frappe", name_en: "Passion Fruite Frappe", sort_order: 6, sizes: [size("s-frappe-non-coffee-passion-fruite-frappe", "p-frappe-non-coffee-passion-fruite-frappe", "Default", "Default", 120)] }),
  product({ id: "p-frappe-non-coffee-peach-frappe", slug: "frappe-non-coffee-peach-frappe", main: "cat-drinks", sub: "sub-frappe-non-coffee", name_ar: "Peach Frappe", name_en: "Peach Frappe", sort_order: 7, sizes: [size("s-frappe-non-coffee-peach-frappe", "p-frappe-non-coffee-peach-frappe", "Default", "Default", 120)] }),
  product({ id: "p-frappe-non-coffee-blueberry-frappe", slug: "frappe-non-coffee-blueberry-frappe", main: "cat-drinks", sub: "sub-frappe-non-coffee", name_ar: "Blueberry Frappe", name_en: "Blueberry Frappe", sort_order: 8, sizes: [size("s-frappe-non-coffee-blueberry-frappe", "p-frappe-non-coffee-blueberry-frappe", "Default", "Default", 120)] }),
  product({ id: "p-frappe-non-coffee-strawberry-frappe", slug: "frappe-non-coffee-strawberry-frappe", main: "cat-drinks", sub: "sub-frappe-non-coffee", name_ar: "Strawberry Frappe", name_en: "Strawberry Frappe", sort_order: 9, sizes: [size("s-frappe-non-coffee-strawberry-frappe", "p-frappe-non-coffee-strawberry-frappe", "Default", "Default", 120)] }),
  product({ id: "p-frappe-non-coffee-coconut-frappe", slug: "frappe-non-coffee-coconut-frappe", main: "cat-drinks", sub: "sub-frappe-non-coffee", name_ar: "Coconut Frappe", name_en: "Coconut Frappe", sort_order: 10, sizes: [size("s-frappe-non-coffee-coconut-frappe", "p-frappe-non-coffee-coconut-frappe", "Default", "Default", 120)] }),

  // Dessert
  product({ id: "p-dessert-black-forest", slug: "dessert-black-forest", main: "cat-desserts", sub: "sub-dessert", name_ar: "Black Forest", name_en: "Black Forest", sort_order: 1, sizes: [size("s-dessert-black-forest", "p-dessert-black-forest", "Default", "Default", 140)] }),
  product({ id: "p-dessert-white-forest", slug: "dessert-white-forest", main: "cat-desserts", sub: "sub-dessert", name_ar: "White Forest", name_en: "White Forest", sort_order: 2, sizes: [size("s-dessert-white-forest", "p-dessert-white-forest", "Default", "Default", 140)] }),
  product({ id: "p-dessert-cheese-cake", slug: "dessert-cheese-cake", main: "cat-desserts", sub: "sub-dessert", name_ar: "Cheese Cake", name_en: "Cheese Cake", sort_order: 3, sizes: [size("s-dessert-cheese-cake", "p-dessert-cheese-cake", "Default", "Default", 140)] }),
  product({ id: "p-dessert-tiramisu", slug: "dessert-tiramisu", main: "cat-desserts", sub: "sub-dessert", name_ar: "Tiramisu", name_en: "Tiramisu", sort_order: 4, sizes: [size("s-dessert-tiramisu", "p-dessert-tiramisu", "Default", "Default", 145)] }),
  product({ id: "p-dessert-san-sebastian", slug: "dessert-san-sebastian", main: "cat-desserts", sub: "sub-dessert", name_ar: "San Sebastian", name_en: "San Sebastian", sort_order: 5, sizes: [size("s-dessert-san-sebastian", "p-dessert-san-sebastian", "Default", "Default", 140)] }),
  product({ id: "p-dessert-red-velvet", slug: "dessert-red-velvet", main: "cat-desserts", sub: "sub-dessert", name_ar: "Red Velvet", name_en: "Red Velvet", sort_order: 6, sizes: [size("s-dessert-red-velvet", "p-dessert-red-velvet", "Default", "Default", 140)] }),
  product({ id: "p-dessert-chocolate-roche", slug: "dessert-chocolate-roche", main: "cat-desserts", sub: "sub-dessert", name_ar: "Chocolate Roche", name_en: "Chocolate Roche", sort_order: 7, sizes: [size("s-dessert-chocolate-roche", "p-dessert-chocolate-roche", "Default", "Default", 140)] }),
  product({ id: "p-dessert-ultimate-chocolate", slug: "dessert-ultimate-chocolate", main: "cat-desserts", sub: "sub-dessert", name_ar: "Ultimate Chocolate", name_en: "Ultimate Chocolate", sort_order: 8, sizes: [size("s-dessert-ultimate-chocolate", "p-dessert-ultimate-chocolate", "Default", "Default", 140)] }),

  // Cold_Drinks
  product({ id: "p-cold-drinks-smoothie", slug: "cold-drinks-smoothie", main: "cat-drinks", sub: "sub-cold-drinks", name_ar: "Smoothie", name_en: "Smoothie", sort_order: 1, sizes: [size("s-cold-drinks-smoothie", "p-cold-drinks-smoothie", "Default", "Default", 130)] }),
  product({ id: "p-cold-drinks-milk-shake-nutella", slug: "cold-drinks-milk-shake-nutella", main: "cat-drinks", sub: "sub-cold-drinks", name_ar: "Milk Shake Nutella", name_en: "Milk Shake Nutella", sort_order: 2, sizes: [size("s-cold-drinks-milk-shake-nutella", "p-cold-drinks-milk-shake-nutella", "Default", "Default", 150)] }),
  product({ id: "p-cold-drinks-milk-shake-mango", slug: "cold-drinks-milk-shake-mango", main: "cat-drinks", sub: "sub-cold-drinks", name_ar: "Milk Shake Mango", name_en: "Milk Shake Mango", sort_order: 3, sizes: [size("s-cold-drinks-milk-shake-mango", "p-cold-drinks-milk-shake-mango", "Default", "Default", 140)] }),
  product({ id: "p-cold-drinks-milk-shake-peach", slug: "cold-drinks-milk-shake-peach", main: "cat-drinks", sub: "sub-cold-drinks", name_ar: "Milk Shake Peach", name_en: "Milk Shake Peach", sort_order: 4, sizes: [size("s-cold-drinks-milk-shake-peach", "p-cold-drinks-milk-shake-peach", "Default", "Default", 140)] }),
  product({ id: "p-cold-drinks-milk-shake-blueberry", slug: "cold-drinks-milk-shake-blueberry", main: "cat-drinks", sub: "sub-cold-drinks", name_ar: "Milk Shake Blueberry", name_en: "Milk Shake Blueberry", sort_order: 5, sizes: [size("s-cold-drinks-milk-shake-blueberry", "p-cold-drinks-milk-shake-blueberry", "Default", "Default", 140)] }),
  product({ id: "p-cold-drinks-milk-shake-oreo", slug: "cold-drinks-milk-shake-oreo", main: "cat-drinks", sub: "sub-cold-drinks", name_ar: "Milk Shake Oreo", name_en: "Milk Shake Oreo", sort_order: 6, sizes: [size("s-cold-drinks-milk-shake-oreo", "p-cold-drinks-milk-shake-oreo", "Default", "Default", 130)] }),
  product({ id: "p-cold-drinks-milk-shake-dulce", slug: "cold-drinks-milk-shake-dulce", main: "cat-drinks", sub: "sub-cold-drinks", name_ar: "Milk Shake Dulce", name_en: "Milk Shake Dulce", sort_order: 7, sizes: [size("s-cold-drinks-milk-shake-dulce", "p-cold-drinks-milk-shake-dulce", "Default", "Default", 130)] }),
  product({ id: "p-cold-drinks-milk-shake-lotus", slug: "cold-drinks-milk-shake-lotus", main: "cat-drinks", sub: "sub-cold-drinks", name_ar: "Milk Shake Lotus", name_en: "Milk Shake Lotus", sort_order: 8, sizes: [size("s-cold-drinks-milk-shake-lotus", "p-cold-drinks-milk-shake-lotus", "Default", "Default", 160)] }),
  product({ id: "p-cold-drinks-milk-coffee", slug: "cold-drinks-milk-coffee", main: "cat-drinks", sub: "sub-cold-drinks", name_ar: "Milk Coffee", name_en: "Milk Coffee", sort_order: 9, sizes: [size("s-cold-drinks-milk-coffee", "p-cold-drinks-milk-coffee", "Default", "Default", 110)] }),
];

const offers: Offer[] = [];

function enrichProducts(items: Product[]): Product[] {
  return items.map((item) => ({
    ...item,
    main_category: categories.find((c) => c.id === item.main_category_id) ?? null,
    subcategory: categories.find((c) => c.id === item.subcategory_id) ?? null,
    media: null,
  }));
}

export async function getSettings(): Promise<CafeSettings> {
  return settings;
}

export const getCategories = cache(async (visibleOnly = true) => {
  return visibleOnly ? categories.filter((c) => c.is_visible) : categories;
});

export const getProducts = cache(async (visibleOnly = true) => {
  const data = enrichProducts(products);
  return visibleOnly ? data.filter((p) => p.is_visible && p.is_available) : data;
});

export const getOffers = cache(async (visibleOnly = true) => {
  return visibleOnly ? offers.filter((o) => o.is_visible) : offers;
});

export async function getGroupedMenu(locale: Locale): Promise<MenuMainCategoryGroup[]> {
  const [allCategories, allProducts] = await Promise.all([getCategories(true), getProducts(true)]);
  const rootCategories = allCategories
    .filter((category) => !category.parent_id)
    .sort((a, b) => a.sort_order - b.sort_order);

  return rootCategories
    .map((mainCategory) => {
      const subcategories = allCategories
        .filter((category) => category.parent_id === mainCategory.id)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((subcategory) => {
          const subcategoryProducts = allProducts
            .filter((product) => product.subcategory_id === subcategory.id)
            .sort((a, b) => a.sort_order - b.sort_order);

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
  const item = enrichProducts(products).find((product) => product.slug === slug);
  if (!item) throw new Error(`Product not found: ${slug}`);
  return item;
}

export async function getOfferBySlug(slug: string) {
  const item = offers.find((offer) => offer.slug === slug);
  if (!item) throw new Error(`Offer not found: ${slug}`);
  return item;
}

export async function getDashboardStats() {
  const enriched = enrichProducts(products);
  const visibleProducts = enriched.filter((p) => p.is_visible).length;
  const hiddenProducts = enriched.filter((p) => !p.is_visible).length;
  const unavailableProducts = enriched.filter((p) => !p.is_available).length;
  const newBadgeProducts = enriched.filter((p) => p.is_new).length;

  return {
    totalProducts: enriched.length,
    totalCategories: categories.length,
    totalMainCategories: categories.filter((c) => !c.parent_id).length,
    totalSubcategories: categories.filter((c) => !!c.parent_id).length,
    visibleProducts,
    hiddenProducts,
    unavailableProducts,
    newBadgeProducts,
    totalOffers: offers.length,
    visibleOffers: offers.filter((o) => o.is_visible).length,
    recentProducts: enriched.slice(0, 5),
    recentOffers: offers.slice(0, 5),
  };
}