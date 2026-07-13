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

# Usuario sin privilegios de root
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Archivos generados por `output: standalone`
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static   ./.next/static
# Carpeta public (imágenes, svgs, etc.) — también destino de las fotos subidas
# desde /admin, por eso el volumen se monta acá (ver docker-compose.yml).
COPY --from=builder --chown=nextjs:nodejs /app/public          ./public
# Script de migraciones + los .sql que aplica (drizzle/), para correrlo antes
# de levantar el server en cada arranque del contenedor.
COPY --from=builder --chown=nextjs:nodejs /app/docker-dist/migrate.js ./migrate.js
COPY --from=builder --chown=nextjs:nodejs /app/drizzle         ./drizzle

USER nextjs
EXPOSE 3000

CMD ["sh", "-c", "node migrate.js && node server.js"]
