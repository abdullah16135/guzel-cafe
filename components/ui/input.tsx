import * as React from "react";
import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("h-11 w-full rounded-2xl border border-maroon/10 bg-white/80 px-4 text-sm outline-none ring-0 placeholder:text-maroon/35 focus:border-maroon/30", props.className)} />;
}
