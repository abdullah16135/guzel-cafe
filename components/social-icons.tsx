import Link from "next/link";
import { Instagram } from "lucide-react";

function TiktokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.12v13.17a2.38 2.38 0 1 1-2.38-2.38c.19 0 .38.03.56.07V9.69a5.5 5.5 0 1 0 5.94 5.48V8.54a7.9 7.9 0 0 0 4.77 1.6V7.01c-.69 0-1.37-.11-2-.32Z" />
    </svg>
  );
}

export function SocialIcons({ instagram, tiktok }: { instagram?: string | null; tiktok?: string | null }) {
  const items = [
    instagram ? { href: instagram, icon: Instagram, label: "Instagram" } : null,
    tiktok ? { href: tiktok, icon: TiktokIcon, label: "TikTok" } : null,
  ].filter(Boolean) as { href: string; icon: React.ComponentType<any>; label: string }[];

  if (!items.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-maroon/10 bg-white/88 px-3 text-sm font-medium text-maroon shadow-soft transition hover:-translate-y-0.5 hover:bg-[#fff8f6] active:scale-[0.98]"
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
