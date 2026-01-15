# Dockerfile para NestJS backend (build y producción)
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias de desarrollo y producción
RUN npm install

# Copia el resto del código fuente
COPY . .

# Compila la app (transpila a dist/)
RUN npm run build

# --- Imagen final ---
FROM node:20-alpine AS runner
WORKDIR /app

# Solo copia node_modules y dist desde el builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Expone el puerto (ajusta si usas otro)
EXPOSE 8000

# Run migrations and then start the app
CMD npm run migration:run && node dist/src/main.js
