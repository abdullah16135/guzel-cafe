import Link from "next/link";
import { Locale } from "@/lib/types";

export function SiteFooter({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";

  return (
    <footer className="mx-auto mt-10 max-w-6xl px-4 pb-8 pt-2 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[26px] border border-maroon/10 bg-[linear-gradient(135deg,_rgba(108,17,42,.96)_0%,_rgba(135,31,59,.95)_46%,_rgba(88,16,36,.98)_100%)] px-6 py-6 text-center text-white shadow-[0_20px_46px_rgba(90,24,45,0.14)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/25" />
        <p className="font-serif text-lg tracking-[0.03em] text-[#fff5ef] sm:text-xl">© 2026 Güzel Café</p>
        <p className="mt-2 text-sm text-white/78 sm:text-base">
          {isAr ? "تصميم المنيو:" : "Menu by:"}{" "}
          <Link href="https://www.instagram.com/abdullah_na1em?igsh=MTNvNTlsanZoenpkMQ==" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#ffe4cf] underline-offset-4 transition hover:underline">
            Abdullah
          </Link>
        </p>
      </div>
    </footer>
  );
}
