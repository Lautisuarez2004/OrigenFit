-- Origen Fit v2.3: detalle de producto, galería y envío gratis
-- Ya aplicado en Supabase. Se conserva en el repo como migración documentada.

begin;

alter table public.products
  add column if not exists free_shipping boolean not null default false;

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  storage_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_order_idx
  on public.product_images (product_id, sort_order, created_at);

alter table public.product_images enable row level security;

drop policy if exists public_read_product_images on public.product_images;
drop policy if exists authenticated_read_product_images on public.product_images;
drop policy if exists admins_insert_product_images on public.product_images;
drop policy if exists admins_update_product_images on public.product_images;
drop policy if exists admins_delete_product_images on public.product_images;

create policy public_read_product_images
on public.product_images for select to anon
using (exists (
  select 1 from public.products p
  where p.id=product_images.product_id and p.visible=true
));

create policy authenticated_read_product_images
on public.product_images for select to authenticated
using (exists (
  select 1 from public.products p
  where p.id=product_images.product_id
    and (p.visible=true or (select public.is_admin()))
));

create policy admins_insert_product_images
on public.product_images for insert to authenticated
with check ((select public.is_admin()));

create policy admins_update_product_images
on public.product_images for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy admins_delete_product_images
on public.product_images for delete to authenticated
using ((select public.is_admin()));

grant select on public.product_images to anon;
grant select, insert, update, delete on public.product_images to authenticated;

commit;
