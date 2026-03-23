import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "outline" };

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-maroon/30 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-maroon text-white shadow-soft hover:-translate-y-0.5 hover:bg-rose",
        variant === "secondary" && "bg-gold text-maroon hover:-translate-y-0.5",
        variant === "outline" && "border border-maroon/20 bg-white/70 text-maroon hover:bg-white",
        className
      )}
      {...props}
    />
  );
}
