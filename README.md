# Sistema de Barbería — Sitio Web con Reservas Online

Plataforma web modular para negocios de servicios (barbería, nutricionistas, terapeutas físicos, etc.). El contenido y la terminología se configuran desde un único archivo, sin tocar componentes.

## Tecnologías

- **Next.js 16** (App Router, TypeScript, output standalone)
- **Tailwind CSS v4**
- **Google Calendar API** — disponibilidad y creación de eventos por barbero
- **Nodemailer + Gmail SMTP** — email de confirmación al cliente
- **Docker** — imagen de producción y entorno de desarrollo

---

## Configuración inicial

### 1. Variables de entorno

Copia el archivo de ejemplo y rellena los valores:

```bash
cp .env.example .env.local
```

Contenido de `.env.local`:

```env
# Google Calendar — Service Account
# Genera el JSON en: console.cloud.google.com → IAM → Cuentas de servicio
# Luego ejecuta: node scripts/setup-env.mjs <ruta-al-json>
GOOGLE_SERVICE_ACCOUNT_EMAIL="bot@proyecto.iam.gserviceaccount.com"
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Gmail SMTP — contraseña de aplicación (requiere 2FA activado en Gmail)
# Genera en: myaccount.google.com → Seguridad → Contraseñas de aplicación
GMAIL_USER="labarberia@gmail.com"
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
```

#### Generar `.env.local` desde el JSON de Google Cloud

Si ya descargaste el JSON del service account, el script lo hace automáticamente:

```bash
node scripts/setup-env.mjs barberiatest-501123-2835ada448a0.json
```

Esto extrae `client_email` y `private_key` del JSON y los escribe en `.env.local`.

---

### 2. Configurar el contenido del sitio

Todo el contenido vive en **`config/site.config.ts`**: nombre del negocio, servicios, barberos, horarios, redes sociales, colores, y fondos de sección.

Para convertir el sitio en otro rubro (ej. nutricionistas) solo se edita ese archivo — los componentes nunca tienen texto hardcodeado.

#### Agregar un barbero al sistema de reservas

En `config/site.config.ts`, cada barbero necesita el campo `googleCalendarId`:

```ts
providers: [
  {
    name: "Kevin Figueroa",
    googleCalendarId: "kevin@gmail.com",  // Gmail cuyo calendario se usa
    ...
  },
]
```

Luego ese barbero debe compartir su Google Calendar con el service account:

> Google Calendar → Configuración del calendario → Compartir con personas  
> → Agregar: `bot@proyecto.iam.gserviceaccount.com`  
> → Permiso: **"Realizar cambios en eventos"**

Los barberos sin `googleCalendarId` no aparecen en el wizard de reservas.

---

### 3. Imágenes

Coloca las imágenes en `public/images/`:

```
public/
├── images/
│   ├── backgrounds/
│   │   └── hero.webp          ← fondo del hero
│   └── providers/
│       ├── kevin-figueroa.webp
│       ├── leonardo-carcache.webp
│       └── barbero-3.webp
```

En el compose de producción estas imágenes se montan como volumen, por lo que puedes cambiarlas **sin reconstruir la imagen Docker**.

---

## Levantar con Docker

### Producción

```bash
docker compose up --build
```

Levanta la app en `http://localhost:3000`. Lee `.env.local` automáticamente.

Para correr en background:

```bash
docker compose up --build -d

# Ver logs
docker compose logs -f

# Detener
docker compose down
```

**Cambiar fotos sin rebuild:** edita los archivos en `public/images/` y reinicia el contenedor:

```bash
docker compose restart
```

### Desarrollo (hot reload)

```bash
docker compose -f docker-compose.dev.yml up
```

Monta el código fuente directamente en el contenedor. Cualquier cambio en archivos `.tsx`/`.ts`/`.css` se refleja en el navegador sin reiniciar.

---

## Levantar sin Docker

### Requisitos

- Node.js 20+ (instalar con `nvm install --lts`)

### Comandos

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

---

## Estructura del proyecto

```
├── app/
│   ├── api/
│   │   ├── availability/route.ts   # GET disponibilidad mensual por barbero
│   │   └── book/route.ts           # POST crear cita + enviar email
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── booking/                    # Wizard de reservas (7 pasos)
│   │   ├── BookingModal.tsx
│   │   ├── BookingWizard.tsx
│   │   └── steps/
│   ├── layout/                     # Navbar y Footer
│   ├── sections/                   # Hero, Servicios, Citas, Ubicación, Barberos, Contacto
│   └── ui/                         # Componentes reutilizables
├── config/
│   └── site.config.ts              # ← ÚNICO archivo a editar para personalizar el sitio
├── lib/
│   ├── google-calendar.ts          # Lógica de disponibilidad y creación de eventos
│   ├── mailer.ts                   # Email de confirmación vía Gmail SMTP
│   └── utils.ts
├── types/
│   ├── booking.ts                  # Tipos del wizard de reservas
│   └── site-config.ts              # Tipos de configuración del sitio
├── scripts/
│   └── setup-env.mjs               # Genera .env.local desde JSON de service account
├── public/images/                  # Imágenes (montadas como volumen en Docker)
├── Dockerfile
├── docker-compose.yml              # Producción
├── docker-compose.dev.yml          # Desarrollo
└── .env.example                    # Plantilla de variables de entorno
```

---

## Flujo del wizard de reservas

1. **Barbero** — elige con quién reservar (solo barberos con `googleCalendarId`)
2. **Servicio** — elige el servicio (solo los que tienen `durationMinutes`)
3. **Fecha** — calendario mensual con barra de ocupación por día (verde/amarillo/rojo)
4. **Hora** — slots disponibles calculados según duración del servicio y eventos del calendario
5. **Datos** — nombre, email, teléfono, comentarios
6. **Confirmación** — resumen antes de confirmar
7. **Éxito** — evento creado en Google Calendar + email enviado al cliente
