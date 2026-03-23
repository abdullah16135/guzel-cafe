"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import { Locale } from "@/lib/types";

const options: Array<{ value: Locale; short: string; label: string }> = [
  { value: "ar", short: "AR", label: "Arabic" },
  { value: "en", short: "EN", label: "English" },
];

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const [isPending, setIsPending] = useState(false);

  async function setLocale(locale: Locale) {
    if (locale === currentLocale || isPending) return;

    try {
      setIsPending(true);
      const response = await fetch("/api/preferences/locale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locale }),
        cache: "no-store",
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error("Failed to update locale");
      }

      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("_lang", String(Date.now()));
      window.location.replace(currentUrl.toString());
    } catch {
      document.cookie = `guzil-locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      window.location.reload();
    }
  }

  return (
    <div
      className="inline-flex w-full shrink-0 items-center justify-center gap-1 rounded-full border border-maroon/10 bg-white/95 p-1 shadow-soft backdrop-blur-sm sm:w-auto sm:justify-start"
      aria-label="Language switcher"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff7f4] text-maroon/70">
        <Languages className="h-4 w-4" />
      </span>
      {options.map((option) => {
        const active = option.value === currentLocale;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => void setLocale(option.value)}
            disabled={isPending}
            className={`inline-flex min-h-[42px] min-w-[68px] touch-manipulation items-center justify-center rounded-full px-3 text-[11px] font-semibold tracking-[0.14em] transition duration-200 sm:min-h-[40px] ${
              active ? "bg-maroon text-white shadow-[0_10px_24px_rgba(94,23,43,0.16)]" : "text-maroon/78 active:bg-[#fff1eb]"
            } ${isPending ? "opacity-80" : ""}`}
            aria-pressed={active}
            aria-label={option.label}
          >
            <span>{option.short}</span>
          </button>
        );
      })}
    </div>
  );
}
