"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { Locale, MenuMainCategoryGroup, Offer } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { MediaTile } from "@/components/media-tile";
import { cn, formatCurrency } from "@/lib/utils";
import { pickLocaleText } from "@/lib/i18n";

const preloadedImageUrls = new Set<string>();

function preloadImage(src?: string | null) {
  if (!src) return;
  if (preloadedImageUrls.has(src)) return;

  preloadedImageUrls.add(src);

  const img = new Image();
  img.src = src;
}

function preloadImages(urls: Array<string | null | undefined>) {
  urls.forEach((url) => preloadImage(url));
}

function groupKey(group?: MenuMainCategoryGroup | null) {
  return group?.slug || group?.id || "";
}

function sectionKey(section?: { id: string; slug?: string } | null) {
  return section?.slug || section?.id || "";
}

function OfferStrip({
  offer,
  locale,
  priority = false,
}: {
  offer: Offer;
  locale: Locale;
  priority?: boolean;
}) {
  const isAr = locale === "ar";
  const name = pickLocaleText(locale, offer.name_ar, offer.name_en);
  const description = pickLocaleText(locale, offer.description_ar, offer.description_en);
  const badge = pickLocaleText(locale, offer.badge_ar, offer.badge_en) || (isAr ? "عرض" : "Offer");

  return (
    <Link
      href={`/offers/${offer.slug}`}
      className="block overflow-hidden rounded-[22px] border border-maroon/10 bg-[#fff8f5] shadow-[0_8px_22px_rgba(115,18,38,0.05)] active:scale-[0.995]"
    >
      <article className="grid grid-cols-[94px_minmax(0,1fr)] gap-0 sm:grid-cols-[118px_minmax(0,1fr)]">
        <MediaTile
          src={offer.media?.public_url}
          alt={name}
          label={name}
          className="h-full min-h-[102px] rounded-none"
          fallbackTone="warm"
          priority={priority}
        />
        <div className="flex min-w-0 flex-col justify-between p-3.5">
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 flex-1 font-serif text-[1rem] leading-6 text-maroon">{name}</h3>
              <span className="inline-flex shrink-0 rounded-full bg-maroon px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                {badge}
              </span>
            </div>
            {description ? <p className="line-clamp-2 text-[13px] leading-5 text-maroon/66">{description}</p> : null}
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-maroon/70">
              <Tag className="h-4 w-4" />
              <span className="text-sm font-semibold">{formatCurrency(offer.offer_price)}</span>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-maroon/55">
              {isAr ? "التفاصيل" : "Details"}
            </span>
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
  groups: MenuMainCategoryGroup[];
  offers: Offer[];
  locale: Locale;
  selectedCategory?: string;
  selectedSection?: string;
}) {
  const isAr = locale === "ar";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollToDetailsRef = useRef(false);
  const [isPending, startTransition] = useTransition();

  const [activeCategoryKey, setActiveCategoryKey] = useState<string>(() => {
    const selected = groups.find((group) => groupKey(group) === selectedCategory);
    return selected ? groupKey(selected) : groupKey(groups[0]);
  });

  useEffect(() => {
    const selected = groups.find((group) => groupKey(group) === selectedCategory);
    setActiveCategoryKey(selected ? groupKey(selected) : groupKey(groups[0]));
  }, [groups, selectedCategory]);

  const activeGroup = useMemo(
    () => groups.find((group) => groupKey(group) === activeCategoryKey) ?? groups[0] ?? null,
    [groups, activeCategoryKey]
  );

  const [activeSectionKey, setActiveSectionKey] = useState<string | null>(() => {
    const initialGroup = groups.find((group) => groupKey(group) === activeCategoryKey) ?? groups[0] ?? null;
    if (!initialGroup) return null;
    const selected = initialGroup.subcategories.find((section) => sectionKey(section) === selectedSection);
    return selected ? sectionKey(selected) : sectionKey(initialGroup.subcategories[0]);
  });

  useEffect(() => {
    if (!activeGroup) return;
    const selected = activeGroup.subcategories.find((section) => sectionKey(section) === selectedSection);
    setActiveSectionKey(selected ? sectionKey(selected) : sectionKey(activeGroup.subcategories[0]));
  }, [activeGroup, selectedSection]);

  const activeSection = useMemo(
    () =>
      activeGroup?.subcategories.find((section) => sectionKey(section) === activeSectionKey) ??
      activeGroup?.subcategories[0] ??
      null,
    [activeGroup, activeSectionKey]
  );

  const activeSectionIndex = useMemo(() => {
    if (!activeGroup || !activeSection) return -1;
    return activeGroup.subcategories.findIndex((section) => section.id === activeSection.id);
  }, [activeGroup, activeSection]);

  const nextSection = useMemo(() => {
    if (!activeGroup || activeSectionIndex < 0) return null;
    return activeGroup.subcategories[activeSectionIndex + 1] ?? null;
  }, [activeGroup, activeSectionIndex]);

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

  function warmGroup(group: MenuMainCategoryGroup | null | undefined) {
    if (!group) return;

    const firstSections = group.subcategories.slice(0, 2);
    const currentProducts = firstSections.flatMap((section) => section.products.slice(0, 6));
    const currentSectionOffers = offers.filter((offer) =>
      firstSections.some((section) => (offer.section_ids ?? []).includes(section.id))
    );

    preloadImages([
      group.media?.public_url,
      ...group.subcategories.slice(0, 4).map((section) => section.media?.public_url),
      ...currentProducts.map((product) => product.media?.public_url),
      ...currentSectionOffers.slice(0, 4).map((offer) => offer.media?.public_url),
    ]);
  }

  function warmSection(section: (typeof activeGroup extends null ? never : NonNullable<typeof activeGroup>["subcategories"][number]) | null | undefined) {
    if (!section) return;

    const sectionRelatedOffers = offers.filter((offer) => (offer.section_ids ?? []).includes(section.id));

    preloadImages([
      section.media?.public_url,
      ...section.products.slice(0, 8).map((product) => product.media?.public_url),
      ...sectionRelatedOffers.slice(0, 4).map((offer) => offer.media?.public_url),
    ]);
  }

  function selectCategory(nextCategory: string) {
    if (!activeGroup) return;
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
    const nextSection = nextGroup?.subcategories[0] ? sectionKey(nextGroup.subcategories[0]) : null;
    setActiveSectionKey(nextSection);
    updateQuery(nextCategory, nextSection);
  }

  function selectSection(nextSectionKeyValue: string) {
    if (!activeGroup || nextSectionKeyValue === activeSectionKey) return;
    setActiveSectionKey(nextSectionKeyValue);
    updateQuery(groupKey(activeGroup), nextSectionKeyValue);
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

  useEffect(() => {
    if (!groups.length) return;

    preloadImages(groups.slice(0, 4).map((group) => group.media?.public_url));
    warmGroup(groups[0]);
  }, [groups]);

  useEffect(() => {
    if (!activeGroup) return;

    const groupLevelOffers = offers.filter(
      (offer) => (offer.category_ids ?? []).includes(activeGroup.id) && !(offer.section_ids ?? []).length
    );

    preloadImages([
      activeGroup.media?.public_url,
      ...activeGroup.subcategories.slice(0, 5).map((section) => section.media?.public_url),
      ...groupLevelOffers.slice(0, 4).map((offer) => offer.media?.public_url),
    ]);

    warmSection(activeSection);
    warmSection(nextSection);
  }, [activeGroup, activeSection, nextSection, offers]);

  if (!groups.length) return null;

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="space-y-3">
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, index) => {
            const active = groupKey(group) === activeCategoryKey;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => selectCategory(groupKey(group))}
                onMouseEnter={() => warmGroup(group)}
                onTouchStart={() => warmGroup(group)}
                onFocus={() => warmGroup(group)}
                disabled={isPending}
                className={cn(
                  "overflow-hidden rounded-[22px] border text-start shadow-[0_8px_22px_rgba(115,18,38,0.05)] transition active:scale-[0.995]",
                  active
                    ? "border-maroon bg-maroon text-white shadow-[0_14px_30px_rgba(115,18,38,0.16)]"
                    : "border-maroon/10 bg-white"
                )}
              >
                <div className="grid grid-cols-[84px_minmax(0,1fr)] items-stretch">
                  <MediaTile
                    src={group.media?.public_url}
                    alt={group.label}
                    label={group.label}
                    className="h-full min-h-[84px] rounded-none"
                    fallbackTone={active ? "dark" : "warm"}
                    priority={index < 3}
                  />
                  <div className="flex min-w-0 flex-col justify-between p-3">
                    <div>
                      <h3 className={cn("font-serif text-[1.05rem] leading-6", active ? "text-white" : "text-maroon")}>
                        {group.label}
                      </h3>
                      {group.description ? (
                        <p className={cn("mt-1 line-clamp-2 text-[12px] leading-5", active ? "text-white/74" : "text-maroon/58")}>
                          {group.description}
                        </p>
                      ) : null}
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.16em]">
                      <span className={active ? "text-white/74" : "text-maroon/45"}>{group.products_count}</span>
                      {isAr ? (
                        <ChevronLeft className={cn("h-4 w-4", active ? "text-white" : "text-maroon/55")} />
                      ) : (
                        <ChevronRight className={cn("h-4 w-4", active ? "text-white" : "text-maroon/55")} />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {activeGroup ? (
        <section className="overflow-hidden rounded-[26px] border border-maroon/10 bg-white shadow-[0_12px_30px_rgba(115,18,38,0.06)]" ref={detailsRef}>
          <div className="grid gap-0 md:grid-cols-[1fr_220px]">
            <div className="p-4 sm:p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-maroon/42">
                {isAr ? "القسم الرئيسي" : "Main category"}
              </p>
              <h3 className="mt-2 font-serif text-[1.8rem] leading-tight text-maroon sm:text-[2.2rem]">
                {activeGroup.label}
              </h3>
              {activeGroup.description ? (
                <p className="mt-2 max-w-[38rem] text-sm leading-7 text-maroon/64">{activeGroup.description}</p>
              ) : null}
            </div>
            <div className="relative hidden min-h-full md:block">
              <MediaTile
                src={activeGroup.media?.public_url}
                alt={activeGroup.label}
                label={activeGroup.label}
                className="h-full rounded-none"
                fallbackTone="warm"
                priority
              />
            </div>
          </div>

          {categoryOffers.length ? (
            <div className="border-t border-maroon/8 px-3 py-4 sm:px-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-maroon/40">
                    {isAr ? "عروض القسم" : "Category offers"}
                  </p>
                  <h4 className="mt-1 font-serif text-[1.2rem] text-maroon">
                    {isAr ? "عروض متاحة الآن" : "Available offers"}
                  </h4>
                </div>
                <span className="text-sm text-maroon/52">{categoryOffers.length}</span>
              </div>
              <div className="grid gap-2.5 sm:gap-3">
                {categoryOffers.map((offer, index) => (
                  <OfferStrip key={offer.id} offer={offer} locale={locale} priority={index < 2} />
                ))}
              </div>
            </div>
          ) : null}

          {activeGroup.subcategories.length > 1 ? (
            <div className="border-t border-maroon/8 px-3 py-3 sm:px-4">
              <div className="-mx-1 overflow-x-auto px-1 no-scrollbar">
                <div className="flex min-w-max gap-2">
                  {activeGroup.subcategories.map((section) => {
                    const active = sectionKey(section) === activeSectionKey;
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => selectSection(sectionKey(section))}
                        onMouseEnter={() => warmSection(section)}
                        onTouchStart={() => warmSection(section)}
                        onFocus={() => warmSection(section)}
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
                  <p className="text-[11px] uppercase tracking-[0.24em] text-maroon/40">
                    {isAr ? "القسم الفرعي" : "Subcategory"}
                  </p>
                  <h4 className="mt-1 font-serif text-[1.35rem] text-maroon">{activeSection.label}</h4>
                  {activeSection.description ? (
                    <p className="mt-1 text-sm leading-6 text-maroon/58">{activeSection.description}</p>
                  ) : null}
                </div>
                <span className="text-sm text-maroon/52">{activeSection.products.length}</span>
              </div>

              {sectionOffers.length ? (
                <div className="mb-3 grid gap-2.5 sm:gap-3">
                  {sectionOffers.map((offer, index) => (
                    <OfferStrip key={offer.id} offer={offer} locale={locale} priority={index < 2} />
                  ))}
                </div>
              ) : null}

              <div className="grid gap-2.5 sm:gap-3">
              {activeSection.products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                  compact
                  priority={index < 3}
                />
              ))}
            </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}