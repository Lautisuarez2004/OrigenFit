# Origen Fit — Manual del proyecto

Este archivo documenta cómo está armado el proyecto para poder retomarlo aunque se pierda el historial del chat.

## Objetivo

Origen Fit es una tienda web autoadministrable de suplementos deportivos. La web pública muestra catálogo, categorías, promociones, combos, avisos superiores e Instagram. El panel de administración permite gestionar el contenido sin editar código.

## Arquitectura

- **Frontend:** HTML + CSS + JavaScript estático.
- **Hosting:** Netlify.
- **Código e historial:** GitHub.
- **Backend / datos:** Supabase.
- **Autenticación:** Supabase Auth.
- **Base de datos:** Supabase Postgres.
- **Imágenes:** Supabase Storage.
- **Seguridad:** Row Level Security (RLS) + función `public.is_admin()`.

## Repositorio

Repositorio principal:

`Lautisuarez2004/OrigenFit`

Ramas:

- `main`: versión estable / producción.
- `dev`: desarrollo y pruebas.

### Regla de trabajo

Nunca hacer cambios experimentales directamente en `main`.

Flujo recomendado:

1. Hacer cambios en `dev`.
2. Revisar el branch deploy de Netlify.
3. Si funciona, abrir Pull Request `dev -> main`.
4. Mergear únicamente cuando esté aprobado.
5. Netlify publica `main` en producción.

## Netlify

Producción:

`https://origenfit.netlify.app`

Desarrollo:

`https://dev--origenfit.netlify.app`

El proyecto está conectado al repositorio GitHub con Continuous Deployment.

Configuración esperada:

- Production branch: `main`
- Branch deploy: `dev`
- Base directory: vacío
- Build command: vacío
- Publish directory: `.`

El sitio no necesita proceso de build porque el frontend es estático.

## Archivos principales

### `index.html`

Tienda pública. Incluye:

- franja superior de avisos editables;
- header rojo tipo e-commerce;
- buscador;
- menú hamburguesa con categorías;
- portada / hero;
- carrusel de promociones;
- categorías;
- combos;
- productos;
- enlaces directos a WhatsApp;
- sección de Instagram;
- footer.

### `admin.html`

Panel privado del dueño.

Secciones actuales:

- Productos
- Combos
- Categorías
- Promociones
- Avisos superiores
- Seguridad

### `config.js`

Contiene la configuración pública necesaria para conectar el frontend con Supabase.

La publishable key de Supabase puede estar en frontend por diseño, siempre que RLS esté correctamente configurado.

**Nunca subir a GitHub:**

- `service_role` key;
- secret keys;
- contraseñas;
- tokens privados;
- claves de Mercado Pago / Stripe secretas.

### Archivos visuales

- `logo-principal.png`
- `logo-origenfit.jpg`
- `whatsapp-white.png`
- `instagram-card.jpg`

## Supabase

Proyecto Supabase usado actualmente por Origen Fit.

El frontend se conecta desde `config.js`.

### Tablas principales

#### `admin_users`

Lista los usuarios de Auth autorizados como administradores.

#### `products`

Campos principales:

- `id`
- `name`
- `brand`
- `category`
- `price`
- `promo_price`
- `stock`
- `description`
- `image_url`
- `featured`
- `visible`
- `sort_order`

#### `categories`

Campos principales:

- `id`
- `name`
- `image_url`
- `visible`
- `sort_order`

#### `promotions`

Campos principales:

- `id`
- `title`
- `subtitle`
- `badge`
- `sticker_text`
- `image_url`
- `link_url`
- `active`
- `sort_order`

#### `top_messages`

Franja negra superior de la tienda.

Campos principales:

- `id`
- `text`
- `text_color`
- `sort_order`
- `active`

#### `combos`

Campos principales:

- `id`
- `name`
- `price`
- `promo_price`
- `stock`
- `description`
- `image_url`
- `visible`
- `sort_order`

## Storage

Buckets usados / previstos por la interfaz:

- `product-images`
- `promo-images`
- `category-images`
- `combo-images`

