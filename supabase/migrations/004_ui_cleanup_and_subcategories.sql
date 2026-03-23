alter table if exists public.categories
  add column if not exists parent_id uuid references public.categories(id) on delete cascade;

alter table if exists public.settings
  add column if not exists offers_empty_behavior text not null default 'message',
  add column if not exists home_primary_section text not null default 'menu';

alter table if exists public.settings
  alter column whatsapp drop not null;

update public.settings
set whatsapp = null
where true;
