alter table if exists public.categories
  add column if not exists description_ar text,
  add column if not exists description_en text,
  add column if not exists media_id uuid references public.media(id) on delete set null;

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  media_id uuid references public.media(id) on delete set null,
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  description_ar text,
  description_en text,
  original_price numeric(10,2),
  offer_price numeric(10,2) not null default 0,
  badge_ar text default 'عرض',
  badge_en text default 'Offer',
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.offer_items (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.offers(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  sort_order int not null default 1,
  created_at timestamptz not null default now()
);

alter table public.offers enable row level security;
alter table public.offer_items enable row level security;

drop policy if exists "public read visible offers" on public.offers;
drop policy if exists "public read offer items" on public.offer_items;

create policy "public read visible offers" on public.offers for select using (is_visible = true);
create policy "public read offer items" on public.offer_items for select using (true);

update public.settings
set admin_email = replace(replace(admin_email, 'Güzil', 'Guzil'), 'güzil', 'guzil')
where admin_email is not null;
