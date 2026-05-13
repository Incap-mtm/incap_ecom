FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Cache bust: 2026-05-12-C — forces rebuild of all subsequent layers
RUN echo "build ok"

COPY . .
RUN mkdir -p public media && ls -la
RUN npm run build

# ── Runtime ──────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# Solo dependencias de producción
COPY package*.json ./
RUN npm ci --omit=dev

# Artefactos del build
COPY --from=builder /app/.evershop ./.evershop
COPY --from=builder /app/themes ./themes
COPY --from=builder /app/extensions ./extensions
COPY --from=builder /app/config ./config
COPY --from=builder /app/public ./public

# Imágenes por defecto — se copian al volumen si está vacío en el primer arranque
COPY --from=builder /app/media /app/media-default/

# Directorio de media — Railway lo sobreescribe con su Volume
RUN mkdir -p /app/media

COPY scripts/start.sh ./scripts/start.sh
RUN chmod +x ./scripts/start.sh

ENV PORT=3000
EXPOSE 3000

CMD ["sh", "scripts/start.sh"]
