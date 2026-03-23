"use client";

const sections = [
  { id: "vault-overview", label: "نظرة عامة" },
  { id: "vault-categories", label: "الأقسام" },
  { id: "vault-products", label: "المنتجات" },
  { id: "vault-offers", label: "العروض" },
  { id: "vault-settings", label: "الإعدادات" },
  { id: "vault-password", label: "كلمة المرور" },
];

export function DashboardSectionNav() {
  function jump(id: string) {
    const element = document.getElementById(id);
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.scrollY - 92;
    window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
  }

  return (
    <div className="sticky top-3 z-20 -mx-1 overflow-x-auto px-1 no-scrollbar">
      <div className="flex min-w-max gap-2 rounded-full border border-maroon/10 bg-white/90 p-1.5 shadow-soft backdrop-blur">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => jump(section.id)}
            className="inline-flex min-h-[42px] items-center rounded-full px-4 text-sm font-semibold text-maroon/80 transition active:scale-[0.99]"
          >
            {section.label}
          </button>
        ))}
      </div>
    </div>
  );
}
