alter table if exists public.settings
  add column if not exists offers_empty_behavior text default 'hide',
  add column if not exists home_primary_section text default 'menu';

update public.settings
set offers_empty_behavior = coalesce(offers_empty_behavior, 'hide'),
    home_primary_section = coalesce(home_primary_section, 'menu');
