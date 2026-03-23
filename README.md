# Güzil — Production-ready café system

## Stack
- Next.js App Router
- Supabase PostgreSQL
- Supabase Storage
- Supabase Auth
- Next.js Route Handlers

## What is included
- Public home, menu, product, contact pages
- Real Supabase-backed admin dashboard
- Categories CRUD with show/hide/delete/reorder
- Products CRUD with dynamic sizes/prices and NEW badge
- Settings manager with language controls
- Image upload to Supabase Storage
- SQL migration + seed extracted from uploaded menu files

## Setup
1. Create a Supabase project.
2. Create a public bucket named `guzil-media`.
3. Run `supabase/migrations/001_guzil.sql`.
4. Run `supabase/seed.sql`.
5. Create an admin user in Supabase Auth.
6. Insert the same auth user id into `public.users` with role `admin`.
7. Add env vars from `.env.example`.
8. Install deps and run the app.

## Important note
The uploaded menu files available in the session exposed the following real sections: Mocktail, Dessert, Hot Drink, Iced Drink, Specialty Coffee, Soft Drink. All visible prices in the uploaded pages were 55 EGP. Descriptions were not present in the menu, so bilingual editable descriptions were generated for dashboard editing.


## LAN / mobile testing
- The dev and production scripts are bound to `0.0.0.0`, so the app can be opened from other devices on the same network.
- Start the app, then open `http://YOUR_LOCAL_IP:3000` on your phone or another computer.
- Supabase public media loads remotely from your project domain, so product images remain accessible over LAN as long as the device has internet access.
