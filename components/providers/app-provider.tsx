"use client";

import { Toaster } from "sonner";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster richColors position="top-center" closeButton toastOptions={{ className: "!font-sans" }} />
    </>
  );
}
