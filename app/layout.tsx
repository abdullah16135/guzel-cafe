import type { Metadata } from "next";
import "./globals.css";
import { resolveLocale } from "@/lib/locale";
import { AppProvider } from "@/components/providers/app-provider";
import { FloatingDecor } from "@/components/effects/floating-decor";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Güzel",
  description: "Luxury Turkish café menu",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await resolveLocale();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning data-scroll-behavior="auto">
      <body>
        <AppProvider>
          <FloatingDecor />
          {children}
          <SiteFooter locale={locale} />
        </AppProvider>
      </body>
    </html>
  );
}
