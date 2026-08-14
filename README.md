# Origen Fit

Tienda web autoadministrable para Origen Fit.

## Estructura

- `index.html`: tienda pública.
- `admin.html`: panel de administración.
- `config.js`: conexión pública a Supabase.
- `upgrade_v21.sql`: actualización SQL para la sección Combos.
- Imágenes y logos utilizados por la interfaz.

## Stack

- Frontend estático HTML/CSS/JavaScript
- Supabase: base de datos, autenticación, RLS y Storage
- Netlify: hosting
- GitHub: control de versiones

> El `supabaseKey` utilizado en el frontend es la publishable key de Supabase. No subir claves `service_role` ni secretos privados.
