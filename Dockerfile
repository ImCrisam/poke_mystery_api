# Etapa 1: Build
FROM node:20-alpine AS builder

# Define directorio de trabajo
WORKDIR /app

# Copiar package.json y lock antes para aprovechar la cache de Docker
COPY package*.json ./

# Instalar dependencias (incluyendo dev para el build)
RUN npm ci

# Copiar el resto del código
COPY . .

# Build de la app (Nest compila a dist/)
RUN npm run build


# Etapa 2: Producción
FROM node:20-alpine AS production

WORKDIR /app

# Copiar solo lo necesario para producción
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# Copiar el código compilado desde la etapa builder
COPY --from=builder /app/dist ./dist

# Opcional: copiar archivos que necesites (ej. .env.example o seeds)
# COPY --from=builder /app/prisma ./prisma

# Exponer puerto (ajústalo según tu main.ts)
EXPOSE 3000

# Arranque de la app
CMD ["node", "dist/main.js"]
