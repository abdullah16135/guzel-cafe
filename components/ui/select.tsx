"use client";

import * as React from "react";

export function Select({ value, onChange, options, className }: { value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; className?: string; }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={className ?? "h-11 w-full rounded-2xl border border-maroon/10 bg-white/80 px-4 text-sm outline-none focus:border-maroon/30"}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
