"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { Locale, Offer, Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { MediaTile } from "@/components/media-tile";
import { cn, formatCurrency } from "@/lib/utils";
import { pickLocaleText } from "@/lib/i18n";

type Group = {
  id: string;
  slug?: string;
  label: string;
  description?: string | null;
  media?: { public_url: string | null } | null;
  products: Product[];
  subcategories: {
    id: string;
    slug?: string;
    label: string;
    description?: string | null;
    media?: { public_url: string | null } | null;
    products: Product[];
  }[];
};

function countProducts(group: Group) {
  return group.products.length + group.subcategories.reduce((sum, item) => sum + item.products.length, 0);
}

function groupKey(group: Group) {
  return group.slug || group.id;
}

function sectionKey(section: { id: string; slug?: string }) {
  return section.slug || section.id;
}

function OfferStrip({ offer, locale }: { offer: Offer; locale: Locale }) {
  const isAr = locale === "ar";
  const name = pickLocaleText(locale, offer.name_ar, offer.name_en);
  const description = pickLocaleText(locale, offer.description_ar, offer.description_en);
  const badge = pickLocaleText(locale, offer.badge_ar, offer.badge_en) || (isAr ? "عرض" : "Offer");
  return (
    <Link href={`/offers/${offer.slug}`} className="block overflow-hidden rounded-[22px] border border-maroon/10 bg-[#fff8f5] shadow-[0_8px_22px_rgba(115,18,38,0.05)] active:scale-[0.995]">
      <article className="grid grid-cols-[94px_minmax(0,1fr)] gap-0 sm:grid-cols-[118px_minmax(0,1fr)]">
        <MediaTile src={offer.media?.public_url} alt={name} label={name} className="h-full min-h-[102px] rounded-none" fallbackTone="warm" />
        <div className="flex min-w-0 flex-col justify-between p-3.5">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex h-7 items-center rounded-full bg-maroon px-3 text-[11px] font-semibold text-white">{badge}</span>
              <span className="text-xs text-maroon/48">{isAr ? "عرض مجمّع" : "Bundle offer"}</span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-serif text-[1.06rem] leading-6 text-maroon">{name}</h4>
              <span className="shrink-0 text-sm font-semibold text-maroon">{formatCurrency(offer.offer_price)}</span>
            </div>
            {description ? <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-maroon/66">{description}</p> : null}
          </div>
          <div className="mt-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-maroon/62">
            <Tag className="h-3.5 w-3.5" />
            {isAr ? "عرض متاح" : "Offer available"}
          </div>
        </div>
      </article>
    </Link>
  );
}

export function MenuTabs({
  groups,
  offers,
  locale,
  selectedCategory,
  selectedSection,
}: {
  groups: Group[];
  offers: Offer[];
  locale: Locale;
  selectedCategory?: string;
  selectedSection?: string;
}) {
  const isAr = locale === "ar";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const detailsRef = useRef<HTMLElement | null>(null);
  const shouldScrollToDetailsRef = useRef(false);

  const defaultGroup = groups.find((group) => groupKey(group) === selectedCategory) ?? groups[0] ?? null;
  const [activeCategoryKey, setActiveCategoryKey] = useState<string | null>(defaultGroup ? groupKey(defaultGroup) : null);

  useEffect(() => {
    const match = groups.find((group) => groupKey(group) === selectedCategory) ?? groups[0] ?? null;
    setActiveCategoryKey(match ? groupKey(match) : null);
  }, [groups, selectedCategory]);

  const activeGroup = useMemo(() => groups.find((group) => groupKey(group) === activeCategoryKey) ?? groups[0] ?? null, [groups, activeCategoryKey]);

  const visibleSubsections = useMemo(() => {
    if (!activeGroup) return [];
    return [
      ...(activeGroup.products.length
        ? [
            {
              id: `${activeGroup.id}-all`,
              slug: `${groupKey(activeGroup)}-all`,
              label: isAr ? "كل العناصر" : "All items",
              description: activeGroup.description,
              media: activeGroup.media,
              products: activeGroup.products,
            },
          ]
        : []),
      ...activeGroup.subcategories.filter((section) => section.products.length > 0),
    ];
  }, [activeGroup, isAr]);

  const [activeSectionKey, setActiveSectionKey] = useState<string | null>(
    visibleSubsections.find((section) => sectionKey(section) === selectedSection)?.slug ||
      visibleSubsections.find((section) => sectionKey(section) === selectedSection)?.id ||
      visibleSubsections[0]?.slug ||
      visibleSubsections[0]?.id ||
      null
  );

  useEffect(() => {
    const nextKey =
      visibleSubsections.find((section) => sectionKey(section) === selectedSection)?.slug ||
      visibleSubsections.find((section) => sectionKey(section) === selectedSection)?.id ||
      visibleSubsections[0]?.slug ||
      visibleSubsections[0]?.id ||
      null;
    setActiveSectionKey(nextKey);
  }, [visibleSubsections, selectedSection]);

  const activeSection = useMemo(() => visibleSubsections.find((section) => sectionKey(section) === activeSectionKey) ?? visibleSubsections[0] ?? null, [visibleSubsections, activeSectionKey]);

  const categoryOffers = useMemo(() => {
    if (!activeGroup) return [];
    return offers.filter((offer) => (offer.category_ids ?? []).includes(activeGroup.id) && !(offer.section_ids ?? []).length);
  }, [offers, activeGroup]);

  const sectionOffers = useMemo(() => {
    if (!activeSection) return [];
    return offers.filter((offer) => (offer.section_ids ?? []).includes(activeSection.id));
  }, [offers, activeSection]);

  function updateQuery(category: string, section?: string | null) {
    const next = new URLSearchParams(searchParams.toString());
    next.set("category", category);
    if (section) next.set("section", section);
    else next.delete("section");

    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    });
  }

  function selectCategory(nextCategory: string) {
    if (nextCategory === activeCategoryKey) {
      if (detailsRef.current) {
        const top = detailsRef.current.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
      }
      return;
    }
    shouldScrollToDetailsRef.current = true;
    setActiveCategoryKey(nextCategory);
    const nextGroup = groups.find((group) => groupKey(group) === nextCategory) ?? null;
    const nextSections = nextGroup
      ? [
          ...(nextGroup.products.length
            ? [
                {
                  id: `${nextGroup.id}-all`,
                  slug: `${groupKey(nextGroup)}-all`,
                },
              ]
            : []),
          ...nextGroup.subcategories.filter((section) => section.products.length > 0),
        ]
      : [];
    const firstSection = nextSections[0] ? sectionKey(nextSections[0]) : null;
    setActiveSectionKey(firstSection);
    updateQuery(nextCategory, firstSection);
  }

  function selectSection(nextSection: string) {
    if (!activeGroup || nextSection === activeSectionKey) return;
    setActiveSectionKey(nextSection);
    updateQuery(groupKey(activeGroup), nextSection);
  }

  useEffect(() => {
    if (!activeGroup || !shouldScrollToDetailsRef.current || !detailsRef.current) return;
    const frame = window.requestAnimationFrame(() => {
      const top = detailsRef.current!.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
      shouldScrollToDetailsRef.current = false;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeGroup]);

  if (!groups.length) return null;

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="space-y-3">
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => {
            const active = groupKey(group) === activeCategoryKey;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => selectCategory(groupKey(group))}
                disabled={isPending}
                className={cn(
                  "overflow-hidden rounded-[22px] border text-start shadow-[0_8px_22px_rgba(115,18,38,0.05)] transition active:scale-[0.995]",
                  active ? "border-maroon bg-maroon text-white shadow-[0_14px_30px_rgba(115,18,38,0.16)]" : "border-maroon/10 bg-white"
                )}
              >
                <div className="grid grid-cols-[84px_minmax(0,1fr)] items-stretch">
                  <MediaTile
                    src={group.media?.public_url}
                    alt={group.label}
                    label={group.label}
                    className="h-full min-h-[84px] rounded-none"
                    fallbackTone={active ? "dark" : "warm"}
                  />
                  <div className="flex min-w-0 flex-col justify-between p-3">
                    <div>
                      <h3 className={cn("font-serif text-[1.05rem] leading-6", active ? "text-white" : "text-maroon")}>{group.label}</h3>
                      {group.description ? <p className={cn("mt-1 line-clamp-2 text-[12px] leading-5", active ? "text-white/74" : "text-maroon/58")}>{group.description}</p> : null}
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.16em]">
                      <span className={active ? "text-white/74" : "text-maroon/45"}>{countProducts(group)}</span>
                      {isAr ? <ChevronLeft className={cn("h-4 w-4", active ? "text-white" : "text-maroon/55")} /> : <ChevronRight className={cn("h-4 w-4", active ? "text-white" : "text-maroon/55")} />}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {activeGroup ? (
        <section ref={detailsRef} className="overflow-hidden rounded-[26px] border border-maroon/10 bg-white shadow-[0_12px_30px_rgba(115,18,38,0.06)]">
          <div className="grid gap-0 md:grid-cols-[1fr_180px]">
            <div className="p-4 sm:p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-maroon/42">{isAr ? "القسم" : "Category"}</p>
              <h3 className="mt-2 font-serif text-[1.8rem] leading-tight text-maroon sm:text-[2.2rem]">{activeGroup.label}</h3>
              {activeGroup.description ? <p className="mt-2 max-w-[38rem] text-sm leading-7 text-maroon/64">{activeGroup.description}</p> : null}
            </div>
            <div className="relative hidden min-h-full md:block">
              <MediaTile src={activeGroup.media?.public_url} alt={activeGroup.label} label={activeGroup.label} className="h-full rounded-none" fallbackTone="warm" priority />
            </div>
          </div>

          {categoryOffers.length ? (
            <div className="border-t border-maroon/8 px-3 py-4 sm:px-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-maroon/40">{isAr ? "عروض القسم" : "Category offers"}</p>
                  <h4 className="mt-1 font-serif text-[1.2rem] text-maroon">{isAr ? "عروض متاحة الآن" : "Available offers"}</h4>
                </div>
                <span className="text-sm text-maroon/52">{categoryOffers.length}</span>
              </div>
              <div className="grid gap-2.5 sm:gap-3">
                {categoryOffers.map((offer) => <OfferStrip key={offer.id} offer={offer} locale={locale} />)}
              </div>
            </div>
          ) : null}

          {visibleSubsections.length > 1 ? (
            <div className="border-t border-maroon/8 px-3 py-3 sm:px-4">
              <div className="-mx-1 overflow-x-auto px-1 no-scrollbar">
                <div className="flex min-w-max gap-2">
                  {visibleSubsections.map((section) => {
                    const active = sectionKey(section) === activeSectionKey;
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => selectSection(sectionKey(section))}
                        disabled={isPending}
                        className={cn(
                          "inline-flex min-h-[46px] items-center rounded-full border px-4 text-sm font-medium transition active:scale-[0.99]",
                          active ? "border-maroon bg-maroon text-white" : "border-maroon/10 bg-[#fff8f5] text-maroon/78"
                        )}
                      >
                        {section.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {activeSection ? (
            <div className="border-t border-maroon/8 px-3 py-4 sm:px-4 sm:py-5">
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-maroon/40">{isAr ? "القسم الفرعي" : "Section"}</p>
                  <h4 className="mt-1 font-serif text-[1.35rem] text-maroon">{activeSection.label}</h4>
                </div>
                <span className="text-sm text-maroon/52">{activeSection.products.length}</span>
              </div>

              {sectionOffers.length ? (
                <div className="mb-3 grid gap-2.5 sm:gap-3">
                  {sectionOffers.map((offer) => <OfferStrip key={offer.id} offer={offer} locale={locale} />)}
                </div>
              ) : null}

              <div className="grid gap-2.5 sm:gap-3">
                {activeSection.products.map((product) => (
                  <ProductCard key={product.id} product={product} locale={locale} compact />
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
