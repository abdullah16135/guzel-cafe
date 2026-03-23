import { requireAdmin } from "@/lib/auth";
import { getCategories, getDashboardStats, getOffers, getProducts, getSettings } from "@/lib/data";
import { StatCard } from "@/components/dashboard/stat-card";
import { CategoryManager } from "@/components/dashboard/category-manager";
import { ProductManager } from "@/components/dashboard/product-manager";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { OfferManager } from "@/components/dashboard/offer-manager";
import { PasswordForm } from "@/components/dashboard/password-form";
import { DashboardSectionNav } from "@/components/dashboard/dashboard-section-nav";

function SectionShell({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-4 scroll-mt-28">
      <h2 className="font-serif text-3xl text-maroon">{title}</h2>
      {children}
    </section>
  );
}

export default async function VaultPage() {
  await requireAdmin();
  const [stats, categories, products, settings, offers] = await Promise.all([
    getDashboardStats(),
    getCategories(false),
    getProducts(false),
    getSettings(),
    getOffers(false),
  ]);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section id="vault-overview" className="rounded-[32px] border border-maroon/10 bg-white/90 p-5 shadow-soft scroll-mt-28 sm:p-6">
          <p className="text-sm font-semibold tracking-[0.25em] text-gold">لوحة التحكم</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-serif text-4xl text-maroon sm:text-5xl">لوحة التحكم</h1>
              <p className="mt-2 text-sm leading-7 text-maroon/70 sm:text-base">إدارة الأقسام، المنتجات، العروض، والصور من مكان واحد بشكل مناسب للموبايل والكمبيوتر.</p>
            </div>
          </div>
        </section>

        <DashboardSectionNav />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
          <StatCard label="إجمالي المنتجات" value={stats.totalProducts} />
          <StatCard label="إجمالي الأقسام" value={stats.totalCategories} />
          <StatCard label="المنتجات الظاهرة" value={stats.visibleProducts} />
          <StatCard label="المنتجات المخفية" value={stats.hiddenProducts} />
          <StatCard label="منتجات NEW" value={stats.newBadgeProducts} />
          <StatCard label="إجمالي العروض" value={stats.totalOffers} />
          <StatCard label="العروض الظاهرة" value={stats.visibleOffers} />
        </div>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[28px] border border-maroon/10 bg-white/90 p-5 shadow-soft">
            <h2 className="mb-4 font-serif text-2xl text-maroon">آخر المنتجات</h2>
            <div className="space-y-3">{stats.recentProducts?.map((item: any) => <div key={item.id} className="flex items-center justify-between rounded-2xl border border-maroon/10 bg-[#fffaf8] px-4 py-3"><p className="font-semibold text-maroon">{item.name_ar || item.name_en}</p><div className="text-xs text-maroon/55">{item.created_at ? new Date(item.created_at).toLocaleDateString("ar-EG") : "-"}</div></div>)}</div>
          </div>
          <div className="rounded-[28px] border border-maroon/10 bg-white/90 p-5 shadow-soft">
            <h2 className="mb-4 font-serif text-2xl text-maroon">آخر العروض</h2>
            <div className="space-y-3">{stats.recentOffers?.map((item: any) => <div key={item.id} className="flex items-center justify-between rounded-2xl border border-maroon/10 bg-[#fffaf8] px-4 py-3"><p className="font-semibold text-maroon">{item.name_ar || item.name_en}</p><div className="text-xs text-maroon/55">{item.created_at ? new Date(item.created_at).toLocaleDateString("ar-EG") : "-"}</div></div>)}</div>
          </div>
        </section>

        <SectionShell id="vault-categories" title="الأقسام">
          <CategoryManager initialData={categories} />
        </SectionShell>

        <SectionShell id="vault-products" title="المنتجات">
          <ProductManager initialData={products} categories={categories} />
        </SectionShell>

        <SectionShell id="vault-offers" title="العروض">
          <OfferManager initialData={offers} products={products} categories={categories} />
        </SectionShell>

        <SectionShell id="vault-settings" title="إعدادات الموقع">
          <SettingsForm initialData={settings} />
        </SectionShell>

        <SectionShell id="vault-password" title="تغيير كلمة المرور">
          <PasswordForm />
        </SectionShell>
      </div>
    </main>
  );
}