Las imágenes públicas se leen desde la tienda. Las operaciones de escritura deben estar restringidas a administradores mediante RLS / policies.

## Administración y seguridad

El login del administrador usa Supabase Auth.

Después de autenticar, la aplicación comprueba que el usuario exista en `public.admin_users`.

Las tablas de administración deben usar RLS.

Esquema esperado:

- público: solo lectura de contenido visible/activo;
- administrador autenticado: lectura completa + insert + update + delete según corresponda.

No confiar en ocultar botones del frontend como mecanismo de seguridad. La seguridad real debe estar en Supabase RLS.

## Productos y WhatsApp

Cada producto puede abrir WhatsApp directamente con un mensaje prearmado que incluye el nombre del producto y, cuando corresponde, el precio.

WhatsApp comercial actual:

`+54 221 618 7020`

Instagram actual:

`@origenfit.lp`

## Promociones

El carrusel de promociones es editable desde Admin.

Cada promoción puede tener:

- título;
- subtítulo;
- badge;
- sticker editable (por ejemplo `10% OFF`);
- imagen;
- link;
- orden;
- activa / inactiva.

Para banners panorámicos, usar idealmente una proporción similar a **1920 x 500 px**.

## Categorías

Las categorías se gestionan desde Admin y aparecen tanto en la sección visual de la tienda como en el menú hamburguesa.

El nombre de categoría usado en un producto debe coincidir con el nombre de la categoría para que los filtros funcionen correctamente.

## Combos

La sección COMBOS aparece únicamente si existe al menos un combo visible.

Cada combo puede incluir:

- nombre;
- foto;
- precio;
- precio promocional;
- stock;
- descripción;
- orden;
- visible / oculto;
- consulta directa por WhatsApp.

## SQL / migraciones

Los archivos SQL se usan para crear o actualizar tablas, policies, buckets y funciones de Supabase.

Antes de ejecutar una migración nueva:

1. Confirmar que corresponde al mismo proyecto Supabase.
2. Leer el SQL completo.
3. No borrar tablas existentes salvo que sea intencional.
4. Ejecutar una sola vez si usa `create table if not exists`, `add column if not exists`, etc.
5. Verificar que Supabase devuelva éxito.

El proyecto actual incluye `upgrade_v21.sql` para la funcionalidad de Combos.

## Futuro: plantilla comercial

Origen Fit debe mantenerse como proyecto real del cliente.

La idea es crear en otro repositorio una plantilla independiente, por ejemplo:

`Tienda-Base`

Esa plantilla debe eliminar datos específicos de Origen Fit y dejar configurables:

- nombre del negocio;
- logo;
- colores;
- WhatsApp;
- Instagram;
- textos de portada;
- envío gratis;
- secciones visibles;
- productos;
- categorías;
- promociones;
- combos.

Cada cliente debería tener, al menos inicialmente, su propio:

- repositorio GitHub;
- proyecto Netlify;
- proyecto Supabase.

Esto mantiene los datos aislados y hace más simple entregar o migrar un cliente.

## Reglas para futuras modificaciones

1. Trabajar primero en `dev`.
2. No tocar `main` hasta aprobar el cambio.
3. Probar tienda pública y `/admin.html`.
4. Si hay cambios de base de datos, guardar también el SQL en GitHub.
5. No guardar secretos en el repositorio.
6. Documentar cambios estructurales importantes en este `PROJECT.md`.
7. Mantener `main` siempre desplegable y funcional.

## Checklist antes de pasar a producción

- La tienda carga productos.
- Categorías funcionan.
- Buscador funciona.
- Menú hamburguesa funciona.
- Promociones cargan correctamente.
- Combos cargan correctamente.
- WhatsApp abre con el número correcto.
- Admin inicia sesión.
- Crear / editar / eliminar funciona en las secciones modificadas.
- Imágenes se ven bien en desktop y mobile.
- No hay errores visibles de Supabase.
- Se revisó el branch `dev` antes del merge.

---

Última actualización del manual: agosto de 2026.
