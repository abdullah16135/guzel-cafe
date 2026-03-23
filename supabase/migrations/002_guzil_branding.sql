alter table public.settings add column if not exists admin_email text;
alter table public.settings add column if not exists logo_media_id uuid references public.media(id) on delete set null;
alter table public.settings alter column description_ar drop not null;
alter table public.settings alter column description_en drop not null;

update public.settings
set cafe_name_ar = 'Güzil',
    cafe_name_en = 'Güzil',
    description_ar = null,
    description_en = null,
    phone = coalesce(phone, '01090944093'),
    whatsapp = coalesce(whatsapp, 'https://wa.me/201090944093'),
    instagram = 'https://www.instagram.com/guzel.cafe.eg?igsh=cnRwYWZ0MzJqM2lk',
    tiktok = 'https://www.tiktok.com/@guzel.cafe1.eg?_r=1&_t=ZS-94rVLORzkiV',
    admin_email = 'Güzil.eg@gmail.com'
where id = '11111111-1111-1111-1111-111111111111';

update public.products set description_ar = null, description_en = null;
