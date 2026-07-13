# ─── Etapa 1: dependencias ────────────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
# Toolchain de compilación: better-sqlite3 es un módulo nativo. Si no hay un
# binario prebuilt para linux-musl (Alpine), npm cae a compilar desde código
# fuente con node-gyp, que necesita esto.
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ─── Etapa 2: build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# El build lee variables de entorno en tiempo de compilación si son NEXT_PUBLIC_*.
# Las variables del servidor (Google, Gmail, DB) solo se leen en runtime, no aquí.
RUN npm run build
# Compila el script de migraciones/seed a un único .js plano (sin tsx/ts-node
# en la imagen final). better-sqlite3 queda externo: ya lo trae node_modules.
RUN npm run db:bundle-migrate

# ─── Etapa 3: runner (imagen final mínima) ────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Usuario sin privilegios de root. Reusamos el usuario "node" (uid/gid 1000)
# que la imagen base ya trae, en vez de crear uno nuevo: 1000 es el uid del
# primer usuario en casi cualquier host Linux de un solo usuario, y esto
# necesita coincidir con el dueño real del host para /app/data (ver abajo).

# Carpeta donde viven la DB SQLite y las fotos subidas desde /admin
# (uploads/providers/ — ver src/lib/provider-photo.ts), montada como volumen
# nombrado (ver docker-compose.yml). Se crea acá con el dueño correcto porque
# Docker inicializa un volumen nombrado vacío copiando el contenido/permisos
# que tenga esta misma ruta en la imagen; si no existiera, quedaría root:root
# y "node" no podría escribir ahí (SQLITE_CANTOPEN / EACCES).
RUN mkdir -p /app/data && chown node:node /app/data

# Archivos generados por `output: standalone`
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static   ./.next/static
# sharp es un módulo nativo (dlopen de un .so de libvips) y el trazador de
# dependencias de `output: standalone` no sigue esa carga dinámica, así que
# el .so nunca llega solo al bundle — hay que copiar el paquete completo a
# mano o el optimizador de imágenes de Next revienta en runtime.
COPY --from=builder --chown=node:node /app/node_modules/sharp ./node_modules/sharp
COPY --from=builder --chown=node:node /app/node_modules/@img  ./node_modules/@img
# Carpeta public (imágenes, svgs, etc. editados directo en el repo — ya no es
# destino de subidas de /admin, esas van a /app/data, ver arriba).
COPY --from=builder --chown=node:node /app/public          ./public
# Script de migraciones + los .sql que aplica (drizzle/), para correrlo antes
# de levantar el server en cada arranque del contenedor.
COPY --from=builder --chown=node:node /app/docker-dist/migrate.js ./migrate.js
COPY --from=builder --chown=node:node /app/drizzle         ./drizzle

USER node
EXPOSE 3000

CMD ["sh", "-c", "node migrate.js && node server.js"]
