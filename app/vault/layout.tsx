export default function VaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <section lang="ar" dir="rtl" className="min-h-screen bg-[#fcf8f6] text-right">
      {children}
    </section>
  );
}
