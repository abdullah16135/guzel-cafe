export function StatCard({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-[28px] border border-maroon/10 bg-white/90 p-5 shadow-soft">
      <p className="text-sm font-medium text-maroon/60">{label}</p>
      <p className="mt-3 font-serif text-4xl text-maroon">{value ?? 0}</p>
    </div>
  );
}
