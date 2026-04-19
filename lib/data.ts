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
  google_maps_link: "",
  coordinates: null,
  phone: null,
  instagram: null,
  tiktok: null,

  logo_media_id: "local-logo",
  logo_media: media("/images/logo/cafe-logo.png"),

  hero_media_id: "local-hero",
  hero_media: media("/images/banner/menu-banner.jpg"),

  banner_media_id: "local-banner",
  banner_media: media("/images/banner/menu-banner.jpg"),

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
    media: media("/images/categories/drinks.jpg"),
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
  media: media("/images/categories/desserts.jpg"),
  sort_order: 2,
  is_visible: true,
  is_featured: true,
},

  {
    id: "sub-hot-drinks",
    slug: "hot-drinks",
    parent_id: "cat-drinks",
    name_ar: "مشروبات ساخنة",
    name_en: "Hot Drinks",
    description_ar: "المشروبات الساخنة.",
    description_en: "Hot drinks.",
    media_id: null,
    media: null,
    sort_order: 1,
    is_visible: true,
    is_featured: false,
  },
  {
    id: "sub-frappe",
    slug: "frappe",
    parent_id: "cat-drinks",
    name_ar: "فرابيه",
    name_en: "Frappe",
    description_ar: "مشروبات فرابيه.",
    description_en: "Frappe drinks.",
    media_id: null,
    media: null,
    sort_order: 2,
    is_visible: true,
    is_featured: false,
  },
  {
    id: "sub-matcha",
    slug: "matcha",
    parent_id: "cat-drinks",
    name_ar: "ماتشا",
    name_en: "Matcha",
    description_ar: "مشروبات ماتشا.",
    description_en: "Matcha drinks.",
    media_id: null,
    media: null,
    sort_order: 3,
    is_visible: true,
    is_featured: false,
  },
  {
    id: "sub-iced-drink",
    slug: "iced-drink",
    parent_id: "cat-drinks",
    name_ar: "مشروبات باردة",
    name_en: "Iced Drink",
    description_ar: "المشروبات الباردة.",
    description_en: "Iced drinks.",
    media_id: null,
    media: null,
    sort_order: 4,
    is_visible: true,
    is_featured: false,
  },
  {
    id: "sub-specialty-coffee",
    slug: "specialty-coffee",
    parent_id: "cat-drinks",
    name_ar: "قهوة مختصة",
    name_en: "Specialty Coffee",
    description_ar: "القهوة المختصة.",
    description_en: "Specialty coffee.",
    media_id: null,
    media: null,
    sort_order: 5,
    is_visible: true,
    is_featured: false,
  },
  {
    id: "sub-soft-drink",
    slug: "soft-drink",
    parent_id: "cat-drinks",
    name_ar: "سوفت درينك",
    name_en: "Soft Drink",
    description_ar: "مشروبات غازية ومياه.",
    description_en: "Soft drinks and water.",
    media_id: null,
    media: null,
    sort_order: 6,
    is_visible: true,
    is_featured: false,
  },
  {
    id: "sub-additions",
    slug: "additions",
    parent_id: "cat-drinks",
    name_ar: "إضافات",
    name_en: "Additions",
    description_ar: "إضافات للمشروبات.",
    description_en: "Drink additions.",
    media_id: null,
    media: null,
    sort_order: 7,
    is_visible: true,
    is_featured: false,
  },
  {
    id: "sub-dessert",
    slug: "dessert",
    parent_id: "cat-desserts",
    name_ar: "حلويات",
    name_en: "Dessert",
    description_ar: "قسم الحلويات.",
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
  // Hot drinks
  product({
    id: "p-espresso",
    slug: "espresso",
    main: "cat-drinks",
    sub: "sub-hot-drinks",
    name_ar: "اسبريسو",
    name_en: "Espresso",
    description_ar: "قهوة مركزة.",
    description_en: "Concentrated coffee shot.",
    sort_order: 1,
    sizes: [
      size("s-espresso-1", "p-espresso", "سنجل", "Single", 55, 1, false),
      size("s-espresso-2", "p-espresso", "دبل", "Double", 65, 2, true),
    ],
  }),
  product({
    id: "p-americano",
    slug: "americano",
    main: "cat-drinks",
    sub: "sub-hot-drinks",
    name_ar: "أمريكانو",
    name_en: "Americano",
    sort_order: 2,
    sizes: [size("s-americano", "p-americano", "عادي", "Regular", 65)],
  }),
  product({
    id: "p-latte",
    slug: "latte",
    main: "cat-drinks",
    sub: "sub-hot-drinks",
    name_ar: "لاتيه",
    name_en: "Latte",
    sort_order: 3,
    sizes: [size("s-latte", "p-latte", "عادي", "Regular", 80)],
  }),
  product({
    id: "p-cappuccino",
    slug: "cappuccino",
    main: "cat-drinks",
    sub: "sub-hot-drinks",
    name_ar: "كابتشينو",
    name_en: "Cappuccino",
    sort_order: 4,
    sizes: [size("s-cappuccino", "p-cappuccino", "عادي", "Regular", 85)],
  }),
  product({
    id: "p-macchiato",
    slug: "macchiato",
    main: "cat-drinks",
    sub: "sub-hot-drinks",
    name_ar: "ماكياتو",
    name_en: "Macchiato",
    sort_order: 5,
    sizes: [size("s-macchiato", "p-macchiato", "عادي", "Regular", 70)],
  }),
  product({
    id: "p-cortado",
    slug: "cortado",
    main: "cat-drinks",
    sub: "sub-hot-drinks",
    name_ar: "كورتادو",
    name_en: "Cortado",
    sort_order: 6,
    sizes: [size("s-cortado", "p-cortado", "عادي", "Regular", 75)],
  }),
  product({
    id: "p-spanish-latte",
    slug: "spanish-latte",
    main: "cat-drinks",
    sub: "sub-hot-drinks",
    name_ar: "اسبانيش لاتيه",
    name_en: "Spanish Latte",
    sort_order: 7,
    sizes: [size("s-spanish-latte", "p-spanish-latte", "عادي", "Regular", 90)],
  }),
  product({
    id: "p-mocha",
    slug: "mocha",
    main: "cat-drinks",
    sub: "sub-hot-drinks",
    name_ar: "هوت موكا",
    name_en: "Hot Mocha",
    sort_order: 8,
    sizes: [size("s-mocha", "p-mocha", "عادي", "Regular", 100)],
  }),
  product({
    id: "p-white-mocha",
    slug: "white-mocha",
    main: "cat-drinks",
    sub: "sub-hot-drinks",
    name_ar: "هوت وايت موكا",
    name_en: "Hot White Mocha",
    sort_order: 9,
    sizes: [size("s-white-mocha", "p-white-mocha", "عادي", "Regular", 100)],
  }),
  product({
    id: "p-hot-chocolate",
    slug: "hot-chocolate",
    main: "cat-drinks",
    sub: "sub-hot-drinks",
    name_ar: "هوت شوكليت",
    name_en: "Hot Chocolate",
    sort_order: 10,
    sizes: [size("s-hot-chocolate", "p-hot-chocolate", "عادي", "Regular", 85)],
  }),
  product({
    id: "p-hot-cider",
    slug: "hot-cider",
    main: "cat-drinks",
    sub: "sub-hot-drinks",
    name_ar: "هوت سايدر",
    name_en: "Hot Cider",
    sort_order: 11,
    sizes: [size("s-hot-cider", "p-hot-cider", "عادي", "Regular", 60)],
  }),
  product({
    id: "p-hot-lotus",
    slug: "hot-lotus",
    main: "cat-drinks",
    sub: "sub-hot-drinks",
    name_ar: "هوت لوتس",
    name_en: "Hot Lotus",
    sort_order: 12,
    sizes: [size("s-hot-lotus", "p-hot-lotus", "عادي", "Regular", 100)],
  }),
  product({
    id: "p-hot-pistachio",
    slug: "hot-pistachio",
    main: "cat-drinks",
    sub: "sub-hot-drinks",
    name_ar: "هوت بستاشيو",
    name_en: "Hot Pistachio",
    sort_order: 13,
    sizes: [size("s-hot-pistachio", "p-hot-pistachio", "عادي", "Regular", 100)],
  }),
  product({
    id: "p-hot-nutella",
    slug: "hot-nutella",
    main: "cat-drinks",
    sub: "sub-hot-drinks",
    name_ar: "هوت نوتيلا",
    name_en: "Hot Nutella",
    sort_order: 14,
    sizes: [size("s-hot-nutella", "p-hot-nutella", "عادي", "Regular", 100)],
  }),

  // Frappe
  product({
    id: "p-latte-frappe",
    slug: "latte-frappe",
    main: "cat-drinks",
    sub: "sub-frappe",
    name_ar: "لاتيه فرابيه",
    name_en: "Latte Frappe",
    sort_order: 1,
    sizes: [size("s-latte-frappe", "p-latte-frappe", "عادي", "Regular", 100)],
  }),
  product({
    id: "p-caramel-frappe",
    slug: "caramel-frappe",
    main: "cat-drinks",
    sub: "sub-frappe",
    name_ar: "كارمل فرابيه",
    name_en: "Caramel Frappe",
    sort_order: 2,
    sizes: [size("s-caramel-frappe", "p-caramel-frappe", "عادي", "Regular", 110)],
  }),
  product({
    id: "p-white-mocha-frappe",
    slug: "white-mocha-frappe",
    main: "cat-drinks",
    sub: "sub-frappe",
    name_ar: "فرابيه موكا وايت",
    name_en: "White Mocha Frappe",
    sort_order: 3,
    sizes: [size("s-white-mocha-frappe", "p-white-mocha-frappe", "عادي", "Regular", 110)],
  }),
  product({
    id: "p-mocha-frappe",
    slug: "mocha-frappe",
    main: "cat-drinks",
    sub: "sub-frappe",
    name_ar: "فرابيه موكا",
    name_en: "Mocha Frappe",
    sort_order: 4,
    sizes: [size("s-mocha-frappe", "p-mocha-frappe", "عادي", "Regular", 100)],
  }),
  product({
    id: "p-espresso-frappe",
    slug: "espresso-frappe",
    main: "cat-drinks",
    sub: "sub-frappe",
    name_ar: "اسبريسو فرابيه",
    name_en: "Espresso Frappe",
    sort_order: 5,
    sizes: [size("s-espresso-frappe", "p-espresso-frappe", "عادي", "Regular", 100)],
  }),
  product({
    id: "p-nutella-frappe",
    slug: "nutella-frappe",
    main: "cat-drinks",
    sub: "sub-frappe",
    name_ar: "فرابيه نوتيلا",
    name_en: "Nutella Frappe",
    sort_order: 6,
    sizes: [size("s-nutella-frappe", "p-nutella-frappe", "عادي", "Regular", 120)],
  }),
  product({
    id: "p-lotus-frappe",
    slug: "lotus-frappe",
    main: "cat-drinks",
    sub: "sub-frappe",
    name_ar: "فرابيه لوتس",
    name_en: "Lotus Frappe",
    sort_order: 7,
    sizes: [size("s-lotus-frappe", "p-lotus-frappe", "عادي", "Regular", 120)],
  }),
  product({
    id: "p-pistachio-frappe",
    slug: "pistachio-frappe",
    main: "cat-drinks",
    sub: "sub-frappe",
    name_ar: "فرابيه بستاشيو",
    name_en: "Pistachio Frappe",
    sort_order: 8,
    sizes: [size("s-pistachio-frappe", "p-pistachio-frappe", "عادي", "Regular", 120)],
  }),

  // Matcha
  product({
    id: "p-hot-matcha",
    slug: "hot-matcha",
    main: "cat-drinks",
    sub: "sub-matcha",
    name_ar: "هوت ماتشا",
    name_en: "Hot Matcha",
    sort_order: 1,
    sizes: [size("s-hot-matcha", "p-hot-matcha", "عادي", "Regular", 80)],
  }),
  product({
    id: "p-iced-matcha",
    slug: "iced-matcha",
    main: "cat-drinks",
    sub: "sub-matcha",
    name_ar: "آيس ماتشا",
    name_en: "Iced Matcha",
    sort_order: 2,
    sizes: [size("s-iced-matcha", "p-iced-matcha", "عادي", "Regular", 90)],
  }),

  // Iced drinks
  product({
    id: "p-iced-latte",
    slug: "iced-latte",
    main: "cat-drinks",
    sub: "sub-iced-drink",
    name_ar: "آيس لاتيه",
    name_en: "Iced Latte",
    sort_order: 1,
    sizes: [size("s-iced-latte", "p-iced-latte", "عادي", "Regular", 90)],
  }),
  product({
    id: "p-iced-mocha",
    slug: "iced-mocha",
    main: "cat-drinks",
    sub: "sub-iced-drink",
    name_ar: "آيس موكا",
    name_en: "Iced Mocha",
    sort_order: 2,
    sizes: [size("s-iced-mocha", "p-iced-mocha", "عادي", "Regular", 100)],
  }),
  product({
    id: "p-iced-white-mocha",
    slug: "iced-white-mocha",
    main: "cat-drinks",
    sub: "sub-iced-drink",
    name_ar: "آيس وايت موكا",
    name_en: "Iced White Mocha",
    sort_order: 3,
    sizes: [size("s-iced-white-mocha", "p-iced-white-mocha", "عادي", "Regular", 100)],
  }),
  product({
    id: "p-iced-caramel-macchiato",
    slug: "iced-caramel-macchiato",
    main: "cat-drinks",
    sub: "sub-iced-drink",
    name_ar: "آيس كراميل ماكياتو",
    name_en: "Iced Caramel Macchiato",
    sort_order: 4,
    sizes: [size("s-iced-caramel-macchiato", "p-iced-caramel-macchiato", "عادي", "Regular", 100)],
  }),
  product({
    id: "p-iced-spanish-latte",
    slug: "iced-spanish-latte",
    main: "cat-drinks",
    sub: "sub-iced-drink",
    name_ar: "آيس اسبانيش لاتيه",
    name_en: "Iced Spanish Latte",
    sort_order: 5,
    sizes: [size("s-iced-spanish-latte", "p-iced-spanish-latte", "عادي", "Regular", 90)],
  }),

  // Milkshakes
  product({ id: "p-vanilla-milkshake", slug: "vanilla-milkshake", main: "cat-drinks", sub: "sub-iced-drink", name_ar: "ميلك شيك فانيليا", name_en: "Vanilla Milkshake", sort_order: 6, sizes: [size("s-vanilla-milkshake", "p-vanilla-milkshake", "عادي", "Regular", 90)] }),
  product({ id: "p-mango-milkshake", slug: "mango-milkshake", main: "cat-drinks", sub: "sub-iced-drink", name_ar: "ميلك شيك مانجو", name_en: "Mango Milkshake", sort_order: 7, sizes: [size("s-mango-milkshake", "p-mango-milkshake", "عادي", "Regular", 90)] }),
  product({ id: "p-strawberry-milkshake", slug: "strawberry-milkshake", main: "cat-drinks", sub: "sub-iced-drink", name_ar: "ميلك شيك فراولة", name_en: "Strawberry Milkshake", sort_order: 8, sizes: [size("s-strawberry-milkshake", "p-strawberry-milkshake", "عادي", "Regular", 90)] }),
  product({ id: "p-chocolate-milkshake", slug: "chocolate-milkshake", main: "cat-drinks", sub: "sub-iced-drink", name_ar: "ميلك شيك شوكولاتة", name_en: "Chocolate Milkshake", sort_order: 9, sizes: [size("s-chocolate-milkshake", "p-chocolate-milkshake", "عادي", "Regular", 90)] }),
  product({ id: "p-berry-milkshake", slug: "berry-milkshake", main: "cat-drinks", sub: "sub-iced-drink", name_ar: "ميلك شيك توت", name_en: "Berry Milkshake", sort_order: 10, sizes: [size("s-berry-milkshake", "p-berry-milkshake", "عادي", "Regular", 105)] }),
  product({ id: "p-coffee-milkshake", slug: "coffee-milkshake", main: "cat-drinks", sub: "sub-iced-drink", name_ar: "ميلك شيك كوفي", name_en: "Coffee Milkshake", sort_order: 11, sizes: [size("s-coffee-milkshake", "p-coffee-milkshake", "عادي", "Regular", 105)] }),
  product({ id: "p-milk-oreo", slug: "milk-oreo", main: "cat-drinks", sub: "sub-iced-drink", name_ar: "ميلك شيك أوريو", name_en: "Oreo Milkshake", sort_order: 12, sizes: [size("s-milk-oreo", "p-milk-oreo", "عادي", "Regular", 105)] }),
  product({ id: "p-passion-fruit-milkshake", slug: "passion-fruit-milkshake", main: "cat-drinks", sub: "sub-iced-drink", name_ar: "ميلك شيك باشن فروت", name_en: "Passion Fruit Milkshake", sort_order: 13, sizes: [size("s-passion-fruit-milkshake", "p-passion-fruit-milkshake", "عادي", "Regular", 105)] }),
  product({ id: "p-lotus-milkshake", slug: "lotus-milkshake", main: "cat-drinks", sub: "sub-iced-drink", name_ar: "ميلك شيك لوتس", name_en: "Lotus Milkshake", sort_order: 14, sizes: [size("s-lotus-milkshake", "p-lotus-milkshake", "عادي", "Regular", 120)] }),
  product({ id: "p-pistachio-milkshake", slug: "pistachio-milkshake", main: "cat-drinks", sub: "sub-iced-drink", name_ar: "ميلك شيك بستاشيو", name_en: "Pistachio Milkshake", sort_order: 15, sizes: [size("s-pistachio-milkshake", "p-pistachio-milkshake", "عادي", "Regular", 120)] }),
  product({ id: "p-nutella-milkshake", slug: "nutella-milkshake", main: "cat-drinks", sub: "sub-iced-drink", name_ar: "ميلك شيك نوتيلا", name_en: "Nutella Milkshake", sort_order: 16, sizes: [size("s-nutella-milkshake", "p-nutella-milkshake", "عادي", "Regular", 120)] }),
  product({ id: "p-cheesecake-milkshake", slug: "cheesecake-milkshake", main: "cat-drinks", sub: "sub-iced-drink", name_ar: "ميلك شيك تشيز كيك", name_en: "Cheesecake Milkshake", sort_order: 17, sizes: [size("s-cheesecake-milkshake", "p-cheesecake-milkshake", "عادي", "Regular", 120)] }),
  product({ id: "p-red-velvet-milkshake", slug: "red-velvet-milkshake", main: "cat-drinks", sub: "sub-iced-drink", name_ar: "ميلك شيك ريد فيلفيت", name_en: "Red Velvet Milkshake", sort_order: 18, sizes: [size("s-red-velvet-milkshake", "p-red-velvet-milkshake", "عادي", "Regular", 120)] }),
  product({ id: "p-coffee-chocolate-milkshake", slug: "coffee-chocolate-milkshake", main: "cat-drinks", sub: "sub-iced-drink", name_ar: "ميلك شيك كوفي شوكولاتة", name_en: "Coffee Chocolate Milkshake", sort_order: 19, sizes: [size("s-coffee-chocolate-milkshake", "p-coffee-chocolate-milkshake", "عادي", "Regular", 120)] }),

  // Specialty coffee
  product({
    id: "p-cold-brew",
    slug: "cold-brew",
    main: "cat-drinks",
    sub: "sub-specialty-coffee",
    name_ar: "كولد برو",
    name_en: "Cold Brew",
    sort_order: 1,
    sizes: [size("s-cold-brew", "p-cold-brew", "عادي", "Regular", 100)],
  }),
  product({
    id: "p-v60",
    slug: "v60",
    main: "cat-drinks",
    sub: "sub-specialty-coffee",
    name_ar: "في 60",
    name_en: "V60",
    sort_order: 2,
    sizes: [size("s-v60", "p-v60", "عادي", "Regular", 120)],
  }),

  // Soft drink
  product({
    id: "p-water",
    slug: "small-water",
    main: "cat-drinks",
    sub: "sub-soft-drink",
    name_ar: "مياه ساقعة",
    name_en: "Cold Water",
    sort_order: 1,
    sizes: [size("s-water", "p-water", "عادي", "Regular", 10)],
  }),
  product({
    id: "p-v-cola",
    slug: "v-cola",
    main: "cat-drinks",
    sub: "sub-soft-drink",
    name_ar: "ڤي كولا",
    name_en: "V Cola",
    sort_order: 2,
    sizes: [size("s-v-cola", "p-v-cola", "عادي", "Regular", 40)],
  }),
  product({
    id: "p-red-bull",
    slug: "red-bull",
    main: "cat-drinks",
    sub: "sub-soft-drink",
    name_ar: "ريد بول",
    name_en: "Red Bull",
    sort_order: 3,
    sizes: [size("s-red-bull", "p-red-bull", "عادي", "Regular", 90)],
  }),

  // Additions
  product({ id: "p-extra-sauce", slug: "extra-sauce", main: "cat-drinks", sub: "sub-additions", name_ar: "صوص اكسترا", name_en: "Extra Sauce", sort_order: 1, sizes: [size("s-extra-sauce", "p-extra-sauce", "عادي", "Regular", 25)] }),
  product({ id: "p-syrup", slug: "syrup", main: "cat-drinks", sub: "sub-additions", name_ar: "سيرب", name_en: "Syrup", sort_order: 2, sizes: [size("s-syrup", "p-syrup", "عادي", "Regular", 20)] }),
  product({ id: "p-ice-cup", slug: "ice-cup", main: "cat-drinks", sub: "sub-additions", name_ar: "آيس كب", name_en: "Ice Cup", sort_order: 3, sizes: [size("s-ice-cup", "p-ice-cup", "عادي", "Regular", 10)] }),
  product({ id: "p-milk", slug: "milk", main: "cat-drinks", sub: "sub-additions", name_ar: "لبن", name_en: "Milk", sort_order: 4, sizes: [size("s-milk", "p-milk", "عادي", "Regular", 20)] }),
  product({ id: "p-whipped-cream", slug: "whipped-cream", main: "cat-drinks", sub: "sub-additions", name_ar: "ويب كريم", name_en: "Whipped Cream", sort_order: 5, sizes: [size("s-whipped-cream", "p-whipped-cream", "عادي", "Regular", 25)] }),
  product({ id: "p-espresso-shot", slug: "espresso-shot", main: "cat-drinks", sub: "sub-additions", name_ar: "شوت اسبريسو", name_en: "Espresso Shot", sort_order: 6, sizes: [size("s-espresso-shot", "p-espresso-shot", "عادي", "Regular", 25)] }),

  // Desserts
  product({ id: "p-cheesecake", slug: "cheesecake", main: "cat-desserts", sub: "sub-dessert", name_ar: "تشيز كيك", name_en: "Cheesecake", sort_order: 1, sizes: [size("s-cheesecake", "p-cheesecake", "عادي", "Regular", 90)] }),
  product({ id: "p-ferrero", slug: "ferrero-rocher-cake", main: "cat-desserts", sub: "sub-dessert", name_ar: "فيريرو روشيه", name_en: "Ferrero Rocher", sort_order: 2, sizes: [size("s-ferrero", "p-ferrero", "عادي", "Regular", 90)] }),
  product({ id: "p-red-velvet-cake", slug: "red-velvet-cake", main: "cat-desserts", sub: "sub-dessert", name_ar: "ريد فيلفيت", name_en: "Red Velvet", sort_order: 3, sizes: [size("s-red-velvet-cake", "p-red-velvet-cake", "عادي", "Regular", 90)] }),
  product({ id: "p-lemon-raspberry", slug: "lemon-raspberry-cake", main: "cat-desserts", sub: "sub-dessert", name_ar: "ليمون راسبيري", name_en: "Lemon Raspberry", sort_order: 4, sizes: [size("s-lemon-raspberry", "p-lemon-raspberry", "عادي", "Regular", 90)] }),
  product({ id: "p-san-sebastian", slug: "san-sebastian", main: "cat-desserts", sub: "sub-dessert", name_ar: "سان سبستيان", name_en: "San Sebastian", sort_order: 5, sizes: [size("s-san-sebastian", "p-san-sebastian", "عادي", "Regular", 100)] }),
  product({ id: "p-white-chocolate-cake", slug: "white-chocolate-cake", main: "cat-desserts", sub: "sub-dessert", name_ar: "كيك شوكليت وايت", name_en: "White Chocolate Cake", sort_order: 6, sizes: [size("s-white-chocolate-cake", "p-white-chocolate-cake", "عادي", "Regular", 90)] }),
  product({ id: "p-dark-chocolate-cake", slug: "dark-chocolate-cake", main: "cat-desserts", sub: "sub-dessert", name_ar: "كيك شوكليت دارك", name_en: "Dark Chocolate Cake", sort_order: 7, sizes: [size("s-dark-chocolate-cake", "p-dark-chocolate-cake", "عادي", "Regular", 90)] }),
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