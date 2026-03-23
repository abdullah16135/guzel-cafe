create extension if not exists "pgcrypto";

alter table if exists public.products
  add column if not exists main_category_id uuid,
  add column if not exists subcategory_id uuid,
  add column if not exists sort_order int not null default 100,
  add column if not exists is_available boolean not null default true;

create index if not exists categories_parent_sort_idx on public.categories(parent_id, sort_order, created_at);
create index if not exists categories_visible_parent_idx on public.categories(is_visible, parent_id, sort_order);
create index if not exists products_main_sub_sort_idx on public.products(main_category_id, subcategory_id, sort_order, created_at);
create index if not exists products_visible_available_idx on public.products(is_visible, is_available, main_category_id, subcategory_id);

with root_categories as (
  select id, slug, name_ar, name_en
  from public.categories
  where parent_id is null
), default_subcategories as (
  insert into public.categories (
    slug,
    parent_id,
    name_ar,
    name_en,
    description_ar,
    description_en,
    sort_order,
    is_visible,
    is_featured
  )
  select
    rc.slug || '-items',
    rc.id,
    'كل ' || rc.name_ar,
    'All ' || rc.name_en,
    'قسم فرعي تلقائي للحفاظ على تنظيم المنتجات الحالية تحت ' || rc.name_ar,
    'Auto-created subcategory to keep existing items organized under ' || rc.name_en,
    1,
    true,
    false
  from root_categories rc
  where not exists (
    select 1
    from public.categories c
    where c.parent_id = rc.id
  )
  on conflict (slug) do nothing
  returning id
)
select count(*) from default_subcategories;

with category_links as (
  select
    p.id as product_id,
    case
      when c.parent_id is null then c.id
      else c.parent_id
    end as resolved_main_category_id,
    case
      when c.parent_id is null then (
        select dc.id
        from public.categories dc
        where dc.parent_id = c.id
        order by dc.sort_order asc, dc.created_at asc
        limit 1
      )
      else c.id
    end as resolved_subcategory_id,
    row_number() over (
      partition by case when c.parent_id is null then c.id else c.parent_id end,
                   case when c.parent_id is null then (
                     select dc.id
                     from public.categories dc
                     where dc.parent_id = c.id
                     order by dc.sort_order asc, dc.created_at asc
                     limit 1
                   ) else c.id end
      order by p.created_at asc, p.id asc
    ) as resolved_sort_order
  from public.products p
  join public.categories c on c.id = p.category_id
)
update public.products p
set
  main_category_id = cl.resolved_main_category_id,
  subcategory_id = cl.resolved_subcategory_id,
  category_id = cl.resolved_subcategory_id,
  sort_order = coalesce(nullif(p.sort_order, 100), cl.resolved_sort_order)
from category_links cl
where cl.product_id = p.id;

alter table if exists public.products
  alter column main_category_id set not null,
  alter column subcategory_id set not null;

alter table if exists public.products
  drop constraint if exists products_main_category_id_fkey,
  drop constraint if exists products_subcategory_id_fkey;

alter table if exists public.products
  add constraint products_main_category_id_fkey
    foreign key (main_category_id) references public.categories(id) on delete restrict,
  add constraint products_subcategory_id_fkey
    foreign key (subcategory_id) references public.categories(id) on delete restrict;

create or replace function public.sync_product_menu_hierarchy()
returns trigger
language plpgsql
as $$
declare
  resolved_parent uuid;
begin
  if new.subcategory_id is not null then
    select parent_id into resolved_parent
    from public.categories
    where id = new.subcategory_id;

    new.main_category_id := coalesce(new.main_category_id, resolved_parent, new.subcategory_id);
    new.category_id := new.subcategory_id;
  elsif new.category_id is not null then
    new.subcategory_id := new.category_id;

    select parent_id into resolved_parent
    from public.categories
    where id = new.category_id;

    new.main_category_id := coalesce(new.main_category_id, resolved_parent, new.category_id);
  end if;

  return new;
end;
$$;

drop trigger if exists trg_sync_product_menu_hierarchy on public.products;
create trigger trg_sync_product_menu_hierarchy
before insert or update on public.products
for each row
execute function public.sync_product_menu_hierarchy();

create or replace function public.validate_category_hierarchy()
returns trigger
language plpgsql
as $$
declare
  parent_parent_id uuid;
begin
  if new.parent_id is null then
    return new;
  end if;

  if new.parent_id = new.id then
    raise exception 'A category cannot be its own parent';
  end if;

  select parent_id into parent_parent_id
  from public.categories
  where id = new.parent_id;

  if parent_parent_id is not null then
    raise exception 'Only two menu levels are allowed: main category and subcategory';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_validate_category_hierarchy on public.categories;
create trigger trg_validate_category_hierarchy
before insert or update on public.categories
for each row
execute function public.validate_category_hierarchy();
