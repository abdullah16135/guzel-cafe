alter table if exists public.offers
  add column if not exists category_ids uuid[] not null default '{}',
  add column if not exists section_ids uuid[] not null default '{}';

create index if not exists offers_category_ids_gin_idx on public.offers using gin (category_ids);
create index if not exists offers_section_ids_gin_idx on public.offers using gin (section_ids);
