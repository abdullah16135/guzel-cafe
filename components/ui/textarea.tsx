import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("min-h-28 w-full rounded-2xl border border-maroon/10 bg-white/80 px-4 py-3 text-sm outline-none placeholder:text-maroon/35 focus:border-maroon/30", props.className)} />;
}
