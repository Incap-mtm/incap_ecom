FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN mkdir -p public

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

# Directorio de media — Railway lo sobreescribe con su Volume
RUN mkdir -p /app/media

EXPOSE 3000

# En Railway: configura "Deploy Command" como `npm run setup` solo la primera vez
CMD ["npm", "start"]
