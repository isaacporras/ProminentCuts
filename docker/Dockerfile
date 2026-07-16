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
# El paso de type-checking de `next build` puede pedir más heap del que V8
# calcula solo en un host chico (visto: "Ineffective mark-compacts near heap
# limit" / OOM en un VPS de 4GB), aunque haya memoria+swap real disponible —
# se lo subimos a mano en vez de dejar que V8 se autolimite antes de tiempo.
ENV NODE_OPTIONS="--max-old-space-size=4096"
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
# que la imagen base ya trae, en vez de crear uno nuevo.
# su-exec: para bajar de root a "node" desde entrypoint.sh después de
# arreglar permisos (ver más abajo) — es el equivalente liviano de gosu.
RUN apk add --no-cache su-exec

# Carpeta donde viven la DB SQLite y las fotos subidas desde /admin
# (uploads/providers/ — ver src/lib/provider-photo.ts). Se crea acá también
# por si el mount queda vacío en el primer arranque, pero el dueño real se
# fija en cada arranque desde entrypoint.sh — ver ese archivo para el porqué.
RUN mkdir -p /app/data && chown node:node /app/data

COPY --chown=node:node docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

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

EXPOSE 3000

# Arranca como root a propósito — entrypoint.sh arregla el dueño de
# /app/data y recién ahí baja el proceso real a "node" con su-exec.
ENTRYPOINT ["/entrypoint.sh"]
CMD ["sh", "-c", "node migrate.js && node server.js"]
