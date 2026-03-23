export const MENU_ANALYSIS = {
  categories: [
    {
      ar: "موكتيل",
      en: "Mocktail",
      products: ["Mojito", "Mixed Berry Mojito", "Blue Lemon Citrus", "Passion Lemon Soda", "Blue Strawberry"],
      sizes: ["Regular"],
      pricePattern: "55 EGP لكل منتج ظاهر في الملف",
    },
    {
      ar: "حلويات",
      en: "Desserts",
      products: ["Waffle Sauce", "Fruit Waffle", "Pancake", "Mini Pancake", "Fettuccine Crepe", "Special Fettuccine Crepe"],
      sizes: ["Regular"],
      pricePattern: "55 EGP لكل منتج ظاهر في الملف",
    },
    {
      ar: "مشروبات ساخنة",
      en: "Hot Drink",
      products: ["Espresso", "Macchiato", "Espresso Cortado", "Turkish Coffee", "Americano", "Coffee of the Day", "Hazelnut Coffee", "French Coffee", "Cortado", "Flat White", "Latte", "Cappuccino", "Spanish Latte", "Mocha", "White Mocha"],
      sizes: ["D", "S"],
      pricePattern: "55 EGP للمقاسين الظاهرين D و S حسب الملف المرفوع",
    },
    {
      ar: "مشروبات باردة",
      en: "Iced Drink",
      products: ["Iced Latte", "Iced Mocha", "Iced White Mocha", "Iced Spanish Latte", "Iced Salted Caramel"],
      sizes: ["Regular"],
      pricePattern: "55 EGP لكل منتج ظاهر في الملف",
    },
    {
      ar: "قهوة مختصة",
      en: "Specialty Coffee",
      products: ["Chemex", "Fruity Chemex", "V60", "Fruity V60"],
      sizes: ["Regular"],
      pricePattern: "55 EGP لكل منتج ظاهر في الملف",
    },
    {
      ar: "مشروبات غازية",
      en: "Soft Drink",
      products: ["Pepsi", "7Up", "Mirinda", "Small Water", "Large Water"],
      sizes: ["Regular"],
      pricePattern: "55 EGP لكل منتج ظاهر في الملف",
    }
  ],
  visualIdentity: {
    palette: ["Maroon", "Soft blush pink", "Cream", "Beige", "Soft gold accent"],
    typography: "Classic serif headings with elegant Arabic/English bilingual layout",
    mood: "Luxury Turkish café, feminine boutique warmth, premium calm atmosphere",
    motifs: "Damask / floral background pattern, high-contrast editorial section titles",
  },
  generatedNotes: {
    descriptions: "تم توليد وصف احترافي عربي/إنجليزي لكل منتج لأن الملفات المرفوعة لم تتضمن أوصافًا تفصيلية.",
    images: "تم اعتماد نظام صور فعلي يرفع إلى Supabase Storage مع Placeholder أنيق لحين رفع صور أصلية من لوحة التحكم.",
  },
};
