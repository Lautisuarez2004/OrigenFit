-- Origen Fit V22
-- Permite decidir por promoción si se muestran textos/stickers encima de la imagen.

alter table public.promotions
  add column if not exists show_overlay boolean not null default true;

comment on column public.promotions.show_overlay is
  'Si es true muestra badge, título, subtítulo, CTA y sticker sobre la imagen; si es false muestra solo la imagen.';
