-- ORIGEN FIT V21 — COMBOS
-- Ejecutar UNA VEZ en el mismo proyecto de Supabase.

create extension if not exists pgcrypto;

create table if not exists public.combos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(12,2),
  promo_price numeric(12,2),
  stock integer not null default 0 check (stock >= 0),
  description text not null default '',
  image_url text,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists combos_public_order_idx
on public.combos (visible, sort_order, created_at);

alter table public.combos enable row level security;

drop policy if exists public_read_visible_combos on public.combos;
drop policy if exists admins_read_all_combos on public.combos;
drop policy if exists admins_insert_combos on public.combos;
drop policy if exists admins_update_combos on public.combos;
drop policy if exists admins_delete_combos on public.combos;

create policy public_read_visible_combos
on public.combos
for select
to anon, authenticated
using (visible = true);

create policy admins_read_all_combos
on public.combos
for select
to authenticated
using ((select public.is_admin()));

create policy admins_insert_combos
on public.combos
for insert
to authenticated
with check ((select public.is_admin()));

create policy admins_update_combos
on public.combos
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy admins_delete_combos
on public.combos
for delete
to authenticated
using ((select public.is_admin()));

grant select on public.combos to anon;
grant select,insert,update,delete on public.combos to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'combo-images',
  'combo-images',
  true,
  8388608,
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admins_upload_combo_images" on storage.objects;
drop policy if exists "admins_update_combo_images" on storage.objects;
drop policy if exists "admins_delete_combo_images" on storage.objects;

create policy "admins_upload_combo_images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'combo-images'
  and (select public.is_admin())
);

create policy "admins_update_combo_images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'combo-images'
  and (select public.is_admin())
)
with check (
  bucket_id = 'combo-images'
  and (select public.is_admin())
);

create policy "admins_delete_combo_images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'combo-images'
  and (select public.is_admin())
);