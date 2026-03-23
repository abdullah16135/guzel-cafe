export function SectionTitle({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-6 space-y-2">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">{eyebrow}</p> : null}
      <h2 className="font-serif text-3xl text-maroon sm:text-4xl">{title}</h2>
      {description ? <p className="max-w-2xl text-sm leading-7 text-maroon/70 sm:text-base">{description}</p> : null}
    </div>
  );
}
