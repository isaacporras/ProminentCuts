# ServiceProvider — plantilla de sitio con reservas online

Plantilla reutilizable para negocios de servicios (salón, barbería, nutricionista, etc.). Cada negocio es un branch propio + su propio repo en GitHub + su propia app en Coolify. Todos parten de `main`.

## Tecnologías

- **Next.js 16** (App Router, TypeScript, `output: standalone`)
- **SQLite + Drizzle ORM** — providers, servicios, galería, ubicaciones y configuración, editables desde `/admin`
- **Google Calendar API** — disponibilidad y creación de eventos por proveedor
- **Nodemailer + Gmail SMTP** — emails de confirmación/notificación
- **Docker + Coolify** — build y deploy en el VPS

---

## Guía 1: probar un cliente nuevo en local

1. **Repo del cliente.** Creá un repo privado nuevo en GitHub (ej. `NombreNegocio`). Todavía no le pongas nada.

2. **Branch desde `main`** (asegurate de que `main` esté actualizado primero):
   ```bash
   git checkout main && git pull
   git checkout -b nombre_negocio
   ```

3. **Contenido del sitio** — todo vive en `src/config/site.config.ts`: nombre, colores (`theme`), textos, navegación, horario, contacto, redes. Es el único archivo que hay que tocar para "convertir" el sitio.

4. **Imágenes** en `public/brand/` — el hero se auto-descubre por nombre de archivo, no hace falta tocar `site.config.ts`:
   - `backgrounds/hero.webp` — fondo del hero (desktop y, si no hay una versión móvil, también celular)
   - `backgrounds/hero-mobile.webp` — opcional. Si el hero es una foto panorámica con detalles importantes cerca de los bordes (no solo centrados), preparar un recorte propio ~4:3 para pantallas angostas — `object-cover` en un celular siempre pierde los costados de una imagen ancha, no hay ajuste de CSS que lo arregle. Sin este archivo, se usa `hero.webp` en todos los tamaños.
   - `logo.webp` — favicon/logo (opcional, cae a `public/favicon.ico` si no existe)
   - `gallery/*.webp` — semilla inicial de la galería (se importa una sola vez a la base de datos, después se administra desde `/admin/gallery`)

   Si en algún momento necesitás una ruta o nombre distinto a la convención, `sectionBackgrounds.hero.image`/`imageMobile` en `site.config.ts` siguen funcionando — un valor explícito ahí siempre gana sobre el auto-descubrimiento.

5. **`.env.local`** propio para probar en local (no se commitea):
   ```bash
   cp .env.example .env.local
   ```
   Rellenalo con las credenciales de Google/Gmail (podés usar las de prueba mientras armás el sitio, y las reales del cliente recién en producción — ver Guía 2).

6. **Probar:**
   ```bash
   npm install
   npm run db:migrate    # crea la DB local y siembra el admin inicial
   npm run dev
   ```
   Entrá a `/admin/login` con `ADMIN_INITIAL_USER`/`ADMIN_INITIAL_PASSWORD` (de tu `.env.local`) y cargá providers, servicios, ubicaciones, galería y horario desde ahí — no hace falta tocar código para eso.

7. **Commitear y pushear al repo del cliente:**
   ```bash
   git add -A
   git commit -m "Configurar sitio para <negocio>"
   git remote add nombre_negocio git@github.com:isaacporras/NombreNegocio.git
   git push nombre_negocio nombre_negocio:nombre_negocio
   ```
   > ⚠️ **Ojo con el nombre de la rama remota.** Si el repo ya tenía algo (poco probable en uno nuevo, pero pasó antes), corré `git remote show nombre_negocio` **antes** de pushear y fijate cuál es el "HEAD branch" real — pushear a la rama equivocada crea una rama nueva que Coolify nunca va a ver.

---

## Guía 2: desplegar en Coolify

1. **Nuevo recurso** en Coolify → Application → conectá el repo del cliente → elegí la rama (`nombre_negocio`).

2. **Build Pack — ajustá esto a mano, Coolify a veces detecta mal y usa Nixpacks:**
   - Build Pack: **Dockerfile**
   - Dockerfile Location: `docker/Dockerfile`
   - Base Directory: `/`
   - Docker Build Stage Target: `runner`

3. **Directory Mount (persistencia).** Sin esto, cada redeploy borra la base de datos y las fotos subidas desde `/admin`:
   - Source Path (en el VPS): algo como `/data/coolify/<negocio>/data`
   - Destination Path (en el contenedor): `/app/data`

   > ⚠️ **Permisos.** Docker crea esa carpeta del host como `root` si no existe. La app corre como usuario `node` (uid 1000) y truena con `SQLITE_CANTOPEN` si no coinciden. Después del primer deploy (o antes, si ya sabés el path), por SSH:
   > ```bash
   > chown -R 1000:1000 /data/coolify/<negocio>/data
   > ```
   > (Hay un fix para automatizar esto en `feature/entrypoint-auto-chown`, pendiente de mergear — preguntame si querés activarlo antes de este deploy.)

