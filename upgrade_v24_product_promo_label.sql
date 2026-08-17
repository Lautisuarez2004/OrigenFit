-- Origen Fit v24 · texto opcional para acompañar el precio promocional
alter table public.products
add column if not exists promo_label text not null default '';

comment on column public.products.promo_label is
  'Texto opcional que acompaña el precio promocional, por ejemplo Efectivo / transferencia.';
