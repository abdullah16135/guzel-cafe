insert into public.categories (slug, name_ar, name_en, sort_order, is_visible, is_featured)
values
('mocktail', 'موكتيل', 'Mocktail', 1, true, true),
('dessert', 'حلويات', 'Desserts', 2, true, true),
('hot-drink', 'مشروبات ساخنة', 'Hot Drink', 3, true, true),
('iced-drink', 'مشروبات باردة', 'Iced Drink', 4, true, true),
('specialty-coffee', 'قهوة مختصة', 'Specialty Coffee', 5, true, false),
('soft-drink', 'مشروبات غازية', 'Soft Drink', 6, true, false)
on conflict (slug) do nothing;

with c as (select id, slug from public.categories)
insert into public.products (category_id, slug, name_ar, name_en, description_ar, description_en, is_visible, is_featured, is_new)
values
((select id from c where slug='mocktail'), 'mojito', 'موهيتو', 'Mojito', null, null, true, true, true),
((select id from c where slug='mocktail'), 'mixed-berry-mojito', 'مكس بيري موهيتو', 'Mixed Berry Mojito', null, null, true, true, false),
((select id from c where slug='mocktail'), 'blue-lemon-citrus', 'بلو ليمون سيدروس', 'Blue Lemon Citrus', null, null, true, false, false),
((select id from c where slug='mocktail'), 'passion-lemon-soda', 'باشن ليمون صودا', 'Passion Lemon Soda', null, null, true, false, false),
((select id from c where slug='mocktail'), 'blue-strawberry', 'بلو ستروباري', 'Blue Strawberry', null, null, true, false, false),
((select id from c where slug='dessert'), 'waffle-sauce', 'وافل صوص', 'Waffle Sauce', null, null, true, true, true),
((select id from c where slug='dessert'), 'fruit-waffle', 'وافل فواكه', 'Fruit Waffle', null, null, true, true, false),
((select id from c where slug='dessert'), 'pancake', 'بان كيك', 'Pancake', null, null, true, false, false),
((select id from c where slug='dessert'), 'mini-pancake', 'ميني بان كيك', 'Mini Pancake', null, null, true, false, false),
((select id from c where slug='dessert'), 'fettuccine-crepe', 'فوتشيني كريب', 'Fettuccine Crepe', null, null, true, false, false),
((select id from c where slug='dessert'), 'special-fettuccine-crepe', 'فوتشيني كريب سبيشال', 'Special Fettuccine Crepe', null, null, true, true, true),
((select id from c where slug='hot-drink'), 'espresso', 'اسبريسو', 'Espresso', null, null, true, true, false),
((select id from c where slug='hot-drink'), 'macchiato', 'ميكاتو', 'Macchiato', null, null, true, false, false),
((select id from c where slug='hot-drink'), 'espresso-cortado', 'كورتادو اسبريسو', 'Espresso Cortado', null, null, true, false, false),
((select id from c where slug='hot-drink'), 'turkish-coffee', 'قهوة تركي', 'Turkish Coffee', null, null, true, true, true),
((select id from c where slug='hot-drink'), 'americano', 'امريكانو', 'Americano', null, null, true, false, false),
((select id from c where slug='hot-drink'), 'coffee-of-the-day', 'قهوة اليوم', 'Coffee of the Day', null, null, true, false, false),
((select id from c where slug='hot-drink'), 'hazelnut-coffee', 'قهوة بندق', 'Hazelnut Coffee', null, null, true, false, false),
((select id from c where slug='hot-drink'), 'french-coffee', 'قهوة فرنسي', 'French Coffee', null, null, true, false, false),
((select id from c where slug='hot-drink'), 'cortado', 'كورتادو', 'Cortado', null, null, true, false, false),
((select id from c where slug='hot-drink'), 'flat-white', 'فلات وايت', 'Flat White', null, null, true, false, false),
((select id from c where slug='hot-drink'), 'latte', 'لاتيه', 'Latte', null, null, true, true, false),
((select id from c where slug='hot-drink'), 'cappuccino', 'كابتشينو', 'Cappuccino', null, null, true, true, false),
((select id from c where slug='hot-drink'), 'spanish-latte', 'اسبانيش لاتيه', 'Spanish Latte', null, null, true, true, true),
((select id from c where slug='hot-drink'), 'mocha', 'موكا', 'Mocha', null, null, true, false, false),
((select id from c where slug='hot-drink'), 'white-mocha', 'وايت موكا', 'White Mocha', null, null, true, false, false),
((select id from c where slug='iced-drink'), 'iced-latte', 'ايس لاتيه', 'Iced Latte', null, null, true, true, false),
((select id from c where slug='iced-drink'), 'iced-mocha', 'ايس موكا', 'Iced Mocha', null, null, true, false, false),
((select id from c where slug='iced-drink'), 'iced-white-mocha', 'ايس وايت موكا', 'Iced White Mocha', null, null, true, false, false),
((select id from c where slug='iced-drink'), 'iced-spanish-latte', 'ايس اسبانيش لاتيه', 'Iced Spanish Latte', null, null, true, true, true),
((select id from c where slug='iced-drink'), 'iced-salted-caramel', 'ايس سولتد كراميل', 'Iced Salted Caramel', null, null, true, true, false),
((select id from c where slug='specialty-coffee'), 'chemex', 'كيمكس', 'Chemex', null, null, true, false, false),
((select id from c where slug='specialty-coffee'), 'fruity-chemex', 'فروتي كيمكس', 'Fruity Chemex', null, null, true, false, false),
((select id from c where slug='specialty-coffee'), 'v60', 'في 60', 'V60', null, null, true, true, false),
((select id from c where slug='specialty-coffee'), 'fruity-v60', 'فروتي في 60', 'Fruity V60', null, null, true, false, false),
((select id from c where slug='soft-drink'), 'pepsi', 'بيبسي', 'Pepsi', null, null, true, false, false),
((select id from c where slug='soft-drink'), '7up', 'سفن اب', '7Up', null, null, true, false, false),
((select id from c where slug='soft-drink'), 'mirinda', 'ميرندا', 'Mirinda', null, null, true, false, false),
((select id from c where slug='soft-drink'), 'small-water', 'مياه صغيرة', 'Small Water', null, null, true, false, false),
((select id from c where slug='soft-drink'), 'large-water', 'مياه كبيرة', 'Large Water', null, null, true, false, false)
on conflict (slug) do nothing;

insert into public.product_sizes (product_id, label_ar, label_en, price, sort_order, is_default)
select id, 'عادي', 'Regular', 55, 1, true from public.products where slug not in ('espresso','macchiato','espresso-cortado','turkish-coffee','americano','coffee-of-the-day','hazelnut-coffee','french-coffee','cortado','flat-white','latte','cappuccino','spanish-latte','mocha','white-mocha')
on conflict do nothing;

insert into public.product_sizes (product_id, label_ar, label_en, price, sort_order, is_default)
select id, 'D', 'D', 55, 1, true from public.products where slug in ('espresso','macchiato','espresso-cortado','turkish-coffee','americano','coffee-of-the-day','hazelnut-coffee','french-coffee','cortado','flat-white','latte','cappuccino','spanish-latte','mocha','white-mocha')
on conflict do nothing;

insert into public.product_sizes (product_id, label_ar, label_en, price, sort_order, is_default)
select id, 'S', 'S', 55, 2, false from public.products where slug in ('espresso','macchiato','espresso-cortado','turkish-coffee','americano','coffee-of-the-day','hazelnut-coffee','french-coffee','cortado','flat-white','latte','cappuccino','spanish-latte','mocha','white-mocha')
on conflict do nothing;
