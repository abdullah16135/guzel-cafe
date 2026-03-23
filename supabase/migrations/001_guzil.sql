create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  path text not null unique,
  public_url text,
  alt_ar text,
  alt_en text,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  sort_order int not null default 1,
  is_visible boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  media_id uuid references public.media(id) on delete set null,
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  description_ar text,
  description_en text,
  is_visible boolean not null default true,
  is_featured boolean not null default false,
  is_new boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label_ar text not null,
  label_en text not null,
  price numeric(10,2) not null,
  sort_order int not null default 1,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  cafe_name_ar text not null,
  cafe_name_en text not null,
  description_ar text,
  description_en text,
  location_text_ar text not null,
  location_text_en text not null,
  google_maps_link text not null,
  coordinates text,
  phone text,
  whatsapp text,
  instagram text,
  tiktok text,
  admin_email text,
  logo_media_id uuid references public.media(id) on delete set null,
  hero_media_id uuid references public.media(id) on delete set null,
  banner_media_id uuid references public.media(id) on delete set null,
  default_language text not null default 'ar' check (default_language in ('ar','en')),
  show_language_switch boolean not null default true,
  force_single_language boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.media enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_sizes enable row level security;
alter table public.settings enable row level security;

drop policy if exists "public read visible categories" on public.categories;
drop policy if exists "public read visible products" on public.products;
drop policy if exists "public read sizes" on public.product_sizes;
drop policy if exists "public read settings" on public.settings;
drop policy if exists "public read media" on public.media;
drop policy if exists "admins manage users" on public.users;

create policy "public read visible categories" on public.categories for select using (is_visible = true);
create policy "public read visible products" on public.products for select using (is_visible = true);
create policy "public read sizes" on public.product_sizes for select using (true);
create policy "public read settings" on public.settings for select using (true);
create policy "public read media" on public.media for select using (true);
create policy "admins manage users" on public.users for all using (auth.uid() = id) with check (auth.uid() = id);

insert into public.settings (id, cafe_name_ar, cafe_name_en, description_ar, description_en, location_text_ar, location_text_en, google_maps_link, phone, whatsapp, instagram, tiktok, admin_email, default_language, show_language_switch, force_single_language)
values (
  '11111111-1111-1111-1111-111111111111',
  'Güzil',
  'Güzil',
  null,
  null,
  'مصر',
  'Egypt',
  'https://maps.google.com',
  '01090944093',
  'https://wa.me/201090944093',
  'https://www.instagram.com/guzel.cafe.eg?igsh=cnRwYWZ0MzJqM2lk',
  'https://www.tiktok.com/@guzel.cafe1.eg?_r=1&_t=ZS-94rVLORzkiV',
  'Guzil.eg@gmail.com',
  'ar',
  true,
  false
)
on conflict (id) do nothing;