4. **Variables de entorno** — van en **"Production Environment Variables"**, NO en "Preview Deployments" (son dos secciones separadas en Coolify y es fácil poner las variables en la que no es):
   ```
   DATABASE_PATH=/app/data/app.db
   AUTH_SECRET=<openssl rand -base64 32>
   ADMIN_INITIAL_USER=admin
   ADMIN_INITIAL_PASSWORD=<algo temporal, se cambia luego desde /admin/account>
   GOOGLE_SERVICE_ACCOUNT_EMAIL=<el real del cliente>
   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=<el real del cliente>
   GMAIL_USER=<el real del cliente>
   GMAIL_APP_PASSWORD=<el real del cliente>
   ```
   `MAX_GALLERY_IMAGES` / `MAX_PROVIDERS` son opcionales (caen a 8 y 5 si no se setean).

5. **Deploy.** Las migraciones corren solas al arrancar el contenedor (`node migrate.js && node server.js`). Revisá los logs del deploy si algo falla.

6. **Verificar:**
   - El sitio carga y el favicon/logo son los correctos
   - `/admin/login` funciona con las credenciales iniciales → entrá y cambiá la contraseña
   - Si ya cargaste providers/servicios/galería en local (Guía 1, paso 6), esos datos **no viajan solos** — hay que recargarlos desde `/admin` en producción, o pedirme que los siembre directo en la base vía SSH si ya los tenías armados
   - Un proveedor con Google Calendar debe compartir su calendario con el service account (permiso "Realizar cambios en eventos") o no le van a aparecer horarios

7. **Dominio:** en la pestaña "Domains" de Coolify, poné el dominio final o usá el que Coolify asigna por defecto.

---

## Levantar con Docker (referencia rápida)

```bash
# Producción (imagen final, igual a lo que corre en el VPS)
docker compose -f docker/docker-compose.yml up --build

# Desarrollo (hot reload, monta el código fuente)
docker compose -f docker/docker-compose.dev.yml up
```

## Levantar sin Docker

```bash
npm install
npm run db:migrate
npm run dev      # desarrollo
npm run build && npm start   # producción
```

Requiere Node 20+.

---

## Estructura del proyecto

```
├── src/
│   ├── app/
│   │   ├── admin/                      # Panel de administración (/admin)
│   │   ├── api/
│   │   │   ├── availability/route.ts   # GET disponibilidad mensual por proveedor
│   │   │   ├── book/route.ts           # POST crear cita + emails
│   │   │   └── site-settings/route.ts  # Config pública (ej. formato de hora) para el wizard
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── booking/                    # Wizard de reservas
│   │   ├── layout/                     # Navbar y Footer
│   │   ├── sections/                   # Hero, Servicios, Citas, Ubicación, Equipo, Galería, Contacto
│   │   └── ui/
│   ├── config/
│   │   └── site.config.ts              # ← archivo principal a editar por negocio
│   ├── db/
│   │   ├── schema.ts                   # Tablas: providers, services, galleryImages, locations, settings, adminUsers
│   │   ├── migrate.ts                  # Corre migraciones + siembra admin inicial
│   │   └── seed-from-config.ts         # Importa una sola vez el contenido legacy de site.config.ts a la DB
│   ├── lib/
│   │   ├── google-calendar.ts          # Disponibilidad y creación de eventos
│   │   ├── mailer.ts                   # Emails vía Gmail SMTP
│   │   ├── auth.ts                     # Sesión de /admin
│   │   ├── rate-limit.ts               # Rate limiting en memoria (login, /api/book, /api/availability)
│   │   └── schedule.ts                 # Horarios y formato de hora (24h/12h)
│   └── types/
├── drizzle/                             # Migraciones SQL generadas
├── public/brand/                        # Imágenes propias del negocio
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── docker-compose.dev.yml
└── .env.example
```

---

## Flujo del wizard de reservas

1. **Proveedor** — solo aparecen los que tienen `googleCalendarId` cargado desde `/admin`
2. **Servicio** — solo los que tienen duración configurada
3. **Fecha** — calendario mensual con ocupación por día
4. **Hora** — slots calculados según duración del servicio, intervalo mínimo configurado y eventos ya existentes en el calendario
5. **Datos del cliente**
6. **Confirmación**
7. **Éxito** — evento creado en Google Calendar + emails enviados
